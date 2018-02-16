/**
* Mesh
* @class
*/
class Mesh
{
    /**
    * @param {object}        model   // Parent model
    * @param {Array<number>} color
    */
    constructor(model, color = [ 0.8, 0.8, 0.8, 1.0 ])
    {
        //
        // PRIVATE
        //

        let autoRotate           = false;
        let autoRotation         = [ 0.0, 0.0, 0.0 ];
        let boundingVolume       = null;
        let boundingVolumeType   = "none";
        let gl                   = RenderEngine.GLContext();
        let isSelected           = false;
        let isValid              = false;
        let lockToParentPosition = false;
        let lockToParentRotation = false;
        let lockToParentScale    = false;
        let maxScale             = 0;
        let matrix               = mat4.create();
        let name                 = "";
        let position             = [ 0.0, 0.0, 0.0 ];
        let rotation             = [ 0.0, 0.0, 0.0 ];
        let scale                = [ 1.0, 1.0, 1.0 ];
        let textures             = [ null, null, null, null, null, null ];
        let indices              = [];
        let normals              = [];
        let textureCoords        = [];
        let vertices             = [];
        let indexBuffer          = null;
        let normalBuffer         = null;
        let textureCoordsBuffer  = null;
        let vertexBuffer         = null;
        let type                 = ComponentType.MESH;

        /**
        * @return {number}
        */
        function setMaxScale()
        {
            for (let vertex of vertices)
                maxScale = Math.max(maxScale, Math.abs(vertex));
        }

        //
        // PUBLIC
        //

        /**
        * @param {object}  bufferID
        * @param {object}  shaderAttrib
        * @param {boolean} normalized
        * @param {number}  arrayType
        * @param {number}  size
        * @param {number}  offset
        */
        this.BindBuffer = function(bufferID, shaderAttrib, normalized, arrayType, size, offset = 0)
        {
            let stride = 0;

            switch(arrayType) {
                case ArrayType.FLOAT32: stride = (size * Float32Array.BYTES_PER_ELEMENT); break;
                case ArrayType.FLOAT64: stride = (size * Float64Array.BYTES_PER_ELEMENT); break;
                case ArrayType.INT16:   stride = (size * Int16Array.BYTES_PER_ELEMENT);   break;
                case ArrayType.UINT16:  stride = (size * Uint16Array.BYTES_PER_ELEMENT);  break;
                case ArrayType.INT32:   stride = (size * Int32Array.BYTES_PER_ELEMENT);   break;
                case ArrayType.UINT32:  stride = (size * Uint32Array.BYTES_PER_ELEMENT);  break;
                case ArrayType.INT64:   stride = (size * Int64Array.BYTES_PER_ELEMENT);   break;
                case ArrayType.UINT64:  stride = (size * Uint64Array.BYTES_PER_ELEMENT);  break;
            }

            gl.bindBuffer(gl.ARRAY_BUFFER, bufferID);
            gl.vertexAttribPointer(shaderAttrib, size, gl.FLOAT, normalized, stride, offset);
            gl.enableVertexAttribArray(shaderAttrib);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
        }

        /**
        * @return {boolean}
        */
        this.AutoRotate = function()
        {
            return autoRotate;
        }

        /**
        * @return {Array<number>}
        */
        this.AutoRotation = function()
        {
            return autoRotation;
        }

        /**
        * @return {object}
        */
        this.BoundingVolume = function()
        {
            return boundingVolume;
        }

        /**
        * @return {string}
        */
        this.BoundingVolumeType = function()
        {
            return boundingVolumeType;
        }

        /**
        * @return {Array<number>}
        */
        this.Color = function()
        {
            return color;
        }

        /**
        * @return {string}
        */
        this.ColorHex = function()
        {
            return Utils.ToColorHex(color);
        }

        /**
        * Index Buffer Object
        * @return {object}
        */
        this.IBO = function()
        {
            return (indexBuffer ? indexBuffer.ID() : null);
        }

        /**
        * @return {boolean}
        */
        this.IsSelected = function()
        {
            return isSelected;
        }

        /**
        * @return {boolean}
        */
        this.IsTextured = function()
        {
            return (textures[0] && textures[0].ID() && (textures[0].File() !== ""));
        }

        /**
        * Is Valid Mesh?
        * @return {boolean}
        */
        this.IsValid = function()
        {
            return isValid;
        }

        /**
        * @param {Array<number>} vertices
        * @param {Array<number>} textureCoords
        * @param {Array<number>} normals
        * @param {Array<number>} indices
        * @param {string}        meshName
        */
        this.LoadArrays = function(vertexArray, textureCoordArray, normalArray, indexArray, meshName)
        {
            indices       = indexArray;
            normals       = normalArray;
            textureCoords = textureCoordArray;
            vertices      = vertexArray;
            name          = meshName;

            if (indices && (indices.length > 0))
                indexBuffer = new Buffer(gl.ELEMENT_ARRAY_BUFFER, ArrayType.UINT32, indices);

            if (normals && (normals.length > 0))
                normalBuffer = new Buffer(gl.ARRAY_BUFFER, ArrayType.FLOAT32, normals);

            if (textureCoords && (textureCoords.length > 0))
                textureCoordsBuffer = new Buffer(gl.ARRAY_BUFFER, ArrayType.FLOAT32, textureCoords);

            if (vertices && (vertices.length > 0))
                vertexBuffer = new Buffer(gl.ARRAY_BUFFER, ArrayType.FLOAT32, vertices);

            this.SetPosition(position);

            for (let i = 0; i < Utils.MAX_TEXTURES; i++)
                this.LoadTexture(Utils.EmptyTexture, i);

            setMaxScale();
            this.SetBoundingVolume("box");
            
            isValid = true;
        }

        /**
        * @param {object} json
        * @param {object} parent
        * @param {number} scaleSize
        * @param {string} meshName
        */
        this.LoadBoundingJSON = function(json, parent, scaleSize, meshName)
        {
            if (!json) {
                alert("ERROR: Failed to parse the bounding volume JSON.");
                return -1;
            }

            name     = meshName;
            indices  = [].concat.apply([], json.faces);
            vertices = json.vertices;

            if (indices && (indices.length > 0))
                indexBuffer = new Buffer(gl.ELEMENT_ARRAY_BUFFER, ArrayType.UINT32, indices);

            if (vertices && (vertices.length > 0))
                vertexBuffer = new Buffer(gl.ARRAY_BUFFER, ArrayType.FLOAT32, vertices);

            this.SetScale(vec3.fromValues(scaleSize, scaleSize, scaleSize));
            this.LockToParent(true, false, true);

            isValid = true;
        }

        /**
        * @param {object} parent
        * @param {number} scaleSize
        */
        this.LoadBoundingBoxJSON = function(parent, scaleSize)
        {
            this.LoadBoundingJSON(Utils.CubeJSON, parent, scaleSize, "Bounding Box");
        }

        /**
        * @param {object} parent
        * @param {number} scaleSize
        */
        this.LoadBoundingSphereJSON = function(parent, scaleSize)
        {
            this.LoadBoundingJSON(Utils.SphereJSON, parent, scaleSize, "Bounding Sphere");
        }

        /**
        * @param {object}               jsonMesh
        * @param {Array<Array<number>>} transformMatrix
        * @return {boolean}
        */
        this.LoadJSON = function(jsonMesh, transformMatrix)
        {
            if (!jsonMesh || !transformMatrix) { alert("ERROR: Failed to parse the JSON."); return -1; }

            name     = (jsonMesh.name != "" ? jsonMesh.name : "Mesh");
            indices  = [].concat.apply([], jsonMesh.faces);
            normals  = jsonMesh.normals;
            vertices = jsonMesh.vertices;

            if (jsonMesh.texturecoords && (jsonMesh.texturecoords.length > 0))
                textureCoords = jsonMesh.texturecoords[0];

            if (indices && (indices.length > 0))
                indexBuffer = new Buffer(gl.ELEMENT_ARRAY_BUFFER, ArrayType.UINT32, indices);

            if (normals && (normals.length > 0))
                normalBuffer = new Buffer(gl.ARRAY_BUFFER, ArrayType.FLOAT32, normals);

            if (textureCoords && (textureCoords.length > 0))
                textureCoordsBuffer = new Buffer(gl.ARRAY_BUFFER, ArrayType.FLOAT32, textureCoords);

            if (vertices && (vertices.length > 0))
                vertexBuffer = new Buffer(gl.ARRAY_BUFFER, ArrayType.FLOAT32, vertices);

            // https://www.gamedev.net/forums/topic/384075-extracting-scale-vector-from-a-transformation-matrix/
            // https://math.stackexchange.com/questions/237369/given-this-transformation-matrix-how-do-i-decompose-it-into-translation-rotati
            // https://en.wikipedia.org/wiki/Rotation_matrix
            // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToAngle/index.htm
            if (transformMatrix)
            {
                let m = transformMatrix;

                position = [ m[0*4+3], m[1*4+3], m[2*4+3] ];

                scale[0] = Math.sqrt(Math.pow(m[0*4+0], 2) + Math.pow(m[0*4+1], 2) + Math.pow(m[0*4+2], 2));
                scale[1] = Math.sqrt(Math.pow(m[1*4+0], 2) + Math.pow(m[1*4+1], 2) + Math.pow(m[1*4+2], 2));
                scale[2] = Math.sqrt(Math.pow(m[2*4+0], 2) + Math.pow(m[2*4+1], 2) + Math.pow(m[2*4+2], 2));

                let angle = Math.acos((m[0*4+0] + m[1*4+1] + m[2*4+2] - 1) / 2);
                let x     = Math.sqrt(Math.pow((m[2*4+1] - m[1*4+2]), 2) + Math.pow((m[0*4+2] - m[2*4+0]), 2) + Math.pow((m[1*4+0] - m[0*4+1]), 2));
                let y     = Math.sqrt(Math.pow((m[2*4+1] - m[1*4+2]), 2) + Math.pow((m[0*4+2] - m[2*4+0]), 2) + Math.pow((m[1*4+0] - m[0*4+1]), 2));
                let z     = Math.sqrt(Math.pow((m[2*4+1] - m[1*4+2]), 2) + Math.pow((m[0*4+2] - m[2*4+0]), 2) + Math.pow((m[1*4+0] - m[0*4+1]), 2));

                if (x && y && z)
                {
                    x = ((m[2*4+1] - m[1*4+2]) / x);
                    y = ((m[0*4+2] - m[2*4+0]) / y);
                    z = ((m[1*4+0] - m[0*4+1]) / z);

                    rotation = [ (angle * x), (angle * y), (angle * z) ];
                }
            }

            this.SetPosition(position);
            this.SetScale(scale);
            this.SetRotation(rotation);

            for (let i = 0; i < Utils.MAX_TEXTURES; i++)
                this.LoadTexture(Utils.EmptyTexture, i);

            setMaxScale();
            this.SetBoundingVolume("box");
            
            isValid = (this.IBO() && this.VBO());

            return isValid;
        }

        /**
        * @param {Texture} texture
        * @param {number}  index
        */
        this.LoadTexture = function(texture, index)
        {
            textures[index] = texture;

            if ((index == 0) && (model.Name() === "HUD"))
                model.Update(model.Text());
        }

        /**
        * @param {object} image
        * @param {string} file
        * @param {number} index
        */
        this.LoadTextureImage = function(image, file, index)
        {
            if (!this.TBO()) {
                alert("ERROR: The model is missing texture coordinates.");
                return -1;
            }

            textures[index] = new Texture(image, file);

            if ((index == 0) && (model.Name() === "HUD"))
                model.Update(model.Text());

            return 0;
        }

        /**
        * @param {boolean} position
        * @param {boolean} rotation
        * @param {boolean} scale
        */
        this.LockToParent = function(lockPosition, lockRotation, lockScale)
        {
            lockToParentPosition = lockPosition;
            lockToParentRotation = lockRotation;
            lockToParentScale    = lockScale;
        }

        /**
        * Model/World Matrix
        * @return {Array<number>}
        */
        this.Matrix = function()
        {
            let identityMatrix  = mat4.create();
            let rotateMatrix    = mat4.create();
            let rotateMatrixX   = mat4.create();
            let rotateMatrixY   = mat4.create();
            let rotateMatrixZ   = mat4.create();
            let scaleMatrix     = mat4.create();
            let translateMatrix = mat4.create();
            let positionVector  = vec3.create();
            let rotationVector  = rotation;
            let scaleVector     = vec3.create();

            if (lockToParentPosition)
                vec3.add(positionVector, position, model.Position());
            else
                positionVector = position;

            if (lockToParentScale)
                vec3.multiply(scaleVector, scale, model.Scale());
            else
                scaleVector = scale;

            mat4.scale(scaleMatrix, identityMatrix, scaleVector);
            
            mat4.rotateX(rotateMatrixX, identityMatrix, rotationVector[0]);
            mat4.rotateY(rotateMatrixY, identityMatrix, rotationVector[1]);
            mat4.rotateZ(rotateMatrixZ, identityMatrix, rotationVector[2]);

            mat4.multiply(rotateMatrix, rotateMatrixZ, rotateMatrixY);
            mat4.multiply(rotateMatrix, rotateMatrix,  rotateMatrixX);

            mat4.translate(translateMatrix, identityMatrix, positionVector);

            mat4.multiply(matrix, translateMatrix, rotateMatrix);
            mat4.multiply(matrix, matrix,          scaleMatrix);

            return matrix;
        }

        /**
        * @return {Array<number>}
        */
        this.MaxBoundaries = function()
        {
            let parentPosition = model.Position();
            let parentScale    = model.Scale();
            let maxScale       = (Math.max(Math.max(parentScale[0], parentScale[1]), parentScale[2]) + 0.01);

            return [ (parentPosition[0] + maxScale), (parentPosition[1] + maxScale), (parentPosition[2] + maxScale) ];
        }

        /**
        * @return {Array<number>}
        */
        this.MinBoundaries = function()
        {
            let parentPosition = model.Position();
            let parentScale    = model.Scale();
            let maxScale       = (Math.max(Math.max(parentScale[0], parentScale[1]), parentScale[2]) + 0.01);
            
            return [ (parentPosition[0] - maxScale), (parentPosition[1] - maxScale), (parentPosition[2] - maxScale) ];
        }

        /**
        * Moves by amount
        * @param {Array<number>} amount
        */
        this.Move = function(amount)
        {
            if (!isNaN(parseFloat(amount[0])) &&
                !isNaN(parseFloat(amount[1])) &&
                !isNaN(parseFloat(amount[2])))
            {
                position = vec3.add(position, position, amount);

                if (model.Name() === "HUD")
                    model.Update(model.Text());
            }
        }

        /**
        * @return {string}
        */
        this.Name = function()
        {
            return name;
        }

        /**
        * Normal Buffer Object
        * @return {object}
        */
        this.NBO = function()
        {
            return (normalBuffer ? normalBuffer.ID() : null);
        }

        /**
        * @return {number}
        */
        this.NrOfIndices = function()
        {
            return (indices ? indices.length : 0);
        }

        /**
        * @return {object}
        */
        this.Parent = function()
        {
            return model;
        }

        /**
        * @return {<Array<number>}
        */
        this.Position = function()
        {
            return position;
        }

        /**
        * @param {number} index
        */
        this.RemoveTexture = function(index)
        {
            this.LoadTexture(Utils.EmptyTexture, index);
            
            if (model.Name() == "HUD")
                model.Update(model.Text());
        }

        /**
        * Rotate by amount in radians
        * @param {Array<number>} amountRadians
        */
        this.Rotate = function(amountRadians)
        {
            if (!isNaN(parseFloat(amountRadians[0])) &&
                !isNaN(parseFloat(amountRadians[1])) &&
                !isNaN(parseFloat(amountRadians[2])))
            {
                rotation = vec3.add(rotation, rotation, amountRadians);

                if (model.Name() == "HUD")
                    model.Update(model.Text());
            }

            // RESET ROTATION AFTER 360 DEGREES (2PI)
            for (let i = 0; i < rotation.length; i++)
            {
                let fullRotation = (2.0 * Math.PI);

                if (rotation[i] > fullRotation)
                    rotation[i] -= fullRotation;
                else if (rotation[i] < -fullRotation)
                    rotation[i] += fullRotation;
            }
        }

        /**
        * @return {<Array<number>}
        */
        this.Rotation = function()
        {
            return rotation;
        }

        /**
        * @return {<Array<number>}
        */
        this.Scale = function()
        {
            return scale;
        }

        /**
        * Scale by amount
        * @param {Array<number>} amount
        */
        this.ScaleBy = function(amount)
        {
            if (!isNaN(parseFloat(amount[0])) &&
                !isNaN(parseFloat(amount[1])) &&
                !isNaN(parseFloat(amount[2])))
            {
                scale = vec3.add(scale, scale, amount);

                if (model.Name() === "HUD")
                    model.Update(model.Text());
            }
        }

        /**
        * @param {boolean} selected
        */
        this.Select = function(selected)
        {
            isSelected = selected;

            if (isSelected)
            {
                let componentElement = document.getElementById("selected_component");
                let scope            = angular.element(componentElement).scope();

                componentElement.selectedIndex = (scope.getComponentIndex(model) + 1);
                scope.component                = model;
                scope.child                    = this;

                scope.selectComponent(model);
                scope.selectChild(this);
                scope.$apply();
            }
        }

        /**
        * @param {boolean} on
        */
        this.SetAutoRotate = function(on)
        {
            autoRotate = on;
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
                autoRotation = rotationRadians;
            }
        }

