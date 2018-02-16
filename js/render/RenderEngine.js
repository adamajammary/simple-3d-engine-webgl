/**
* Render Engine
* @class
*/
class RenderEngine
{
    //
    // PUBLIC
    //

    /**
    * @return {object}
    */
    static Canvas()
    {
        return document.getElementById("webgl_canvas");
    }

    /**
    * @param {Array<number>} color
    */
    static Clear(color)
    {
        let gl = RenderEngine.GLContext();

        gl.clearColor(color[0], color[1],color[2], color[3]);
        gl.clearStencil(0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
    }

    static Draw()
    {
        // WATER RENDER PASSES
        for (let water of RenderEngine.Waters)
        {
            let cameraPosition = RenderEngine.Camera.Position();
            let waterPosition  = water.Position();
            let waterScale     = water.Scale();
            let cameraDistance = (2.0 * (cameraPosition[1] - waterPosition[1]));

            // WATER REFLECTION PASS - ABOVE WATER
            RenderEngine.Camera.Move([0.0, -cameraDistance, 0.0]);
            RenderEngine.Camera.InvertPitch();

            water.Parent().FBO().BindReflection();

            let clipMax = [  waterScale[0], waterScale[1],     waterScale[2] ];
            let clipMin = [ -waterScale[0], waterPosition[1], -waterScale[2] ];

            RenderEngine.Clear([ 0.0, 0.0, 1.0, 1.0 ]);
            RenderEngine.DrawSkybox(true,      clipMax, clipMin);
            RenderEngine.DrawTerrains(true,    clipMax, clipMin);
            RenderEngine.DrawRenderables(true, clipMax, clipMin);
            
            water.Parent().FBO().UnbindReflection();

            RenderEngine.Camera.InvertPitch();
            RenderEngine.Camera.Move([0.0, cameraDistance, 0.0]);

            // WATER REFRACTION PASS - BELOW WATER
            water.Parent().FBO().BindRefraction();

            clipMax = [  waterScale[0],  waterPosition[1], waterScale[2] ];
            clipMin = [ -waterScale[0], -waterScale[1],   -waterScale[2] ];

            RenderEngine.Clear([ 0.0, 0.0, 1.0, 1.0 ]);
            RenderEngine.DrawSkybox(true,      clipMax, clipMin);
            RenderEngine.DrawTerrains(true,    clipMax, clipMin);
            RenderEngine.DrawRenderables(true, clipMax, clipMin);

            water.Parent().FBO().UnbindRefraction();
        }
        
        // DEFAULT RENDER PASS
        RenderEngine.Clear([ 0.0, 0.2, 0.4, 1.0 ]);
        RenderEngine.DrawSelected();
        RenderEngine.DrawBoundingVolumes();
        RenderEngine.DrawScene();

        return 0;
    }

    static DrawBoundingVolumes()
    {
        if (!RenderEngine.DrawBoundingVolume)
            return -1;

        let gl = RenderEngine.GLContext();

        gl.enable(gl.DEPTH_TEST);
        gl.disable(gl.CULL_FACE);
        gl.disable(gl.BLEND);

        let oldDrawMode       = RenderEngine.DrawMode;
        RenderEngine.DrawMode = gl.LINE_STRIP;

        for (let mesh of RenderEngine.Renderables)
            RenderEngine.DrawMesh(mesh.BoundingVolume(), ShaderManager.ShaderPrograms["solid"]);

        RenderEngine.DrawMode = oldDrawMode;

        return 0;
    }    

    static DrawSelected()
    {
        let gl = RenderEngine.GLContext();

        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.CULL_FACE);
        gl.disable(gl.BLEND);

        let oldDrawMode       = RenderEngine.DrawMode;
        RenderEngine.DrawMode = gl.LINE_STRIP;

        for (let mesh of RenderEngine.Renderables)
        {
            if (!mesh.IsSelected())
                continue;

            RenderEngine.DrawMesh(mesh, ShaderManager.ShaderPrograms["solid"]);
        }

        RenderEngine.DrawMode = oldDrawMode;
    }

