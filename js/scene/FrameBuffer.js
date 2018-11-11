/**
* Frame Buffer
* @class
*/
class FrameBuffer
{
    /**
    * @param {number} width
    * @param {number} height
    */
    constructor(width, height)
    {
        let colorTexture = null;
        let depthTexture = null;
        let gl           = RenderEngine.GLContext();
        let id           = null;
        let renderBuffer = null;

        /**
        * @param  {number} format
        * @param  {number} attachment
        * @return {object}
        */       
        this.AttachRenderBuffer = function(format, attachment)
        {
            this.Bind();

            renderBuffer = gl.createRenderbuffer();

            gl.bindRenderbuffer(gl.RENDERBUFFER, renderBuffer);
            gl.renderbufferStorage(gl.RENDERBUFFER, format, width, height);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, attachment, gl.RENDERBUFFER, renderBuffer);
            gl.bindRenderbuffer(gl.RENDERBUFFER, null);

            this.Unbind();
        }

        this.Bind = function()
        {
            gl.bindTexture(gl.TEXTURE_2D, null);
            gl.bindFramebuffer(gl.FRAMEBUFFER, id);
            gl.viewport(0, 0, width, height);
        }

        this.ColorTexture = function()
        {
            return colorTexture;
        }

        this.CreateColorTexture = function()
        {
            this.Bind();
            colorTexture = new Texture(null, "framebuffer_color_texture", false, true, false, [ 1.0, 1.0 ], false, true, width, height);
            this.Unbind();
        }

        this.CreateDepthTexture = function()
        {
            this.Bind();
            depthTexture = new Texture(null, "framebuffer_depth_texture", false, true, false, [ 1.0, 1.0 ], true, false, width, height);
            this.Unbind();
        }

        this.DepthTexture = function()
        {
            return depthTexture;
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
        this.ID = function()
        {
            return id;
        }
       
        this.Unbind = function()
        {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.viewport(0, 0, RenderEngine.Canvas().width, RenderEngine.Canvas().height);
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
        id = gl.createFramebuffer();
            
        if (id) {
            this.Bind();
            gl.drawBuffers([ gl.COLOR_ATTACHMENT0 ]);
            this.Unbind();
        } else {
            alert("ERROR: Failed to create the frame buffer.");
        }

    }
}