        this.SetBoundingBox = function()
        {
            boundingVolume = new Mesh(this);
            boundingVolume.LoadBoundingBoxJSON(this, (maxScale + 0.01));
        }

        this.SetBoundingSphere = function()
        {
            boundingVolume = new Mesh(this);
            boundingVolume.LoadBoundingSphereJSON(this, (maxScale + 0.01));
        }

        /**
        * @param {string} type
        */
        this.SetBoundingVolume = function(type)
        {
            switch (type) {
                case "box":    this.SetBoundingBox();                break;
                case "sphere": this.SetBoundingSphere();             break;
                default:       type = "none"; boundingVolume = null; break;
            }

            boundingVolumeType = type;
        }

        /**
        * @param {Array<number>} newColor
        */
        this.SetColor = function(newColor)
        {
            if (!isNaN(parseFloat(newColor[0])) &&
                !isNaN(parseFloat(newColor[1])) &&
                !isNaN(parseFloat(newColor[2])))
            {
                color = newColor;

                if (model.Name() === "HUD")
                    model.Update(model.Text());
            }
        }

        /**
        * @param {string} newColor
        */
        this.SetColorHex = function(newColor)
        {
            let rgb = Utils.ToColorRGB(newColor.substr(1));
            this.SetColor([ rgb[0], rgb[1], rgb[2], 1.0 ]);
        }

