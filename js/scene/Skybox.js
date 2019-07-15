/**
* Skybox
* @class
*/
class Skybox extends Component
{
    /**
    * @param {string}        cubeText
    * @param {string}        cubeFile
    * @param {Array<object>} images Array<{ file:string, name:string, result:HTMLImageElement }>
    */
    constructor(cubeText, cubeFile, images)
    {
        super("Skybox");

        /**
        * MAIN
        */
        this.type     = ComponentType.SKYBOX;
        this.Children = Utils.LoadModel(cubeText, cubeFile, this);
        this.isValid  = (this.Children.length > 0);
        
        if (this.isValid && this.Children[0])
        {
            this.Children[0].Name = "Mesh (Skybox)";

            var texture = new Texture(images, TextureType.CUBEMAP);
            this.Children[0].LoadTexture(texture, 0);

            for (var j = 1; j < MAX_TEXTURES; j++)
                this.Children[0].LoadTexture(Utils.EmptyCubemap, j);
        }
    }
}
