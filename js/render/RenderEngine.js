/**
* Render Engine
* @class
*/
class RenderEngine
{
    /**
    * @return {HTMLCanvasElement}
    */
    static Canvas()
    {
        return document.getElementById("webgl_canvas");
    }

    /**
    * @param {Array<number>} color
    */
    static clear(color)
    {
        let gl = RenderEngine.GLContext();

        gl.clearColor(color[0], color[1],color[2], color[3]);
        gl.clearStencil(0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
    }

    static createDepthFBO()
    {
        if (RenderEngine.Renderables.length === 0)
            return;

	    let cleared = false;

        for (let i = 0; i < MAX_LIGHT_SOURCES; i++)
        {
            if (!Utils.LightSources[i])
                continue;

            let fbo   = null;
            let light = Utils.LightSources[i];

            switch (light.SourceType()) {
                case LightType.DIRECTIONAL: fbo = Utils.DepthMap2D;   break;
                case LightType.POINT:       fbo = Utils.DepthMapCube; break;
                case LightType.SPOT:        fbo = Utils.DepthMap2D;   break;
                default: break;
            }

            if (!fbo)
                continue;

            let drawProperties = new DrawProperties();

            drawProperties.DepthLayer = i;
            drawProperties.FBO        = fbo;
            drawProperties.Light      = light;

            if (light.SourceType() === LightType.POINT)
                drawProperties.Shader = ShaderID.DEPTH_OMNI;
            else
                drawProperties.Shader = ShaderID.DEPTH;

            // BIND
            fbo.Bind(drawProperties.DepthLayer);

            // CLEAR
            if (light.SourceType() === LightType.POINT)
            {
                if (!cleared) {
                    RenderEngine.clear(CLEAR_VALUE_DEPTH, drawProperties);
                    cleared = true;
                }
            } else {
                RenderEngine.clear(CLEAR_VALUE_DEPTH, drawProperties);
            }

            // DRAW
            RenderEngine.drawRenderables(drawProperties);

            // UNBIND
            fbo.Unbind();
        }
    }

    static createWaterFBOs()
    {
        for (let component of RenderEngine.Renderables)
        {
            if (!component || (component.Type() !== ComponentType.WATER))
                continue;
    
            let water = component.Parent;
    
            if (!water)
                continue;
    
            let position       = component.Position();
            let scale          = vec3.create();
            let cameraDistance = ((RenderEngine.Camera.Position().y - position.y) * 2.0);
    
            vec3.add(scale, component.Scale(), vec3.fromValues(5.0, 5.0, 5.0));

            // WATER REFLECTION PASS - ABOVE WATER
            RenderEngine.Camera.MoveBy(vec3.fromValues(0.0, -cameraDistance, 0.0));
            RenderEngine.Camera.InvertPitch();

            water.FBO().BindReflection();
    
            let drawProperties = new DrawProperties();
    
            drawProperties.EnableClipping  = true;
            drawProperties.FBO             = water.FBO().ReflectionFBO();
    		drawProperties.ClipMax         = vec3.fromValues((position.x + scale.x), (position.y + scale.y), (position.z + scale.z));
    		drawProperties.ClipMin         = vec3.fromValues((position.x - scale.x),  position.y,            (position.z - scale.z));

            RenderEngine.clear(CLEAR_VALUE_COLOR, drawProperties);
    
            RenderEngine.drawSkybox(drawProperties);
            RenderEngine.drawRenderables(drawProperties);
            
            water.FBO().UnbindReflection();
    
            RenderEngine.Camera.InvertPitch();
            RenderEngine.Camera.MoveBy(vec3.fromValues(0.0, cameraDistance, 0.0));
    
            // WATER REFRACTION PASS - BELOW WATER
            water.FBO().BindRefraction();
    
            drawProperties.ClipMax.y = position.y;
            drawProperties.ClipMin.y = (position.y - scale.y);
            drawProperties.FBO       = water.FBO().RefractionFBO();
    
            RenderEngine.clear(CLEAR_VALUE_COLOR, drawProperties);
    
            RenderEngine.drawSkybox(drawProperties);
            RenderEngine.drawRenderables(drawProperties);
    
            water.FBO().UnbindRefraction();
        }        
    }

    static Draw()
    {
        RenderEngine.createDepthFBO();
        RenderEngine.createWaterFBOs();
    
        RenderEngine.clear(CLEAR_VALUE_DEFAULT, {});
        RenderEngine.drawScene();
    }

    static drawBoundingVolumes()
    {
        if (!RenderEngine.DrawBoundingVolume)
            return 1;

        let gl = RenderEngine.GLContext();

        let oldDrawMode       = RenderEngine.drawMode;
        RenderEngine.drawMode = gl.LINE_STRIP;

        let properties = new DrawProperties();

        properties.DrawBoundingVolume = true;
        properties.Shader             = ShaderID.WIREFRAME;

        RenderEngine.drawMeshes(RenderEngine.Renderables, properties);

        RenderEngine.drawMode = oldDrawMode;

        return 0;
    }    

    /**
    * @param {boolean}       enableClipping
    * @param {Array<number>} clipMax
    * @param {Array<number>} clipMin
    */
    static drawHUDs()
    {
        if (RenderEngine.HUDs.length === 0)
            return 1;

        let gl = RenderEngine.GLContext();

        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.CULL_FACE);
        gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        let properties    = new DrawProperties();
        properties.Shader = (RenderEngine.drawMode === gl.TRIANGLES ? ShaderID.HUD : ShaderID.WIREFRAME);
    
        RenderEngine.drawMeshes(RenderEngine.HUDs, properties);
    }

