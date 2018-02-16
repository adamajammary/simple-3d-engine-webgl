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
        //
        // PRIVATE
        //

        var gl            = RenderEngine.GLContext();
        var moveFactor    = 0.0;
        var reflectionFBO = null;
        var refractionFBO = null;
        var speed         = 0.05;
        var textures      = [ null, null, null, null, null, null ];
        var waveStrength  = 0.05;
        
        //
        // PUBLIC
        //
        
        /**
         * 
         */
        this.BindReflection = function()
        {
            reflectionFBO.Bind();
        }
        
        /**
         * 
         */
        this.BindRefraction = function()
        {
            refractionFBO.Bind();
        }
        
        /**
        * @return {number}
        */
        this.MoveFactor = function()
        {
            moveFactor += (speed * TimeManager.DeltaTime);
        	moveFactor  = (moveFactor >= 1.0 ? 0.0 : moveFactor);

            return moveFactor;
        }

        /**
        * @param {number} newSpeed
        */
        this.SetSpeed = function(newSpeed)
        {
            speed = newSpeed;
        }

        /**
        * @param {number} newStrength
        */
        this.SetWaveStrength = function(newStrength)
        {
            waveStrength = newStrength;
        }

        /**
        * @return {number}
        */
        this.Speed = function()
        {
            return speed;
        }

        /**
        * @return {number}
        */
        this.WaveStrength = function()
        {
            return waveStrength;
        }

        /**
        * @param  {number} index
        * @return {object}
        */
        this.Texture = function(index)
        {
            return textures[index];
        }

        /**
        * @return {Array<object>}
        */
        this.Textures = function()
        {
            return textures;
        }
        
        /**
         * 
         */
        this.UnbindReflection = function()
        {
            reflectionFBO.Unbind();
        }
        
        /**
         * 
         */
        this.UnbindRefraction = function()
        {
            refractionFBO.Unbind();
        }
        
        //
        // MAIN
        //
        
        // WATER REFLECTION - ABOVE WATER
        reflectionFBO = new FrameBuffer(320, (320.0 * RenderEngine.AspectRatio)); // 180
        reflectionFBO.AttachRenderBuffer(gl.DEPTH_COMPONENT32F, gl.DEPTH_ATTACHMENT);
        reflectionFBO.CreateColorTexture();

        // WATER REFRACTION - BELOW WATER
        refractionFBO = new FrameBuffer(1280, (1280.0 * RenderEngine.AspectRatio)); // 720);
        refractionFBO.CreateColorTexture();
        refractionFBO.CreateDepthTexture();

        // TEXTURES
        textures[0] = reflectionFBO.ColorTexture();
        textures[1] = refractionFBO.ColorTexture();
        textures[2] = new Texture(images[0], "duDvMap.png",   false, true);
        textures[3] = new Texture(images[1], "normalMap.png", false, true);
        textures[4] = refractionFBO.DepthTexture();

        for (var i = 5; i < Utils.MAX_TEXTURES; i++)
            textures[i] = Utils.EmptyTexture;
    }
}
