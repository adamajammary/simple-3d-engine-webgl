/**
* Water Frame Buffer Object
* @class
*/
class WaterFBO
{
    /**
    * @param {Array<object>} images Array<{ file:string, name:string, result:HTMLImageElement }>
    */
    constructor(images)
    {
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

        /**
        * @return {FrameBuffer}
        */
        this.ReflectionFBO = function()
        {
            return this.reflectionFBO;
        }
        
        /**
        * @return {FrameBuffer}
        */
        this.RefractionFBO = function()
        {
            return this.refractionFBO;
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
        let moveFactor    = 0.0;
        
        this.Speed        = 0.05;
        this.WaveStrength = 0.05;
        this.Textures     = [ null, null, null, null, null, null ];

        let FBO_TEXTURE_HEIGHT = (FBO_TEXTURE_SIZE * RenderEngine.AspectRatio);
    
        // WATER REFLECTION - ABOVE WATER
        let reflectionFBO = new FrameBuffer(FBO_TEXTURE_SIZE, FBO_TEXTURE_HEIGHT, FBOType.COLOR, TextureType.TEX_2D);

        // WATER REFRACTION - BELOW WATER
        let refractionFBO = new FrameBuffer(FBO_TEXTURE_SIZE, FBO_TEXTURE_HEIGHT, FBOType.COLOR, TextureType.TEX_2D);

        // TEXTURES
        this.Textures[0] = reflectionFBO.Texture();
        this.Textures[1] = refractionFBO.Texture();
        this.Textures[2] = new Texture([ images[0] ], TextureType.TEX_2D, FBOType.UNKNOWN, 0, 0, true);
        this.Textures[3] = new Texture([ images[1] ], TextureType.TEX_2D, FBOType.UNKNOWN, 0, 0, true);
        this.Textures[4] = Utils.EmptyTexture;
        this.Textures[5] = Utils.EmptyTexture;
    }
}