    static drawLightSources()
    {
        if (RenderEngine.LightSources.length === 0)
            return 1;
    
        let gl = RenderEngine.GLContext();

        gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LESS);
        gl.enable(gl.CULL_FACE);  gl.cullFace(gl.BACK); gl.frontFace(gl.CCW);
        gl.disable(gl.BLEND);
    
        let properties    = new DrawProperties();
        properties.Shader = (RenderEngine.drawMode === gl.TRIANGLES ? ShaderID.COLOR : ShaderID.WIREFRAME);
    
        RenderEngine.drawMeshes(RenderEngine.LightSources, properties);
    
        return 0;
    }
    
    /**
    * @param {boolean}       enableClipping
    * @param {Array<number>} clipMax
    * @param {Array<number>} clipMin
    * @param {DrawProperties} properties
    */
    static drawRenderables(properties)
    {
        if (RenderEngine.Renderables.length === 0)
            return 1;
    
        let gl = RenderEngine.GLContext();

        gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LESS);
        gl.enable(gl.CULL_FACE);  gl.cullFace(gl.BACK); gl.frontFace(gl.CCW);
        gl.disable(gl.BLEND);

        if (properties.Shader === ShaderID.UNKNOWN)
            properties.Shader = (RenderEngine.drawMode == gl.TRIANGLES ? ShaderID.DEFAULT : ShaderID.WIREFRAME);

        RenderEngine.drawMeshes(RenderEngine.Renderables, properties);

        properties.Shader = ShaderID.UNKNOWN;
    }    

    static drawSelected()
    {
        let gl = RenderEngine.GLContext();

        gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LESS);
        gl.enable(gl.CULL_FACE);  gl.cullFace(gl.BACK); gl.frontFace(gl.CCW);
        gl.disable(gl.BLEND);

        let oldDrawMode       = RenderEngine.drawMode;
        RenderEngine.drawMode = gl.LINE_STRIP;

        let properties = new DrawProperties();

        properties.DrawSelected = true;
        properties.Shader       = ShaderID.WIREFRAME;
    
        RenderEngine.drawMeshes(RenderEngine.Renderables, properties);

        RenderEngine.drawMode = oldDrawMode;
    }

    /**
    * @param {boolean}       enableClipping
    * @param {Array<number>} clipMax
    * @param {Array<number>} clipMin
    * @param {DrawProperties} properties
    */
    static drawSkybox(properties)
    {
        if (!RenderEngine.Skybox)
            return 1;

        let gl = RenderEngine.GLContext();

		gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL);
		gl.disable(gl.CULL_FACE);
		gl.disable(gl.BLEND);

        if (properties.Shader === ShaderID.UNKNOWN)
            properties.Shader = (RenderEngine.drawMode === gl.TRIANGLES ? ShaderID.SKYBOX : ShaderID.WIREFRAME);

        RenderEngine.drawMeshes([ RenderEngine.Skybox ], properties);

        properties.Shader = ShaderID.UNKNOWN;
    }    
    
    /**
    * @param {Mesh}          mesh
    * @param {ShaderID}      shaderID
    * @param {boolean}       enableClipping
    * @param {Array<number>} clipMax
    * @param {Array<number>} clipMin
    * @param {Component}      mesh
    * @param {ShaderProgram}  shaderProgram
    * @param {DrawProperties} properties
    */
    static drawMesh(mesh, shaderProgram, properties)
    {
        if (!RenderEngine.Camera || !shaderProgram || !mesh)
            return -1;

        let gl = RenderEngine.GLContext();

        // SHADER ATTRIBUTES AND UNIFORMS
        shaderProgram.UpdateAttribs(mesh);
        shaderProgram.UpdateUniforms(mesh, properties);
        
        // DRAW
        if (mesh.IBO()) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.IBO());
            gl.drawElements(RenderEngine.drawMode, mesh.NrOfIndices(), gl.UNSIGNED_INT, 0);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        } else {
            gl.bindBuffer(gl.VERTEX_ARRAY, mesh.VBO());
            gl.drawArrays(RenderEngine.drawMode, 0, mesh.NrOfVertices());
            gl.bindBuffer(gl.VERTEX_ARRAY, null);
        }

        // UNBIND TEXTURES
        for (let i = 0; i < MAX_TEXTURES; i++)
        {
            gl.activeTexture(gl.TEXTURE0 + i);
            gl.bindTexture(gl.TEXTURE_2D,       null);
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
        }

        gl.activeTexture(gl.TEXTURE6);
        gl.bindTexture(gl.TEXTURE_2D_ARRAY, null);
    
        gl.activeTexture(gl.TEXTURE0);

        return 0;
    }

    /**
    * @param {Array<Component>} meshes 
    * @param {DrawProperties}   properties 
    */ 
    static drawMeshes(meshes, properties)
    {
        let gl            = RenderEngine.GLContext();
        let shaderProgram = ShaderManager.Programs[properties.Shader];

        gl.useProgram(shaderProgram.Program());

        for (let mesh of meshes)
        {
            if (!properties.DrawBoundingVolume &&
                ((properties.DrawSelected && !mesh.IsSelected()) ||
                (!properties.DrawSelected && mesh.IsSelected())))
            {
                continue;
            }

            // SKIP RENDERING WATER WHEN CREATING FBO
            if ((mesh.Type() === ComponentType.WATER) && properties.FBO && (properties.FBO.Type() !== FBOType.UNKNOWN))
                continue;

            let oldColor = mesh.ComponentMaterial.diffuse;

            if (properties.DrawSelected)
                mesh.ComponentMaterial.diffuse = Utils.SelectColor;

            RenderEngine.drawMesh(
                (properties.DrawBoundingVolume ? mesh.BoundingVolume() : mesh), shaderProgram, properties
            );

            if (properties.DrawSelected)
                mesh.ComponentMaterial.diffuse = oldColor;
        }

        gl.useProgram(null);
    }

    /**
    * @param {boolean}       enableClipping
    * @param {Array<number>} clipMax
    * @param {Array<number>} clipMin
    */
    static drawScene()
    {
       RenderEngine.drawRenderables(new DrawProperties());
       RenderEngine.drawLightSources(new DrawProperties());
       RenderEngine.drawSelected(new DrawProperties());
       RenderEngine.drawBoundingVolumes(new DrawProperties());
       RenderEngine.drawSkybox(new DrawProperties());
       RenderEngine.drawHUDs(new DrawProperties());
    }

    /**
     * WebGL 2 (OpenGL ES 3.0) rendering context
     * @return {WebGL2RenderingContext}
     */
    static GLContext()
    {
        return RenderEngine.Canvas().getContext("webgl2", { antialias: true });
    }
    
    static GPU()
    {
        let gl    = RenderEngine.GLContext();
        let glExt = gl.getExtension('WEBGL_debug_renderer_info');

        if (!glExt)
            return "";

        return gl.getParameter(glExt.UNMASKED_RENDERER_WEBGL);
    }

    static Init()
    {
        let gl = RenderEngine.GLContext();
        
        if (!gl) {
            alert("Your browser does not support WebGL 2 (OpenGL ES 3.0).");
            return -1;
        }

        let canvas = RenderEngine.Canvas();
        gl.viewport(0, 0, canvas.width, canvas.height);

        return 0;
    }

    /**
    * @param {object} mesh 
    */
    static RemoveMesh(mesh)
    {
        let index;

        switch (mesh.Parent.Type()) {
        case ComponentType.HUD:
            index = RenderEngine.HUDs.indexOf(mesh);

            if (index >= 0)
                RenderEngine.HUDs.splice(index, 1);
            break;
        case ComponentType.SKYBOX:
            RenderEngine.Skybox = null;
            break;
        case ComponentType.LIGHTSOURCE:
            index = RenderEngine.LightSources.indexOf(mesh);

            if (index >= 0)
                RenderEngine.LightSources.splice(index, 1);
            break;
        default:
            index = RenderEngine.Renderables.indexOf(mesh);

            if (index >= 0)
                RenderEngine.Renderables.splice(index, 1);
            break;
        }
    }
    
    /**
    * @param {number} ratio
    */
    static SetAspectRatio(ratio)
    {
        let canvas               = RenderEngine.Canvas();
        let index                = (ratio.indexOf(':') + 1);
        RenderEngine.AspectRatio = (index > 0 ? ratio.substr(index) : ratio);

        RenderEngine.SetCanvasSize(canvas.width, (canvas.width * parseFloat(RenderEngine.AspectRatio)));
    }

    /**
    * @param {number} width
    * @param {number} height
    */
    static SetCanvasSize(width, height)
    {
        let canvas    = RenderEngine.Canvas();
        canvas.width  = width;
        canvas.height = height;

        RenderEngine.Camera.UpdateProjection();
        RenderEngine.GLContext().viewport(0, 0, canvas.width, canvas.height);
    }
    
    /**
    * @param {string} mode
    */
    static SetDrawMode(mode)
    {
        let gl     = RenderEngine.GLContext();
        let index  = (mode.indexOf(':') + 1);
        mode       = (index > 0 ? mode.substr(index) : mode);

        switch (mode) {
        case "Filled":
            RenderEngine.drawMode = gl.TRIANGLES;
            break;
        case "Wireframe":
            RenderEngine.drawMode = gl.LINE_STRIP;
            break;
        default:
            break;
        }
    }
}

// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants
// POINTS         0x0000
// LINES          0x0001
// LINE_LOOP	  0x0002
// LINE_STRIP	  0x0003
// TRIANGLES	  0x0004	
// TRIANGLE_STRIP 0x0005
// TRIANGLE_FAN   0x0006
RenderEngine.drawMode = 0x0004;

RenderEngine.AspectRatio        = 0.5625;
RenderEngine.Camera             = null;
RenderEngine.DrawBoundingVolume = false;
RenderEngine.HUDs               = [];
RenderEngine.LightSources       = [];
RenderEngine.Renderables        = [];
RenderEngine.Skybox             = null;
RenderEngine.EnableSRGB         = true;
