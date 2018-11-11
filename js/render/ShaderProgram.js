/**
* Shader Program
* @class
*/
class ShaderProgram
{
    /**
    * @param {string} name
    */
    constructor(name)
    {
        let gl      = null;
        let program = null;
        
        init();

        function init()
        {
            gl      = RenderEngine.GLContext();
            program = gl.createProgram();
            
            if (!program)
                alert("ERROR: Failed to create the shader program.");
        }

        /**
        * @param  {string} attrib
        * @return {number}
        */
        this.Attrib = function(attrib)
        {
            return gl.getAttribLocation(program, attrib);
        }

        /**
        * @return {ShaderID} Shader ID
        */
        this.ID = function()
        {
            if (name == "default")
                return ShaderID.DEFAULT;
            else if (name == "hud")
                return ShaderID.HUD;
            else if (name == "skybox")
                return ShaderID.SKYBOX;
            else if (name == "solid")
                return ShaderID.SOLID;
            else if (name == "terrain")
                return ShaderID.TERRAIN;
            else if (name == "water")
                return ShaderID.WATER;
            
            return ShaderID.UNKNOWN;
        }

        this.Link = function()
        {
            gl.linkProgram(program);

            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                alert("ERROR: Failed to link the shader program:\n" + gl.getProgramInfoLog(program));
                return -1;
            }

            // DEBUG
            gl.validateProgram(program);

            if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
                alert("ERROR: Failed to validate the shader program:\n" + gl.getProgramInfoLog(program));
                return -1;
            }

