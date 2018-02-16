/**
* Texture
* @class
*/
class Texture
{
    /**
    * @param {object}        image      // Cubemap: {Array<object>} image
    * @param {string}        file
    * @param {boolean}       cubeMap
    * @param {boolean}       repeat
    * @param {boolean}       flipY
    * @param {Array<number>} scale
    * @param {boolean}       depth
    * @param {boolean}       color
    * @param {number}        width
    * @param {number}        height
    */
    constructor(image, file, cubeMap = false, repeat = false, flipY = false, scale = [ 1.0, 1.0 ], depth = false, color = false, width = 100, height = 100)
    {
        //
        // PRIVATE
        //

        var id = null;
        var type;

        //
        // PUBLIC
        //

        /**
        * @return {string}
        */
        this.File = function()
        {
            return file;
        }

        /**
        * @return {boolean}
        */
        this.FlipY = function()
        {
            return flipY;
        }

        /**
        * @return {object}
        */
        this.ID = function()
        {
            return id;
        }

        /**
        * 2D Texture source
        * @return {string}
        */
        this.ImageSource = function()
        {
            return (image ? image.src : "");
        }

        /**
        * 2D Texture image
        * @return {object}
        */
        this.Image = function()
        {
            return (image ? image : null);
        }

        /**
        * @return {boolean}
        */
        this.Repeat = function()
        {
            return repeat;
        }

        /**
        * @return {Array<number>}
        */
        this.Scale = function()
        {
            return scale;
        }

        /**
        * @param {Array<number>} newScale
        */
        this.SetScale = function(newScale)
        {
            if (!isNaN(parseFloat(newScale[0])) && !isNaN(parseFloat(newScale[1]))) {
                scale = newScale;
            }
        }

        this.SetFlipY = function(newFlipY)
        {
            flipY = newFlipY;
            create();
        }

        this.SetRepeat = function(newRepeat)
        {
            repeat = newRepeat;
            create();
        }

        /**
        * @return {number}
        */
        this.Type = function()
        {
            return type;
        }

        //
        // PRIVATE
        //

        function create()
        {
            var gl = RenderEngine.GLContext();

            id = gl.createTexture();

            if (!id) {
                alert("ERROR: Failed to create the texture.");
                return -1;
            }

            type = (cubeMap ? gl.TEXTURE_CUBE_MAP : gl.TEXTURE_2D);

            gl.bindTexture(type, id);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY);

            if (cubeMap) {
                gl.texParameteri(type, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(type, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(type, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
            } else if (repeat) {
                gl.texParameteri(type, gl.TEXTURE_WRAP_S, gl.REPEAT);
                gl.texParameteri(type, gl.TEXTURE_WRAP_T, gl.REPEAT);
            } else {
                gl.texParameteri(type, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(type, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            }

            // 2D TEXTURE FROM IMAGE
            if (!cubeMap && image)
            {
                gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
                gl.texParameteri(type, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
                gl.texParameteri(type, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texImage2D(type, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                gl.generateMipmap(type);
                gl.disable(gl.BLEND);
            }
            // CUBE MAP FROM 6 IMAGES
            else if (cubeMap && image && (image.length == Utils.MAX_TEXTURES))
            {
                for (var i = 0; i < Utils.MAX_TEXTURES; i++)
                {
                    // TEXTURE_CUBE_MAP_POSITIVE_X 0x8515   // RIGHT
                    // TEXTURE_CUBE_MAP_NEGATIVE_X 0x8516   // LEFT
                    // TEXTURE_CUBE_MAP_POSITIVE_Y 0x8517   // TOP
                    // TEXTURE_CUBE_MAP_NEGATIVE_Y 0x8518   // BOTTOM
                    // TEXTURE_CUBE_MAP_POSITIVE_Z 0x8519   // BACK  ???
                    // TEXTURE_CUBE_MAP_NEGATIVE_Z 0x851A   // FRONT ???
                    gl.texImage2D(
                        (gl.TEXTURE_CUBE_MAP_POSITIVE_X + i), 0,
                        gl.RGBA, image[i].width, image[i].height, 0,
                        gl.RGBA, gl.UNSIGNED_BYTE, image[i]
                    );
                }

                gl.texParameteri(type, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(type, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            }
            // DEPTH
            else if (depth)
            {
                gl.texParameteri(type, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                gl.texParameteri(type, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                gl.texImage2D(type, 0, gl.DEPTH_COMPONENT32F, width, height, 0, gl.DEPTH_COMPONENT, gl.FLOAT, null);
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, type, id, 0);
            }
            // COLOR
            else if (color)
            {
                gl.texParameteri(type, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(type, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texImage2D(type, 0, gl.RGB, width, height, 0, gl.RGB, gl.UNSIGNED_BYTE, null);
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, type, id, 0);
            }
            else
            {
                alert("ERROR: The texture image is invalid.");
                id   = null;
                file = "";
            }

            gl.bindTexture(type, null);

            return 0;
        }
        
        //
        // MAIN
        //

        create();
    }
}
