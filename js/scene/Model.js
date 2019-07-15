/**
* Model
* @class
*/
class Model extends Component
{
    /**
    * @param {string} modelText
    * @param {string} modelFile
    */
    constructor(modelText, modelFile)
    {
        /**
         * MAIN
         */
        super("Model");

        this.type      = ComponentType.MODEL;
        this.Children  = Utils.LoadModel(modelText, modelFile, this);
        this.isValid   = (this.Children.length > 0);

        this.ModelFile = modelFile;
        this.ModelText = modelText;
    }
}