            return 0;
        }

        /**
        * @param {string} vs
        * @param {string} fs
        * @param {string} vsFile
        * @param {string} fsFile
        */
        this.LoadAndLink = function(vs, fs, vsFile, fsFile)
        {
            var result = this.LoadShader(gl.VERTEX_SHADER, vs, vsFile);

            if (result != 0)
                return -1;

            result = this.LoadShader(gl.FRAGMENT_SHADER, fs, fsFile);

            if (result != 0)
                return -1;

            result = this.Link();

            if (result != 0)
                return -1;

            return 0;
        }

        /**
        * @param {number} type
        * @param {string} sourceText
        * @param {string} shaderFile
        */
        this.LoadShader = function(type, sourceText, shaderFile)
        {
            if ((type !== gl.VERTEX_SHADER) && (type !== gl.FRAGMENT_SHADER)) {
                alert("ERROR: Unknown shader type '" + type + "': " + shaderFile);
                return -1;
            }

            var shader = gl.createShader(type);

            if (!shader) {
                alert("ERROR: Failed to create the shader: " + shaderFile);
                return -1;
            }
            
            gl.shaderSource(shader, sourceText);
            gl.compileShader(shader);

            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                alert("ERROR: Failed to compile the shader (" + shaderFile + "):\n" + gl.getShaderInfoLog(shader));
                return -1;
            }

            gl.attachShader(program, shader);
            
            return 0;
        }

        /**
        * @return {object}
        */
        this.Program = function()
        {
            return program;
        }

        /**
        * @param  {string} uniform
        * @return {object}
        */
        this.Uniform = function(uniform)
        {
            return gl.getUniformLocation(program, uniform);
        }

        /**
        * @param {Mesh} mesh
        */
        this.UpdateAttribs = function(mesh)
        {
            let id;
            
            // SHADER ATTRIBUTES (BUFFERS)
            if (mesh.NBO() && ((id = this.Attrib("VertexNormal")) >= 0))
                mesh.BindBuffer(mesh.NBO(), id, false, ArrayType.FLOAT32, 3);
    
            if (mesh.VBO() && ((id = this.Attrib("VertexPosition")) >= 0))
                mesh.BindBuffer(mesh.VBO(), id, false, ArrayType.FLOAT32, 3);
    
            if (mesh.TBO() && ((id = this.Attrib("VertexTextureCoords")) >= 0))
                mesh.BindBuffer(mesh.TBO(), id, false, ArrayType.FLOAT32, 2);
        }

        /**
        * @param {Mesh}          mesh
        * @param {boolean}       enableClipping
        * @param {Array<number>} clipMax
        * @param {Array<number>} clipMin
        */
        this.UpdateUniforms = function(mesh, enableClipping = false, clipMax = [0, 0, 0], clipMin = [0, 0, 0])
        {
            let id;
            let removeTranslation = (this.ID() === ShaderID.SKYBOX);

            // MATRICES
            if ((id = this.Uniform("MatrixModel")))
                gl.uniformMatrix4fv(id, false, mesh.Matrix());

            if ((id = this.Uniform("MatrixView")))
                gl.uniformMatrix4fv(id, false, RenderEngine.Camera.View(removeTranslation));

            if ((id = this.Uniform("MatrixProjection")))
                gl.uniformMatrix4fv(id, false, RenderEngine.Camera.Projection());

            if ((id = this.Uniform("MatrixMVP")))
                gl.uniformMatrix4fv(id, false, RenderEngine.Camera.MVP(mesh.Matrix(), removeTranslation));

            // CAMERA
            if ((id = this.Uniform("CameraMain.Position")))
                gl.uniform3fv(id, RenderEngine.Camera.Position());

            if ((id = this.Uniform("CameraMain.Near")))
                gl.uniform1f(id, RenderEngine.Camera.Near());

            if ((id = this.Uniform("CameraMain.Far")))
                gl.uniform1f(id, RenderEngine.Camera.Far());

            // CLIPPING
            if ((id = this.Uniform("EnableClipping")))
                gl.uniform1i(id, enableClipping);

            if ((id = this.Uniform("ClipMax")))
                gl.uniform3fv(id, clipMax);

            if ((id = this.Uniform("ClipMin")))
                gl.uniform3fv(id, clipMin);

            // AMBIENT LIGHT
            let ambientLightIntensity = [ 0.2, 0.2, 0.2 ];

            if ((id = this.Uniform("Ambient")))
                gl.uniform3fv(id, ambientLightIntensity);

            // DIRECIONAL LIGHT
            let sunLightColor     = [ 0.4, 0.4, 0.4, 1.0 ];
            let sunLightPosition  = [ 10.0, 50.0, 100.0 ];
            // let sunLightDirection = [ 0.1, 0.0, -1.0 ];
            let sunLightDirection = [ -0.1, -0.5, -1.0 ];

            //vec3.rotateX(sunLightDirection, sunLightDirection, [ 0, 0, 0 ], -(Math.PI / 4.0));

            if ((id = this.Uniform("SunLight.Color")))
                gl.uniform4fv(id, sunLightColor);

            if ((id = this.Uniform("SunLight.Direction")))
                gl.uniform3fv(id, sunLightDirection);

            if ((id = this.Uniform("SunLight.Position")))
                gl.uniform3fv(id, sunLightPosition);

            if ((id = this.Uniform("SunLight.Reflection")))
                gl.uniform1f(id, 0.6);

            if ((id = this.Uniform("SunLight.Shine")))
                gl.uniform1f(id, 20.0);
            
            // MATERIAL COLOR
            //let selectColor = [ 1.0, 0.5, 0.0, 1.0 ];

            if ((id = this.Uniform("MaterialColor")))
                gl.uniform4fv(id, mesh.Color());

            if (mesh.Parent && (id = this.Uniform("Color")))
                gl.uniform4fv(id, (mesh.BoundingVolume() ? mesh.Color() : mesh.Parent.Color()));
                //gl.uniform4fv(id, selectColor);

            if ((id = this.Uniform("IsTextured")))
                gl.uniform1i(id, mesh.IsTextured());

            // WATER
            if (mesh.Parent && (id = this.Uniform("MoveFactor")))
                gl.uniform1f(id, mesh.Parent.FBO().MoveFactor());

            if (mesh.Parent && (id = this.Uniform("WaveStrength")))
                gl.uniform1f(id, mesh.Parent.FBO().WaveStrength);

            // HUD
            if (mesh.Parent && (id = this.Uniform("IsTransparent")))
                gl.uniform1i(id, mesh.Parent.Transparent());

            // BIND TEXTURES
            for (let i = 0; i < Utils.MAX_TEXTURES; i++)
            {
                if (!mesh.Textures[i])
                    continue;

                gl.uniform1i(this.Uniform("Textures[" + i + "]"),       i);
                gl.uniform2fv(this.Uniform("TextureScales[" + i + "]"), mesh.Textures[i].Scale());

                gl.activeTexture(gl.TEXTURE0 + i);
                gl.bindTexture(mesh.Textures[i].Type(), mesh.Textures[i].ID());
            }
        }
    }
}