    /**
    * @param {boolean}       enableClipping
    * @param {Array<number>} clipMax
    * @param {Array<number>} clipMin
    */
    static DrawHUDs(enableClipping = false, clipMax = [0, 0, 0], clipMin = [0, 0, 0])
    {
        let gl = RenderEngine.GLContext();

        gl.disable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE); gl.cullFace(gl.BACK); gl.frontFace(gl.CCW);
        gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        for (let hud of RenderEngine.HUDs)
            RenderEngine.DrawMesh(hud, ShaderManager.ShaderPrograms["hud"], enableClipping, clipMax, clipMin);
    }

    /**
    * @param {boolean}       enableClipping
    * @param {Array<number>} clipMax
    * @param {Array<number>} clipMin
    */
    static DrawRenderables(enableClipping = false, clipMax = [0, 0, 0], clipMin = [0, 0, 0])
    {
        let gl = RenderEngine.GLContext();

        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE); gl.cullFace(gl.BACK); gl.frontFace(gl.CCW);
        gl.disable(gl.BLEND);

        for (let mesh of RenderEngine.Renderables) {
            RenderEngine.DrawMesh(mesh, ShaderManager.ShaderPrograms["default"], enableClipping, clipMax, clipMin);
        }
    }    

    /**
    * @param {boolean}       enableClipping
    * @param {Array<number>} clipMax
    * @param {Array<number>} clipMin
    */
    static DrawSkybox(enableClipping = false, clipMax = [0, 0, 0], clipMin = [0, 0, 0])
    {
        let gl = RenderEngine.GLContext();

        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.CULL_FACE);
        gl.disable(gl.BLEND);

        if (RenderEngine.Skybox)
            RenderEngine.DrawMesh(RenderEngine.Skybox, ShaderManager.ShaderPrograms["skybox"], enableClipping, clipMax, clipMin);
    }    

    /**
    * @param {boolean}       enableClipping
    * @param {Array<number>} clipMax
    * @param {Array<number>} clipMin
    */
    static DrawTerrains(enableClipping = false, clipMax = [0, 0, 0], clipMin = [0, 0, 0])
    {
        let gl = RenderEngine.GLContext();

        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE); gl.cullFace(gl.BACK); gl.frontFace(gl.CCW);
        gl.disable(gl.BLEND);

        for (let terrain of RenderEngine.Terrains)
            RenderEngine.DrawMesh(terrain, ShaderManager.ShaderPrograms["terrain"], enableClipping, clipMax, clipMin);
    }    

    /**
    * @param {boolean}       enableClipping
    * @param {Array<number>} clipMax
    * @param {Array<number>} clipMin
    */
    static DrawWaters(enableClipping = false, clipMax = [0, 0, 0], clipMin = [0, 0, 0])
    {
        let gl = RenderEngine.GLContext();

        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE); gl.cullFace(gl.BACK); gl.frontFace(gl.CCW);
        gl.disable(gl.BLEND);

        for (let water of RenderEngine.Waters)
            RenderEngine.DrawMesh(water, ShaderManager.ShaderPrograms["water"], enableClipping, clipMax, clipMin);
    }    
    
    /**
    * @param {boolean}       enableClipping
    * @param {Array<number>} clipMax
    * @param {Array<number>} clipMin
    */
    static DrawScene(enableClipping = false, clipMax = [0, 0, 0], clipMin = [0, 0, 0])
    {
        RenderEngine.DrawSkybox(enableClipping, clipMax, clipMin);
        RenderEngine.DrawTerrains(enableClipping, clipMax, clipMin);
        RenderEngine.DrawWaters(enableClipping, clipMax, clipMin);
        RenderEngine.DrawRenderables(enableClipping, clipMax, clipMin);
        RenderEngine.DrawHUDs(enableClipping, clipMax, clipMin);
    }

    /**
    * @param {Mesh}          mesh
    * @param {ShaderProgram} shaderProgram
    * @param {boolean}       enableClipping
    * @param {Array<number>} clipMax
    * @param {Array<number>} clipMin
    */
    static DrawMesh(mesh, shaderProgram, enableClipping = false, clipMax = [0, 0, 0], clipMin = [0, 0, 0])
    {
        if (!RenderEngine.Camera || !shaderProgram || !mesh || !mesh.IBO())
            return -1;

        let id = -1;
        let gl = RenderEngine.GLContext();

        // BIND SHADERS
        gl.useProgram(shaderProgram.Program());

        // SHADER ATTRIBUTES (BUFFERS)
        if (mesh.NBO() && ((id = shaderProgram.Attrib("vertexNormal")) >= 0))
            mesh.BindBuffer(mesh.NBO(), id, false, ArrayType.FLOAT32, 3);

        if (mesh.VBO() && ((id = shaderProgram.Attrib("vertexPosition")) >= 0))
            mesh.BindBuffer(mesh.VBO(), id, false, ArrayType.FLOAT32, 3);

        if (mesh.TBO() && ((id = shaderProgram.Attrib("vertexTextureCoords")) >= 0))
            mesh.BindBuffer(mesh.TBO(), id, false, ArrayType.FLOAT32, 2);

        // MATRICES
        if ((id = shaderProgram.Uniform("matrixModel")))
            gl.uniformMatrix4fv(id, false, mesh.Matrix());

        if ((id = shaderProgram.Uniform("matrixView")))
            gl.uniformMatrix4fv(id, false, RenderEngine.Camera.View());

        if ((id = shaderProgram.Uniform("matrixProjection")))
            gl.uniformMatrix4fv(id, false, RenderEngine.Camera.Projection());

        // CAMERA
        if ((id = shaderProgram.Uniform("camera.Position")))
            gl.uniform3fv(id, RenderEngine.Camera.Position());

        if ((id = shaderProgram.Uniform("camera.Near")))
             gl.uniform1f(id, RenderEngine.Camera.Near());

        if ((id = shaderProgram.Uniform("camera.Far")))
              gl.uniform1f(id, RenderEngine.Camera.Far());

        // CLIPPING
        if ((id = shaderProgram.Uniform("enableClipping")))
            gl.uniform1i(id, enableClipping);

        if ((id = shaderProgram.Uniform("clipMax")))
            gl.uniform3fv(id, clipMax);

        if ((id = shaderProgram.Uniform("clipMin")))
            gl.uniform3fv(id, clipMin);

        // AMBIENT LIGHT
        let ambientLightIntensity = [ 0.2, 0.2, 0.2 ];

        if ((id = shaderProgram.Uniform("ambientLightIntensity")))
            gl.uniform3fv(id, ambientLightIntensity);

        // DIRECIONAL LIGHT
        let sunLightColor     = [ 0.4, 0.4, 0.4, 1.0 ];
        let sunLightPosition  = [ 10.0, 50.0, 100.0 ];
        let sunLightDirection = [ 0.1, 0.0, -1.0 ];

        vec3.rotateX(sunLightDirection, sunLightDirection, [ 0, 0, 0 ], -(Math.PI / 4.0));

        if ((id = shaderProgram.Uniform("sunLight.Color")))
            gl.uniform4fv(id, sunLightColor);

        if ((id = shaderProgram.Uniform("sunLight.Direction")))
            gl.uniform3fv(id, sunLightDirection);

        if ((id = shaderProgram.Uniform("sunLight.Position")))
            gl.uniform3fv(id, sunLightPosition);

        if ((id = shaderProgram.Uniform("sunLight.Reflection")))
            gl.uniform1f(id, 0.6);

        if ((id = shaderProgram.Uniform("sunLight.Shine")))
            gl.uniform1f(id, 20.0);
        
        // MATERIAL COLOR
        let selectColor = [ 1.0, 0.5, 0.0, 1.0 ];

        if ((id = shaderProgram.Uniform("materialColor")))
            gl.uniform4fv(id, mesh.Color());

        if ((id = shaderProgram.Uniform("solidColor")))
            gl.uniform4fv(id, selectColor);

        if ((id = shaderProgram.Uniform("isTextured")))
            gl.uniform1i(id, mesh.IsTextured());

        // WATER
        if ((id = shaderProgram.Uniform("moveFactor")))
            gl.uniform1f(id, mesh.Parent().FBO().MoveFactor());

        if ((id = shaderProgram.Uniform("waveStrength")))
            gl.uniform1f(id, mesh.Parent().FBO().WaveStrength());

        // HUD
        if ((id = shaderProgram.Uniform("isTransparent")))
            gl.uniform1i(id, mesh.Parent().Transparent());

        // BIND TEXTURES
        for (let i = 0; i < Utils.MAX_TEXTURES; i++)
        {
            if (!mesh.Texture(i))
                continue;

            gl.uniform1i(shaderProgram.Uniform("textures[" + i + "]"),       i);
            gl.uniform2fv(shaderProgram.Uniform("textureScales[" + i + "]"), mesh.Texture(i).Scale());

            gl.activeTexture(gl.TEXTURE0 + i);
            gl.bindTexture(mesh.Texture(i).Type(), mesh.Texture(i).ID());
        }
        
        // DRAW
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.IBO());
        gl.drawElements(RenderEngine.DrawMode, mesh.NrOfIndices(), gl.UNSIGNED_INT, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

        // UNBIND TEXTURES
        for (let i = 0; i < Utils.MAX_TEXTURES; i++)
        {
            gl.activeTexture(gl.TEXTURE0 + i);
            gl.bindTexture(gl.TEXTURE_2D,       null);
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
        }
        gl.activeTexture(gl.TEXTURE0);

        // UNBIND SHADERS
        gl.useProgram(null);

        return 0;
    }

    /**
     * WebGL 2 (OpenGL ES 3.0) rendering context
     * @return {object}
     */
    static GLContext()
    {
        return RenderEngine.Canvas().getContext("webgl2", { antialias: true });
    }
    
    /**
     * 
     */
    static GPU()
    {
        let gl    = RenderEngine.GLContext();
        let glExt = gl.getExtension('WEBGL_debug_renderer_info');

        if (!glExt)
            return "";

        return gl.getParameter(glExt.UNMASKED_RENDERER_WEBGL);
    }

    /**
     * 
     */
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

        switch (mesh.Parent().Name()) {
        case "HUD":
            index = RenderEngine.HUDs.indexOf(mesh);

            if (index >= 0)
                RenderEngine.HUDs.splice(index, 1);
            break;
        case "Skybox":
            RenderEngine.Skybox = null;
            break;
        case "Terrain":
            index = RenderEngine.Terrains.indexOf(mesh);

            if (index >= 0)
                RenderEngine.Terrains.splice(index, 1);
            break;
        case "Water":
            index = RenderEngine.Waters.indexOf(mesh);

            if (index >= 0)
                RenderEngine.Waters.splice(index, 1);
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
        let canvas   = RenderEngine.Canvas();
        canvas.width = width; canvas.height = height;

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
            RenderEngine.DrawMode = gl.TRIANGLES;
            break;
        case "Wireframe":
            RenderEngine.DrawMode = gl.LINE_STRIP;
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
RenderEngine.DrawMode = 0x0004;

RenderEngine.AspectRatio        = 0.5625;
RenderEngine.Camera             = null;
RenderEngine.DrawBoundingVolume = false;
RenderEngine.HUDs               = [];
RenderEngine.Renderables        = [];
RenderEngine.Skybox             = null;
RenderEngine.Terrains           = [];
RenderEngine.Waters             = [];
