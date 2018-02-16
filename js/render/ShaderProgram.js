/**
* Shader Program
* @class
*/
class ShaderProgram
{
    constructor()
    {
        //
        // PRIVATE
        //

        var gl      = null;
        var program = null;

        //
        // PUBLIC
        //

        /**
        * @param  {string} attrib
        * @return {number}
        */
        this.Attrib = function(attrib)
        {
            return gl.getAttribLocation(program, attrib);
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
        */
        this.LoadAndLink = function(vs, fs)
        {
            var result = this.LoadShader(gl.VERTEX_SHADER, vs);

            if (result != 0)
                return -1;

            result = this.LoadShader(gl.FRAGMENT_SHADER, fs);

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
        */
        this.LoadShader = function(type, sourceText)
        {
            if ((type !== gl.VERTEX_SHADER) && (type !== gl.FRAGMENT_SHADER)) {
                alert("ERROR: Unknown shader type: " + type + ".");
                return -1;
            }

            var shader = gl.createShader(type);

            if (!shader) {
                alert("ERROR: Failed to create the shader: " + type + ".");
                return -1;
            }
            
            gl.shaderSource(shader, sourceText);
            gl.compileShader(shader);

            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                alert("ERROR: Failed to compile the shader (" + type + "):\n" + gl.getShaderInfoLog(shader));
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

        //
        // MAIN
        //

        gl      = RenderEngine.GLContext();
        program = gl.createProgram();
        
        if (!program)
            alert("ERROR: Failed to create the shader program.");
    }
}