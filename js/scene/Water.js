/**
* Water
* @class
*/
class Water
{
    /**
    * @param {string}        plane
    * @param {Array<string>} images
    */
    constructor(plane, images)
    {
        //
        // PRIVATE
        //

        var fbo      = null;
        var isValid  = false;
        var children = [];
        var type     = ComponentType.WATER;

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
        * @return {object}
        */
        this.FBO = function()
        {
            return fbo;
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
            return "Water";
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
        * @param {number} index
        * @return {object}
        */
        this.Texture = function(index)
        {
            return fbo.Texture(index);
        }

        /**
        * @return {Array<object>}
        */
        this.Textures = function()
        {
            return fbo.Textures();
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
       
        fbo      = new WaterFBO(images);
        children = Utils.LoadModel(plane, this);
        isValid  = (children.length > 0);
        
        if (isValid && children[0])
        {
            children[0].SetName("Mesh (Water)");

            for (var i = 0; i < Utils.MAX_TEXTURES; i++)
                children[0].LoadTexture(fbo.Texture(i), i);
        }
    }
}
