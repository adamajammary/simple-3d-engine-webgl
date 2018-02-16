/**
* Model
* @class
*/
class Model
{
    /**
    * @param {string} modelText
    */
    constructor(modelText)
    {
        //
        // PRIVATE
        //

        var isValid = false;
        var children  = [];
        var type      = ComponentType.MODEL;

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
        this.JSON = function()
        {
            return modelText;
        }

        /**
        * @return {string}
        */
        this.Name = function()
        {
            return "Model";
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

        this.RemoveTexture = function()
        {
            for (var child of children)
                child.RemoveTexture();
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
       
        children = Utils.LoadModel(modelText, this);
        isValid  = (children.length > 0);
    }
}
