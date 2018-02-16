/**
* 2D Orthographic HUD
* @class
*/
class HUD
{
    /**
    * @param {string} quad
    */
    constructor(quad)
    {
        //
        // PRIVATE
        //

        var isValid     = false;
        var children      = [];
        var text        = "";
        var textAlign   = "Middle-Center";
        var textColor   = "#000000";
        var textFont    = "Arial";
        var textSize    = 20;
        var transparent = false;
        var type        = ComponentType.HUD;

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
            return "HUD";
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
        * @return {number}
        */
        this.Type = function()
        {
            return type;
        }

        /**
        * @param {string} newText
        */
        this.Update = function(newText)
        {
            text = newText;

            var canvas = null;
            var gl2D   = null;

            if (children[0])
            {
                canvas        = document.createElement("canvas");
                canvas.width  = (RenderEngine.Canvas().width  * children[0].Scale()[0]);
                canvas.height = (RenderEngine.Canvas().height * children[0].Scale()[1]);
            }

            if (canvas)
                gl2D = canvas.getContext("2d", { alpha: true, antialias: true });

            if (gl2D)
            {
                if (transparent) {
                    gl2D.clearRect(0, 0, gl2D.canvas.width, gl2D.canvas.height);
                } else {
                    gl2D.fillStyle = ("#" + Utils.ToColorHex(children[0].Color()));
                    gl2D.fillRect(0, 0, gl2D.canvas.width, gl2D.canvas.height);
                }

                if (children[0].IsTextured())
                    gl2D.drawImage(children[0].Texture(0).Image(), 0, 0, gl2D.canvas.width, gl2D.canvas.height);

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
                children[0].LoadTexture(texture, 5);
            }
        }

        //
        // MAIN
        //

        children = Utils.LoadModel(quad, this);
        isValid  = (children.length > 0);

        if (isValid && children[0])
        {
            children[0].SetName("Mesh (HUD)");
            children[0].SetPosition([ 0.72, 0.7, 0.0 ]);
            children[0].SetScale([ 0.25, 0.25, 0.0 ]);

            this.Update("HUD");
        }
    }
}
