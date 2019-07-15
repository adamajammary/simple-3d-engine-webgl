/**
* Frame Buffer
* @class
*/
class FrameBuffer
{
    /**
    * @param {number}      width
    * @param {number}      height
    * @param {FBOType}     fboType
    * @param {TextureType} textureType
    */
    constructor(width, height, fboType, textureType)
    {
        /**
        * @param {number} depthLayer
        */
        this.Bind = function(depthLayer = 0)
        {
            gl.bindTexture(gl.TEXTURE_2D,       null);
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
            gl.bindTexture(gl.TEXTURE_2D_ARRAY, null);
            //gl.bindTexture(gl.TEXTURE_CUBE_MAP_ARRAY, null);

            gl.viewport(0, 0, width, height);

            gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

            if (textureType === TextureType.TEX_2D_ARRAY)
    			gl.framebufferTextureLayer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, texture.ID(), 0, depthLayer);
        }
        
        this.Unbind = function()
        {
            gl.bindTexture(gl.TEXTURE_2D,       null);
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
            gl.bindTexture(gl.TEXTURE_2D_ARRAY, null);
            //gl.bindTexture(gl.TEXTURE_CUBE_MAP_ARRAY, null);

            gl.bindFramebuffer(gl.FRAMEBUFFER, null);

            gl.viewport(0, 0, RenderEngine.Canvas().width, RenderEngine.Canvas().height);
        }

        /**
        * @return {number}
        */
        this.Height = function()
        {
            return height;
        }

        /**
        * @return {object}
        */
        this.FBO = function()
        {
            return fbo;
        }

        this.Texture = function()
        {
            return texture;
        }

        /**
        * @return {number}
        */
        this.Width = function()
        {
            return width;
        }

        /**
        * MAIN
        */
        let gl      = RenderEngine.GLContext();
        let fbo     = gl.createFramebuffer();
        let texture = null;
        
        if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE)
            alert("ERROR! Failed to create the frame buffer");

        if (fbo)
        {
            gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

            switch (fboType) {
            case FBOType.COLOR:
                texture = new Texture([], textureType, fboType, width, height);
    
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, texture.TypeGL(), texture.ID(), 0);
                gl.drawBuffers([ gl.COLOR_ATTACHMENT0 ]);

                break;
            case FBOType.DEPTH:
                //depthTexture = new Texture(null, "framebuffer_depth_texture", false, true, false, [ 1.0, 1.0 ], true, false, width, height);
                texture = new Texture([], textureType, fboType, width, height);

                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, texture.TypeGL(), texture.ID(), 0);

                gl.drawBuffers(gl.NONE);
                gl.readBuffer(gl.NONE);

                break;
            default:
                break;
            }

            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        } else {
            alert("ERROR: Failed to create the frame buffer.");
        }
    }
}
