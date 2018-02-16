/**
* Skybox
* @class
*/
class Skybox
{
    /**
    * @param {string}        cube
    * @param {Array<string>} images
    */
    constructor(cube, images)
    {
        //
        // PRIVATE
        //

        var isValid  = false;
        var children = [];
        var type     = ComponentType.SKYBOX;

        //
        // PUBLIC
        //

        /**
        * @return {number}
        */
        this.Child = function(index)
        {
            return children[index];
        }
        
        /**
        * @return {Array<object>}
        */
        this.Children = function()
        {
            return children;
        }

        /**
        * @return {boolean}
        */
        this.IsValid = function()
        {
            return isValid;
        }

        /**
        * @return {string}
        */
        this.Name = function()
        {
            return "Skybox";
        }

        /**
        * @return {object}
        */
        this.Parent = function()
        {
            return null;
        }
        
        /**
        * @param {object} child
        */
        this.RemoveChild = function(child)
        {
            var index = children.indexOf(child);

            if (index < 0)
                return -1;

            delete children[index];
            children[index] = null;

            children.splice(index, 1);
            
            return 0;
        }

        /**
        * @return {number}
        */
        this.Type = function()
        {
            return type;
        }

        //
        // MAIN
        //
       
        children  = Utils.LoadModel(cube, this);
        isValid = (children.length > 0);
        
        if (isValid && children[0])
        {
            children[0].SetName("Mesh (Skybox)");

            var texture = new Texture(images, "", true);
            children[0].LoadTexture(texture, 0);

            for (var j = 1; j < Utils.MAX_TEXTURES; j++)
                children[0].LoadTexture(Utils.EmptyCubemap, j);
        }
    }
}
