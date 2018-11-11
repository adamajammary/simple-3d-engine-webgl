/**
* Model
* @class
*/
class Model extends Component
{
    /**
    * @param {string} modelText
    */
    constructor(modelText)
    {
        super("Model");

        /**
         * MAIN
         */
        this.modelText = modelText;
        this.type      = ComponentType.MODEL;
        this.Children  = Utils.LoadModel(modelText, this);
        this.isValid   = (this.Children.length > 0);
    }
}
