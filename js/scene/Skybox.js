/**
* Skybox
* @class
*/
class Skybox extends Component
{
    /**
    * @param {string}        cube
    * @param {Array<string>} images
    */
    constructor(cube, images)
    {
        super("Skybox");

        /**
         * MAIN
         */
        this.type     = ComponentType.SKYBOX;
        this.Children = Utils.LoadModel(cube, this);
        this.isValid  = (this.Children.length > 0);
        
        if (this.isValid && this.Children[0])
        {
            this.Children[0].Name = "Mesh (Skybox)";

            var texture = new Texture(images, "", true);
            this.Children[0].LoadTexture(texture, 0);

            for (var j = 1; j < Utils.MAX_TEXTURES; j++)
                this.Children[0].LoadTexture(Utils.EmptyCubemap, j);
        }
    }
}
