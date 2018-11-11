/**
* Water
* @class
*/
class Water extends Component
{
    /**
    * @param {string}        plane
    * @param {Array<string>} images
    */
    constructor(plane, images)
    {
        super("Water");

        let fbo = new WaterFBO(images);
        
        /**
        * @return {object}
        */
        this.FBO = function()
        {
            return fbo;
        }

        /**
         * MAIN
         */
        this.type     = ComponentType.WATER;
        this.Children = Utils.LoadModel(plane, this);
        this.isValid  = (this.Children.length > 0);

        if (this.isValid && this.Children[0])
        {
            this.Children[0].Name = "Mesh (Water)";

            for (var i = 0; i < Utils.MAX_TEXTURES; i++)
                this.Children[0].LoadTexture(fbo.Textures[i], i);
        }
    }
}
