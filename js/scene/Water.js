/**
* Water
* @class
*/
class Water extends Component
{
    /**
    * @param {string}        planeText
    * @param {string}        planeFile
    * @param {Array<object>} images Array<{ file:string, name:string, result:HTMLImageElement }>
    */
    constructor(planeText, planeFile, images)
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
        this.Children = Utils.LoadModel(planeText, planeFile, this);
        this.isValid  = (this.Children.length > 0);

        if (this.isValid && this.Children[0])
        {
            this.Children[0].Name = "Mesh (Water)";

            for (var i = 0; i < MAX_TEXTURES; i++)
                this.Children[0].LoadTexture(fbo.Textures[i], i);
        }
    }
}