        /**
        * @param {string} newName
        */
        this.SetName = function(newName)
        {
            name = newName;
        }

        /**
        * @param {<Array<number>} newPosition
        */
        this.SetPosition = function(newPosition)
        {
            if (!isNaN(parseFloat(newPosition[0])) &&
                !isNaN(parseFloat(newPosition[1])) &&
                !isNaN(parseFloat(newPosition[2])))
            {
                position = newPosition;

                if (model.Name() === "HUD")
                    model.Update(model.Text());
            }
        }

        /**
        * Set Rotation in radians
        * @param {Array<number>} newRotationRadians
        */
        this.SetRotation = function(newRotationRadians)
        {
            if (!isNaN(parseFloat(newRotationRadians[0])) &&
                !isNaN(parseFloat(newRotationRadians[1])) &&
                !isNaN(parseFloat(newRotationRadians[2])))
            {
                rotation = newRotationRadians;

                if (model.Name() === "HUD")
                    model.Update(model.Text());
            }
        }

        /**
        * @param {Array<number>} newScale
        */
        this.SetScale = function(newScale)
        {
            if (!isNaN(parseFloat(newScale[0])) &&
                !isNaN(parseFloat(newScale[1])) &&
                !isNaN(parseFloat(newScale[2])))
            {
                scale = newScale;

                if (model.Name() === "HUD")
                    model.Update(model.Text());
            }
        }

        /**
        * Texture Coordinates Buffer Object
        * @return {object}
        */
        this.TBO = function()
        {
            return (textureCoordsBuffer ? textureCoordsBuffer.ID() : null);
        }

        /**
        * @param {number} index
        * @return {object}
        */
        this.Texture = function(index)
        {
            return textures[index];
        }

        /**
        * @return {Array<object>}
        */
        this.Textures = function()
        {
            return textures;
        }

        /**
        * @return {number}
        */
        this.Type = function()
        {
            return type;
        }

        /**
        * Vertex Buffer Object
        * @return {object}
        */
        this.VBO = function()
        {
            return (vertexBuffer ? vertexBuffer.ID() : null);
        }
    }
}
