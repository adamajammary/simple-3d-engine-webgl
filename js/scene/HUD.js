/**
* 2D Orthographic HUD
* @class
*/
class HUD extends Component
{
    /**
    * @param {string} quad
    */
    constructor(quad)
    {
        super("HUD");

        let text        = "";
        let textAlign   = "Middle-Center";
        let textColor   = "#000000";
        let textFont    = "Arial";
        let textSize    = 20;
        let transparent = false;

        /**
        * @param {string} align
        */
        this.SetTextAlign = function(align)
        {
            textAlign = align;
            this.Update(text);
        }

        /**
        * @param {string} hexRGB
        */
        this.SetTextColor = function(hexRGB)
        {
            textColor = hexRGB;
            this.Update(text);
        }

        /**
        * @param {string} font
        */
        this.SetTextFont = function(font)
        {
            textFont = font;
            this.Update(text);
        }

        /**
        * @param {number} size
        */
        this.SetTextSize = function(size)
        {
            textSize = size;
            this.Update(text);
        }

        /**
        * @param {boolean} newTransparent
        */
        this.SetTransparent = function(newTransparent)
        {
            transparent = newTransparent;
            this.Update(text);
        }

        /**
        * @return {string}
        */
        this.Text = function()
        {
            return text;
        }

        /**
        * @return {string}
        */
        this.TextAlign = function()
        {
            return textAlign;
        }

        /**
        * @return {string}
        */
        this.TextColor = function()
        {
            return textColor;
        }

        /**
        * @return {string}
        */
        this.TextFont = function()
        {
            return textFont;
        }

        /**
        * @return {number}
        */
        this.TextSize = function()
        {
            return textSize;
        }

        /**
        * @return {boolean}
        */
        this.Transparent = function()
        {
            return transparent;
        }

        /**
        * @param {string} newText
        */
        this.Update = function(newText)
        {
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
                if (transparent) {
                    gl2D.clearRect(0, 0, gl2D.canvas.width, gl2D.canvas.height);
                } else {
                    gl2D.fillStyle = ("#" + Utils.ToColorHex(this.Children[0].Color()));
                    gl2D.fillRect(0, 0, gl2D.canvas.width, gl2D.canvas.height);
                }

                if (this.Children[0].IsTextured())
                    gl2D.drawImage(this.Children[0].Textures[0].Image(), 0, 0, gl2D.canvas.width, gl2D.canvas.height);

                gl2D.fillStyle = textColor;
                gl2D.font      = ("bold " + textSize + "px " + textFont);

                var alignment          = textAlign.split("-");
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

                var texture = new Texture(gl2D.canvas, "", false, false, true);
                this.Children[0].LoadTexture(texture, 5);
            }
        }

        /**
         * MAIN
         */
        this.type     = ComponentType.HUD;
        this.Children = Utils.LoadModel(quad, this);
        this.isValid  = (this.Children.length > 0);

        if (this.isValid && this.Children[0])
        {
            this.Children[0].Name = "Mesh (HUD)";
            this.Children[0].MoveTo([ 0.72, 0.7, 0.0 ]);
            this.Children[0].ScaleTo([ 0.25, 0.25, 0.0 ]);

            this.Update("HUD");
        }
    }
}
