/**
* Texture
* @class
*/
class Texture
{
    /**
    * @param {Array<object>} images Array<{ file:string, name:string, result:HTMLImageElement }>
    * @param {TextureType}   textureType
    * @param {FBOType}       fboType
    * @param {number}        width
    * @param {number}        height
    * @param {boolean}       repeat
    * @param {boolean}       flipY
    * @param {boolean}       transparent
    * @param {Array<number>} scale
    */
    constructor(images, textureType = TextureType.TEX_2D, fboType = FBOType.UNKNOWN, width = 0, height = 0, repeat = false, flipY = false, transparent = false, scale = [ 1.0, 1.0 ])
    {
        function init()
        {
            id = gl.createTexture();

            if (!id) {
                alert("ERROR: Failed to create the texture.");
                return -1;
            }

            gl.bindTexture(glType, id);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY);

            switch (glType) {
            case gl.TEXTURE_2D:
                switch (fboType) {
                case FBOType.UNKNOWN:
                    //mipLevels = (Math.floor(Math.log2(Math.max(width, height))) + 1);

                    gl.texParameteri(glType, gl.TEXTURE_WRAP_S, (repeat && !transparent ? gl.REPEAT : gl.CLAMP_TO_EDGE));
                    gl.texParameteri(glType, gl.TEXTURE_WRAP_T, (repeat && !transparent ? gl.REPEAT : gl.CLAMP_TO_EDGE));

                    gl.texParameteri(glType, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
                    gl.texParameteri(glType, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

                    if (transparent)
                        gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
                    
                    gl.texImage2D(glType, 0, gl.SRGB8_ALPHA8, gl.RGBA, gl.UNSIGNED_BYTE, images[0].result);
                    //gl.texImage2D(glType, 0, gl.SRGB8_ALPHA8, images[0].result.width, images[0].result.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, images[0].result);
                    gl.generateMipmap(glType);

                    if (transparent)
                        gl.disable(gl.BLEND);
                    
                    break;
                case FBOType.COLOR:
                    gl.texParameteri(glType, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(glType, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

                    gl.texParameteri(glType, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                    gl.texParameteri(glType, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

                    gl.texStorage2D(glType, 1, gl.SRGB8_ALPHA8, width, height);
                    //gl.texImage2D(glType, 0, gl.SRGB8_ALPHA8, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

                    /*gl.texParameteri(glType, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                    gl.texParameteri(glType, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                    gl.texImage2D(glType, 0, gl.RGB, width, height, 0, gl.RGB, gl.UNSIGNED_BYTE, null);
                    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, glType, id, 0);*/
    
                    break;
                case FBOType.DEPTH:
                    gl.texParameteri(glType, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(glType, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

                    gl.texParameteri(glType, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                    gl.texParameteri(glType, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

                    gl.texStorage2D(glType, 1, gl.DEPTH_COMPONENT16, width, height);

                    /*gl.texParameteri(glType, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                    gl.texParameteri(glType, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                    gl.texImage2D(glType, 0, gl.DEPTH_COMPONENT32F, width, height, 0, gl.DEPTH_COMPONENT, gl.FLOAT, null);
                    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, glType, id, 0);*/

                    break;
                default:
                    break;
                }
                break;
            case gl.TEXTURE_CUBE_MAP:
                switch (fboType) {
                case FBOType.UNKNOWN:
                    gl.texParameteri(glType, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(glType, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(glType, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);

                    gl.texParameteri(glType, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                    gl.texParameteri(glType, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

                    for (let i = 0; i < MAX_TEXTURES; i++)
                    {
                        gl.texImage2D(
                            (gl.TEXTURE_CUBE_MAP_POSITIVE_X + i), 0, gl.SRGB8_ALPHA8,
                            images[i].result.width, images[i].result.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, images[i].result
                        );
                    }
                    
                    break;
                case FBOType.COLOR:
                    break;
                case FBOType.DEPTH:
                    gl.texParameteri(glType, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(glType, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(glType, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);

                    gl.texParameteri(glType, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                    gl.texParameteri(glType, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

                    for (let i = 0; i < MAX_TEXTURES; i++)
                        glTexStorage2D((gl.TEXTURE_CUBE_MAP_POSITIVE_X + i), 1, gl.DEPTH_COMPONENT16, images[i].result.width, images[i].result.height);

                    break;
                default:
                    break;
                }
                break;
            case gl.TEXTURE_2D_ARRAY:
                gl.texParameteri(glType, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(glType, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                /*gl.texParameteri(glType, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_BORDER);
                gl.texParameteri(glType, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_BORDER);

                // SET BORDER VALUES FOR CLAMP WRAPPING
                gl.texParameterf(glType, gl.TEXTURE_BORDER_COLOR, [ 1.0, 1.0, 1.0, 1.0 ]);*/

                gl.texParameteri(glType, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                gl.texParameteri(glType, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

                gl.texStorage3D(glType, 1, gl.DEPTH_COMPONENT16, width, height, MAX_LIGHT_SOURCES);

                break;
            case gl.TEXTURE_CUBE_MAP_ARRAY:
                gl.texParameteri(glType, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(glType, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(glType, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);

                gl.texParameteri(glType, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                gl.texParameteri(glType, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

                gl.texStorage3D(glType, 1, gl.DEPTH_COMPONENT16, width, height, (MAX_LIGHT_SOURCES * MAX_TEXTURES));

                break;
            default:
                break;
            }

            gl.bindTexture(glType, null);

            return 0;
        }
        
        /**
        * @param  {number} index
        * @return {string}
        */
        this.File = function(index = 0)
        {
            if ((images.length == 1) && (images[0].name !== "emptyTexture"))
                return images[0].name;
            else if ((images.length > 1) && (index < images.length) && (images[index].name !== "emptyTexture"))
                return images[index].name;

            return "";
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
        * @param  {number} index
        * @return {string}
        */
        this.ImageSource = function(index = 0)
        {
            if (images.length == 0)
                return null;

            return (images.length > 1 ? images[index].result.src : images[0].result.src);
        }

        /**
        * 2D Texture image
        * @param  {number} index
        * @return {object}
        */
        this.Image = function(index = 0)
        {
            if ((images.length == 1) && (images[0].name !== "emptyTexture"))
                return images[0].result;
            else if ((images.length > 1) && (index < images.length) && (images[index].name !== "emptyTexture"))
                return images[index].result;

            return null;
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
        this.ScaleTo = function(newScale)
        {
            if (!isNaN(parseFloat(newScale[0])) && !isNaN(parseFloat(newScale[1]))) {
                scale = newScale;
            }
        }

        /**
        * @param {boolean} newFlipY
        */
        this.SetFlipY = function(newFlipY)
        {
            flipY = newFlipY;
            init();
        }

        /**
        * @param {boolean} newRepeat
        */
        this.SetRepeat = function(newRepeat)
        {
            repeat = newRepeat;
            init();
        }

        /**
        * @param {boolean} newTransparent
        */
        this.SetTransparent = function(newTransparent)
        {
            transparent = newTransparent;
            init();
        }
        
        /**
        * @return {boolean}
        */
        this.Transparent = function()
        {
            return transparent;
        }
        
        /**
        * @return {TextureType}
        */
        this.Type = function()
        {
            return textureType;
        }

        /**
        * @return {number}
        */
        this.TypeGL = function()
        {
            return glType;
        }

        /**
        * MAIN
        */
        let gl     = RenderEngine.GLContext();
        let id     = null;
        let glType = Utils.ToGlTextureType(textureType);
        //let mipLevels = 1;

        init();
    }
}
