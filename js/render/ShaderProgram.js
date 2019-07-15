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
            if (name == "color")
                return ShaderID.COLOR;
            else if (name == "default")
                return ShaderID.DEFAULT;
            else if (name == "depth")
                return ShaderID.DEPTH;
            else if (name == "depth.omni")
                return ShaderID.DEPTH_OMNI;
            else if (name == "hud")
                return ShaderID.HUD;
            else if (name == "skybox")
                return ShaderID.SKYBOX;
            
            return ShaderID.UNKNOWN;
        }

        this.Link = function()
        {
            gl.linkProgram(program);

            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                alert("ERROR: Failed to link the shader program:\n" + gl.getProgramInfoLog(program));
                return -1;
            }

            return 0;
        }

        /**
        * @param {object} vs { file:string, name:string, result:string }
        * @param {object} fs { file:string, name:string, result:string }
        * @param {object} gs { file:string, name:string, result:string }
        */
        this.LoadAndLink = function(vs, fs, gs)
        {
            if (this.LoadShader(gl.VERTEX_SHADER, vs.result, vs.name) != 0)
                return -1;

            //if (gs && (this.LoadShader(gl.GEOMETRY_SHADER, gs.result, gs.name) < 0))
            //    return -2;

            if (this.LoadShader(gl.FRAGMENT_SHADER, fs.result, fs.name) != 0)
                return -3;

            if (this.Link() != 0)
                return -4;

            return 0;
        }

        /**
        * @param {number} type
        * @param {string} sourceText
        * @param {string} shaderFile
        */
        this.LoadShader = function(type, sourceText, shaderFile)
        {
            if ((type !== gl.VERTEX_SHADER) && (type !== gl.FRAGMENT_SHADER) && (type !== gl.GEOMETRY_SHADER)) {
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
        * @param {Component}      mesh
        * @param {DrawProperties} properties
        */
        this.UpdateUniforms = function(mesh, properties)
        {
            let id;
            let removeTranslation = (this.ID() === ShaderID.SKYBOX);

            // MATRIX UNIFORMS
            if ((this.ID() === ShaderID.DEPTH) || (this.ID() === ShaderID.DEPTH_OMNI))
            {
                if ((id = this.Uniform("Model")))
                    gl.uniformMatrix4fv(id, false, mesh.Matrix());

                if ((id = this.Uniform("MVP")))
                    gl.uniformMatrix4fv(id, false, lightsource.MVP(mesh.Matrix()));

                let projection = lightSource.Projection();

                for (let i = 0; i < MAX_TEXTURES; i++) {
                    if ((id = this.Uniform("VP[" + i + "]")))
                        gl.uniformMatrix4fv(id, false, (projection * lightSource.View(i)));
                }
            }
            else
            {
                if ((id = this.Uniform("Model")))
                    gl.uniformMatrix4fv(id, false, mesh.Matrix());

                if ((id = this.Uniform("Normal")))
                {
                    let m3 = mat3.create();

                    mat3.fromMat4(m3, mesh.Matrix());
                    mat3.invert(m3, m3);
                    mat3.transpose(m3, m3);
                    
                    gl.uniformMatrix3fv(id, false, m3);
                }

                if ((id = this.Uniform("MVP")))
                    gl.uniformMatrix4fv(id, false, RenderEngine.Camera.MVP(mesh.Matrix(), removeTranslation));
            }

            // COLOR UNIFORM
            if (mesh.Parent && (id = this.Uniform("Color")))
            {
                if (mesh.Type() === ComponentType.LIGHTSOURCE)
                    gl.uniform4fv(id, (mesh.Parent.Active() ? mesh.Parent.light.material.diffuse : [ 0.0, 0.0, 0.0, 1.0 ]));
                else
                    gl.uniform4fv(id, (mesh.BoundingVolume() ? mesh.ComponentMaterial.diffuse : mesh.Parent.ComponentMaterial.diffuse));
            }

            // DEFAULT UNIFORMS
            for (let i = 0; i < MAX_LIGHT_SOURCES; i++)
            {
                let lightSource = Utils.LightSources[i];

                if (lightSource)
                {
                    let light = lightSource.GetLight();

                    if (id = this.Uniform("LightSources[" + i + "].Active"))
                        gl.uniform4fv(id, Utils.ToVec4FromBoolInt(light.active, lightSource.SourceType()));
                    if (id = this.Uniform("LightSources[" + i + "].Ambient"))
                        gl.uniform4fv(id, Utils.ToVec4FromVec3(light.material.ambient));
                    if (id = this.Uniform("LightSources[" + i + "].Attenuation"))
                        gl.uniform4fv(id, vec4.fromValues(light.attenuation.constant, light.attenuation.linear, light.attenuation.quadratic, 0.0));
                    if (id = this.Uniform("LightSources[" + i + "].Diffuse"))
                        gl.uniform4fv(id, light.material.diffuse);
                    if (id = this.Uniform("LightSources[" + i + "].Direction"))
                        gl.uniform4fv(id, Utils.ToVec4FromVec3(light.direction));
                    if (id = this.Uniform("LightSources[" + i + "].Specular"))
                        gl.uniform4fv(id, Utils.ToVec4FromVec3Float(light.material.specular.intensity, light.material.specular.shininess));
                    if (id = this.Uniform("LightSources[" + i + "].Position"))
                        gl.uniform4fv(id, Utils.ToVec4FromVec3(light.position));

                    if ((light.innerAngle > 0.1) && (light.outerAngle > light.innerAngle)) {
                        if (id = this.Uniform("LightSources[" + i + "].Angles"))
                            gl.uniform4fv(id, vec4.fromValues(Math.cos(light.innerAngle), Math.cos(light.outerAngle), 0.0, 0.0));
                    }

                    if (id = this.Uniform("LightSources[" + i + "].ViewProjection")) {
                        let vp = mat4.create();
                        mat4.multiply(vp, lightSource.Projection(), lightSource.View(0));
                        gl.uniformMatrix4fv(id, false, vp);
                    }
                } else if (id = this.Uniform("LightSources[" + i + "].Active")) {
                    gl.uniform4fv(id, vec4.fromValues(0.0, 0.0, 0.0, 0.0));
                }
            }

            for (let i = 0; i < MAX_TEXTURES; i++) {
                if (id = this.Uniform("IsTextured[" + i + "]")) {
                    gl.uniform4fv(this.Uniform("IsTextured[" + i + "]"),    Utils.ToVec4FromBool(mesh.IsTextured(i)));
                    gl.uniform4fv(this.Uniform("TextureScales[" + i + "]"), Utils.ToVec4FromVec2(mesh.Textures[i].Scale()));
                }
            }

            if (id = this.Uniform("MeshSpecular"))
                gl.uniform4fv(id, Utils.ToVec4FromVec3Float(mesh.ComponentMaterial.specular.intensity, mesh.ComponentMaterial.specular.shininess));
            if (id = this.Uniform("MeshDiffuse"))
                gl.uniform4fv(id, mesh.ComponentMaterial.diffuse);

            if (id = this.Uniform("ClipMax"))
                gl.uniform4fv(id, Utils.ToVec4FromVec3(properties.ClipMax));
            if (id = this.Uniform("ClipMin"))
                gl.uniform4fv(id, Utils.ToVec4FromVec3(properties.ClipMin));
            if (id = this.Uniform("EnableClipping"))
                gl.uniform4fv(id, Utils.ToVec4FromBool(properties.EnableClipping));

            if (id = this.Uniform("CameraPosition"))
                gl.uniform4fv(id, Utils.ToVec4FromVec3(RenderEngine.Camera.Position()));
            if (id = this.Uniform("ComponentType"))
                gl.uniform4fv(id, Utils.ToVec4FromInt(mesh.Type()));
            if (id = this.Uniform("EnableSRGB"))
                gl.uniform4fv(id, Utils.ToVec4FromBool(RenderEngine.EnableSRGB));

            if ((mesh.Type() === ComponentType.WATER) && (id = this.Uniform("WaterProps")))
                gl.uniform4fv(id, vec4.fromValues(mesh.Parent.FBO().MoveFactor(), mesh.Parent.FBO().WaveStrength, 0.0, 0.0));

            // HUD UNIFORM
            if (id = this.Uniform("MaterialColor"))
                gl.uniform4fv(id, mesh.ComponentMaterial.diffuse);
            if (mesh.Parent && (id = this.Uniform("IsTransparent")))
                gl.uniform4fv(id, Utils.ToVec4FromBool(mesh.Parent.Transparent));

            // BIND MESH TEXTURES - Texture slots: [GL_TEXTURE0, GL_TEXTURE5]
            for (let i = 0; i < MAX_TEXTURES; i++)
            {
                if (!mesh.Textures[i])
                    continue;

                if (id = this.Uniform("Textures[" + i + "]")) {
                    gl.uniform1i(id, i);
                    gl.activeTexture(gl.TEXTURE0 + i);
                    gl.bindTexture(mesh.Textures[i].TypeGL(), mesh.Textures[i].ID());
                } else {
                    gl.bindTexture(mesh.Textures[i].TypeGL(), null);
                }
            }

            // BIND DEPTH MAP - 2D TEXTURE ARRAY
            if ((id = this.Uniform("DepthMapTextures2D")) && Utils.DepthMap2D) {
                gl.uniform1i(id, 6);
                gl.activeTexture(gl.TEXTURE6);
                gl.bindTexture(gl.TEXTURE_2D_ARRAY, Utils.DepthMap2D.GetTexture().ID());
            } else {
                gl.bindTexture(gl.TEXTURE_2D_ARRAY, null);
            }

            // BIND DEPTH MAP - CUBE MAP ARRAY
            /*if ((id = this.Uniform("DepthMapTexturesCube")) && Utils.DepthMapCube) {
                gl.uniform1i(id, 7);
                gl.activeTexture(gl.TEXTURE7);
                gl.bindTexture(gl.TEXTURE_CUBE_MAP_ARRAY, Utils.DepthMapCube.GetTexture().ID());
            } else {
                gl.bindTexture(gl.TEXTURE_CUBE_MAP_ARRAY, null);
            }*/

            if (DEBUG)
            {
                gl.validateProgram(program);

                if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS))
                    alert("ERROR: Failed to validate the shader program:\n" + gl.getProgramInfoLog(program));
            }
        }
    }
}