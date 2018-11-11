/**
* Water Frame Buffer Object
* @class
*/
class WaterFBO
{
    /**
    * @param {Array<string>} images
    */
    constructor(images)
    {
        let gl            = RenderEngine.GLContext();
        let moveFactor    = 0.0;
        let reflectionFBO = null;
        let refractionFBO = null;

        this.BindReflection = function()
        {
            reflectionFBO.Bind();
        }
        
        this.BindRefraction = function()
        {
            refractionFBO.Bind();
        }
        
        /**
        * @return {number}
        */
        this.MoveFactor = function()
        {
            moveFactor += (this.Speed * TimeManager.DeltaTime);
        	moveFactor  = (moveFactor >= 1.0 ? 0.0 : moveFactor);

            return moveFactor;
        }

        this.UnbindReflection = function()
        {
            reflectionFBO.Unbind();
        }
        
        this.UnbindRefraction = function()
        {
            refractionFBO.Unbind();
        }

        /**
         * MAIN
         */
        
        this.Speed        = 0.05;
        this.WaveStrength = 0.05;
        this.Textures     = [ null, null, null, null, null, null ];

        // WATER REFLECTION - ABOVE WATER
        reflectionFBO = new FrameBuffer(320, (320.0 * RenderEngine.AspectRatio)); // 180
        reflectionFBO.AttachRenderBuffer(gl.DEPTH_COMPONENT32F, gl.DEPTH_ATTACHMENT);
        reflectionFBO.CreateColorTexture();

        // WATER REFRACTION - BELOW WATER
        refractionFBO = new FrameBuffer(1280, (1280.0 * RenderEngine.AspectRatio)); // 720);
        refractionFBO.CreateColorTexture();
        refractionFBO.CreateDepthTexture();

        // TEXTURES
        this.Textures[0] = reflectionFBO.ColorTexture();
        this.Textures[1] = refractionFBO.ColorTexture();
        this.Textures[2] = new Texture(images[0], "duDvMap.png",   false, true);
        this.Textures[3] = new Texture(images[1], "normalMap.png", false, true);
        this.Textures[4] = refractionFBO.DepthTexture();

        for (var i = 5; i < Utils.MAX_TEXTURES; i++)
            this.Textures[i] = Utils.EmptyTexture;
    }
}
