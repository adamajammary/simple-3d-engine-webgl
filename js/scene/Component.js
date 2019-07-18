/**
* Component
* @class
*/
class Component
{
    /**
    * @param {string}        name
    * @param {Array<number>} position
    * @param {Array<number>} rotation
    * @param {Array<number>} scale
    */
    // @param {Array<number>} color
    constructor(name, position = [ 0.0, 0.0, 0.0 ])
    {
        /**
        * MAIN
        */
        this.autoRotation      = [ 0.0, 0.0, 0.0 ];
        this.isValid           = false;
        this.matrix            = mat4.create();
        this.modelText         = "";
        this.position          = position;
        this.rotation          = [ 0.0, 0.0, 0.0 ];
        this.rotationMatrix    = mat4.create();
        this.scale             = [ 1.0, 1.0, 1.0 ];
        this.scaleMatrix       = mat4.create();
        this.translationMatrix = mat4.create();
        this.type              = ComponentType.UNKNOWN;

        this.AutoRotate           = false;
        this.Children             = [];
        this.ComponentMaterial    = new Material();
        this.Name                 = name;
        this.Parent               = null;
        this.Textures             = [ null, null, null, null, null, null ];
        
        /**
        * @return {Array<number>}
        */
        this.AutoRotation = function()
        {
            return this.autoRotation;
        }

        /**
        * @return {string}
        */
        this.ColorHex = function()
        {
            return Utils.ToColorHex(this.ComponentMaterial.diffuse);
        }

        /**
        * @return {boolean}
        */
        this.IsTextured = function()
        {
            return (this.Textures[0] && this.Textures[0].ID() && (this.Textures[0].File() !== ""));
        }

        /**
        * @return {boolean}
        */
        this.IsValid = function()
        {
            return this.isValid;
        }

        /**
        * @param {Texture} texture
        * @param {number}  index
        */
        this.LoadTexture = function(texture, index)
        {
            this.Textures[index] = texture;

            if ((index == 0) && (this.Parent.Type() === ComponentType.HUD))
                this.Parent.Update();
        }
        
        /**
        * Model/World Matrix
        * @return {Array<number>}
        */
        this.Matrix = function()
        {
            return this.matrix;
        }

        /**
        * Moves by amount
        * @param {Array<number>} amount
        */
        this.MoveBy = function(amount)
        {
            if (!isNaN(parseFloat(amount[0])) &&
                !isNaN(parseFloat(amount[1])) &&
                !isNaN(parseFloat(amount[2])))
            {
                this.position[0] += amount[0];
                this.position[1] += amount[1];
                this.position[2] += amount[2];

                this.updateTranslation();

                if (this.Parent.Type() === ComponentType.HUD)
                    this.Parent.Update();
            }
        }

        /**
        * Moves to new position
        * @param {Array<number>} newPosition
        */
        this.MoveTo = function(newPosition)
        {
            console.log("Component.MoveTo: " + newPosition);

            if (!isNaN(parseFloat(newPosition[0])) &&
                !isNaN(parseFloat(newPosition[1])) &&
                !isNaN(parseFloat(newPosition[2])))
            {
                this.position = newPosition;
                this.updateTranslation();

                if (this.Parent.Type() === ComponentType.HUD)
                    this.Parent.Update();
            }
        }

        /**
        * @return {<Array<number>}
        */
        this.Position = function()
        {
            return this.position;
        }
        
        /**
        * @param  {object} child
        * @return {number}
        */
        this.RemoveChild = function(child)
        {
            var index = this.Children.indexOf(child);

            if (index < 0)
                return -1;

            delete this.Children[index];
            this.Children[index] = null;

            this.Children.splice(index, 1);
            
            return index;
        }

        /**
        * @param {number} index
        */
        this.RemoveTexture = function(index)
        {
            this.LoadTexture(Utils.EmptyTexture, index);
            
            //if (this.Parent.Name === "HUD")
            //  this.Parent.Update(this.Parent.Text());
            if (this.Parent.Type() === ComponentType.HUD)
                this.Parent.Update();
        }

        /**
        * Rotate by amount in radians
        * @param {Array<number>} amountRadians
        */
        this.RotateBy = function(amountRadians)
        {
            if (!isNaN(parseFloat(amountRadians[0])) &&
                !isNaN(parseFloat(amountRadians[1])))
            {
                this.rotation[0] += amountRadians[0];
                this.rotation[1] += amountRadians[1];
                this.rotation[2] += amountRadians[2];

                this.updateRotation();

                if (this.Parent.Type() === ComponentType.HUD)
                    this.Parent.Update();
            }
        }

        /**
        * Set new rotation in radians
        * @param {Array<number>} newRotationRadians
        */
        this.RotateTo = function(newRotationRadians)
        {
            if (!isNaN(parseFloat(newRotationRadians[0])) &&
                !isNaN(parseFloat(newRotationRadians[1])))
            {
                this.rotation = newRotationRadians;
                this.updateRotation();

                if (this.Parent.Type() === ComponentType.HUD)
                    this.Parent.Update();
            }
        }

        /**
        * @return {<Array<number>}
        */
        this.Rotation = function()
        {
            return this.rotation;
        }

        /**
        * @param {Array<number>} amount
        */
        this.ScaleBy = function(amount)
        {
            if (!isNaN(parseFloat(amount[0])) &&
                !isNaN(parseFloat(amount[1])) &&
                !isNaN(parseFloat(amount[2])))
            {
                this.scale[0] += amount[0];
                this.scale[1] += amount[1];
                this.scale[2] += amount[2];

                this.updateScale();

                if (this.Parent.Type() === ComponentType.HUD)
                    this.Parent.Update();
            }
        }

        /**
        * @param {Array<number>} newScale
        */
        this.ScaleTo = function(newScale)
        {
            if (!isNaN(parseFloat(newScale[0])) &&
                !isNaN(parseFloat(newScale[1])) &&
                !isNaN(parseFloat(newScale[2])))
            {
                this.scale = newScale;
                this.updateScale();

                if (this.Parent.Type() === ComponentType.HUD)
                    this.Parent.Update();
            }
        }

        /**
        * @return {<Array<number>}
        */
        this.Scale = function()
        {
            return this.scale;
        }

        /**
        * @param {Array<number>} rotationRadians
        */
        this.SetAutoRotation = function(rotationRadians)
        {
            if (!isNaN(parseFloat(rotationRadians[0])) &&
                !isNaN(parseFloat(rotationRadians[1])) &&
                !isNaN(parseFloat(rotationRadians[2])))
            {
                this.autoRotation = rotationRadians;
            }
        }

        /**
        * @param {string} newColor
        */
        this.SetColorHex = function(newColor)
        {
            let rgb = Utils.ToColorRGB(newColor.substr(1));
            this.ComponentMaterial.diffuse = [ rgb[0], rgb[1], rgb[2], 1.0 ];

            if (this.Parent.Type() === ComponentType.HUD)
                this.Parent.Update();
        }

        /**
        * @param {string} newSpecIntensity
        */
        this.SetSpecIntensityHex = function(newSpecIntensity)
        {
            let rgb = Utils.ToColorRGB(newSpecIntensity.substr(1));
            this.ComponentMaterial.specular.intensity = [ rgb[0], rgb[1], rgb[2], 1.0 ];

            if (this.Parent.Type() === ComponentType.HUD)
                this.Parent.Update();
        }

        /**
         * @param {string} newName
         */
        this.SetName = function(newName)
        {
            if (newName)
                this.Name = newName;
        }

        /**
        * @return {string}
        */
        this.SpecIntensityHex = function()
        {
            return Utils.ToColorHex(this.ComponentMaterial.specular.intensity);
        }

        /**
        * @return {number}
        */
        this.Type = function()
        {
            return this.type;
        }

        this.updateMatrix = function()
        {
            mat4.multiply(this.matrix, this.rotationMatrix,    this.scaleMatrix);
            mat4.multiply(this.matrix, this.translationMatrix, this.matrix);
        }

        this.updateRotation = function()
        {
            // RESET ROTATION AFTER 360 DEGREES (2PI)
            let fullRotation = (2.0 * Math.PI);

            for (let i = 0; i < this.rotation.length; i++)
            {
                if (this.rotation[i] > fullRotation)
                    this.rotation[i] -= fullRotation;
                else if (this.rotation[i] < -fullRotation)
                    this.rotation[i] += fullRotation;
            }

            let rotateMatrixX = mat4.create();
            let rotateMatrixY = mat4.create();
            let rotateMatrixZ = mat4.create();

            mat4.rotate(rotateMatrixX, rotateMatrixX, this.rotation[0], [ 1.0, 0.0, 0.0 ]);
            mat4.rotate(rotateMatrixY, rotateMatrixY, this.rotation[1], [ 0.0, 1.0, 0.0 ]);
            mat4.rotate(rotateMatrixZ, rotateMatrixZ, this.rotation[2], [ 0.0, 0.0, 1.0 ]);

            mat4.multiply(this.rotationMatrix, rotateMatrixY, rotateMatrixX);
            mat4.multiply(this.rotationMatrix, rotateMatrixZ, this.rotationMatrix);

            this.updateMatrix();
        }

        this.updateScale = function()
        {
            mat4.scale(this.scaleMatrix, mat4.create(), this.scale);
            this.updateMatrix();
        }

        this.updateTranslation = function()
        {
            mat4.translate(this.translationMatrix, mat4.create(), this.position);
            this.updateMatrix();
        }
    }
}
