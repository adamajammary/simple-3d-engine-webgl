/**
* 2D Orthographic HUD
* @class
*/
class HUD extends Component
{
    /**
    * @param {string} quadText
    * @param {string} quadFile
    */
    constructor(quadText, quadFile)
    {
        super("HUD");
        
        this.type     = ComponentType.HUD;
        this.Children = Utils.LoadModel(quadText, quadFile, this);
        this.isValid  = (this.Children.length > 0);

        this.TextAlign   = "Middle-Center";
        this.TextColor   = "#000000";
        this.TextFont    = "Arial";
        this.TextSize    = 20;
        this.Transparent = false;

        let text = "";

        /**
        * @return {string}
        */
        this.Text = function()
        {
            return text;
        }

        /**
        * @param {string} newText
        */
        this.Update = function(newText = null)
        {
            if (newText)
                text = newText;

            var canvas = null;
            var gl2D   = null;

            if (this.Children[0])
            {
                canvas        = document.createElement("canvas");
                canvas.width  = (RenderEngine.Canvas().width  * this.Children[0].Scale()[0]);
                canvas.height = (RenderEngine.Canvas().height * this.Children[0].Scale()[1]);
            }

            if (canvas)
                gl2D = canvas.getContext("2d", { alpha: true, antialias: true });

            if (gl2D)
            {
                if (this.Transparent) {
                    gl2D.clearRect(0, 0, gl2D.canvas.width, gl2D.canvas.height);
                } else {
                    gl2D.fillStyle = ("#" + Utils.ToColorHex(this.Children[0].ComponentMaterial.diffuse));
                    gl2D.fillRect(0, 0, gl2D.canvas.width, gl2D.canvas.height);
                }

                if (this.Children[0].IsTextured())
                    gl2D.drawImage(this.Children[0].Textures[0].Image(), 0, 0, gl2D.canvas.width, gl2D.canvas.height);

                gl2D.fillStyle = this.TextColor;
                gl2D.font      = ("bold " + this.TextSize + "px " + this.TextFont);

                var alignment          = this.TextAlign.split("-");
                var horizontalAlign    = alignment[1].toLowerCase();
                var verticalAlign      = alignment[0].toLowerCase();
                var horizontalPosition = 0;
                var verticalPosition   = 0;

                switch (horizontalAlign) {
                    case "left":   horizontalPosition = 0;                       break;
                    case "center": horizontalPosition = (gl2D.canvas.width / 2); break;
                    case "right":  horizontalPosition = gl2D.canvas.width;       break;
                }

                switch (verticalAlign) {
                    case "top":    verticalPosition = 0;                        break;
                    case "middle": verticalPosition = (gl2D.canvas.height / 2); break;
                    case "bottom": verticalPosition = gl2D.canvas.height;       break;
                }

                gl2D.textAlign    = horizontalAlign;
                gl2D.textBaseline = verticalAlign;
                gl2D.fillText(text, horizontalPosition, verticalPosition);

                var texture = new Texture([ { result: gl2D.canvas } ], TextureType.TEX_2D, FBOType.UNKNOWN, 0, 0, false, true);
                this.Children[0].LoadTexture(texture, 5);
            }
        }

        /**
        * MAIN
        */
        if (this.isValid && this.Children[0])
        {
            this.Children[0].Name = "Mesh (HUD)";
            this.Children[0].MoveTo([ 0.72, 0.7, 0.0 ]);
            this.Children[0].ScaleTo([ 0.25, 0.25, 0.0 ]);

            this.Update("HUD");
        }
    }
}
