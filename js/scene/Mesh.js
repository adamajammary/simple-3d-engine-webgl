/**
* Mesh
* @class
*/
class Mesh extends Component
{
    /**
    * @param {Component} parent
    * @param {string}    name
    */
    constructor(parent, name)
    {
        super(name);

        let boundingVolume       = null;
        let boundingVolumeType   = BoundingVolumeType.NONE;
        let gl                   = RenderEngine.GLContext();
        let isSelected           = false;
        let maxVertexPosition    = [ 0.0, 0.0, 0.0 ];
        let indices              = [];
        let normals              = [];
        let textureCoords        = [];
        let vertices             = [];
        let indexBuffer          = null;
        let normalBuffer         = null;
        let textureCoordsBuffer  = null;
        let vertexBuffer         = null;

        this.Parent = parent;
        this.type   = this.Parent.Type();

        /**
        * Index Buffer Object
        * @return {object}
        */
        this.IBO = function()
        {
            return (indexBuffer ? indexBuffer.ID() : null);
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
        * Vertex Buffer Object
        * @return {object}
        */
        this.VBO = function()
        {
            return (vertexBuffer ? vertexBuffer.ID() : null);
        }

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
        * @return {object}
        */
        this.BoundingVolume = function()
        {
            return boundingVolume;
        }

        /**
        * @return {BoundingVolumeType}
        */
        this.BoundingVolumeType = function()
        {
            return boundingVolumeType;
        }

        /**
        * @return {boolean}
        */
        this.IsSelected = function()
        {
            return isSelected;
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
            this.Name     = meshName;

            this.setModelData();
            this.updateModelData();
            this.setMaxVertexPosition();
            this.SetBoundingVolume(BoundingVolumeType.BOX_AABB);
            
            this.isValid = true;
        }

        /**
        * @param {object}        json
        * @param {Array<number>} scaleSize
        * @param {string}        meshName
        */
        this.LoadBoundingJSON = function(json, scaleSize, meshName)
        {
            if (!json) {
                alert("ERROR: Failed to parse the bounding volume JSON.");
                return -1;
            }

            this.Name = meshName;
            indices   = [].concat.apply([], json.faces);
            vertices  = json.vertices;

            if (indices && (indices.length > 0))
                indexBuffer = new Buffer(gl.ELEMENT_ARRAY_BUFFER, ArrayType.UINT32, indices);

            if (vertices && (vertices.length > 0))
                vertexBuffer = new Buffer(gl.ARRAY_BUFFER, ArrayType.FLOAT32, vertices);

            this.scale = vec3.fromValues(
                (scaleSize[0] + 0.01), (scaleSize[1] + 0.01), (scaleSize[2] + 0.01)
            );

            this.updateModelData();

            this.isValid = true;
        }

        /**
        * @param {number} scaleSize
        */
        this.LoadBoundingBoxJSON = function(scaleSize)
        {
            if (boundingVolumeType === BoundingVolumeType.BOX_AABB)
                this.LoadBoundingJSON(Utils.CubeJSON, scaleSize, "Bounding Box (AABB)");
            else
                this.LoadBoundingJSON(Utils.CubeJSON, scaleSize, "Bounding Box (OBB)");
        }

        /**
        * @param {number} scaleSize
        */
        this.LoadBoundingSphereJSON = function(scaleSize)
        {
            this.LoadBoundingJSON(Utils.SphereJSON, scaleSize, "Bounding Sphere");
        }

        /**
        * @param  {object}        jsonMesh
        * @param  {Array<number>} transformMatrix
        * @return {boolean}
        */
        this.LoadJSON = function(jsonMesh, transformMatrix)
        {
            if (!jsonMesh || !transformMatrix) {
                alert("ERROR: Failed to parse the JSON.");
                return -1;
            }

            indices   = [].concat.apply([], jsonMesh.faces);
            normals   = jsonMesh.normals;
            vertices  = jsonMesh.vertices;

            if (jsonMesh.texturecoords && (jsonMesh.texturecoords.length > 0))
                textureCoords = jsonMesh.texturecoords[0];

            this.setModelData();

            // https://www.gamedev.net/forums/topic/384075-extracting-scale-vector-from-a-transformation-matrix/
            // https://math.stackexchange.com/questions/237369/given-this-transformation-matrix-how-do-i-decompose-it-into-translation-rotati
            // https://en.wikipedia.org/wiki/Rotation_matrix
            // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToAngle/index.htm
            if (transformMatrix)
            {
                let m = transformMatrix;

                this.position = [ m[0*4+3], m[1*4+3], m[2*4+3] ];

                this.scale = [
                    Math.sqrt(Math.pow(m[0*4+0], 2) + Math.pow(m[0*4+1], 2) + Math.pow(m[0*4+2], 2)),
                    Math.sqrt(Math.pow(m[1*4+0], 2) + Math.pow(m[1*4+1], 2) + Math.pow(m[1*4+2], 2)),
                    Math.sqrt(Math.pow(m[2*4+0], 2) + Math.pow(m[2*4+1], 2) + Math.pow(m[2*4+2], 2))
                ];

                let angle = Math.acos((m[0*4+0] + m[1*4+1] + m[2*4+2] - 1) / 2);
                let x     = Math.sqrt(Math.pow((m[2*4+1] - m[1*4+2]), 2) + Math.pow((m[0*4+2] - m[2*4+0]), 2) + Math.pow((m[1*4+0] - m[0*4+1]), 2));
                let y     = Math.sqrt(Math.pow((m[2*4+1] - m[1*4+2]), 2) + Math.pow((m[0*4+2] - m[2*4+0]), 2) + Math.pow((m[1*4+0] - m[0*4+1]), 2));
                let z     = Math.sqrt(Math.pow((m[2*4+1] - m[1*4+2]), 2) + Math.pow((m[0*4+2] - m[2*4+0]), 2) + Math.pow((m[1*4+0] - m[0*4+1]), 2));

                if (x && y && z)
                {
                    x = ((m[2*4+1] - m[1*4+2]) / x);
                    y = ((m[0*4+2] - m[2*4+0]) / y);
                    z = ((m[1*4+0] - m[0*4+1]) / z);

                    this.rotation = [ (angle * x), (angle * y), (angle * z) ];
                }
            }

            if (this.type === ComponentType.WATER) {
                this.scale.z = 10.0;
                this.ComponentMaterial.specular.shininess = 20.0;
            }

            this.updateModelData();
            this.setMaxVertexPosition();
            this.SetBoundingVolume(BoundingVolumeType.BOX_AABB);
            
            this.isValid = (this.IBO() && this.VBO());

            return this.isValid;
        }

        /**
        * @param {object} image { file:string, name:string, result:HTMLImageElement }
        * @param {number} index
        */
        this.LoadTextureImage = function(image, index)
        {
            if (!this.TBO()) {
                alert("ERROR: The model is missing texture coordinates.");
                return -1;
            }

            this.Textures[index] = new Texture([ image ]);

            if ((index == 0) && (this.Parent.Type() === ComponentType.HUD))
                this.Parent.Update();

            return 0;
        }

        /**
        * @return {Array<number>}
        */
        this.MaxBoundaries = function()
        {
            let max = this.Parent.MaxVertexPosition();
            return [ (this.position[0] + max[0]), (this.position[1] + max[1]), (this.position[2] - max[2]) ];
        }

        /**
        * @return {Array<number>}
        */
        this.MinBoundaries = function()
        {
            let max = this.Parent.MaxVertexPosition();
            return [ (this.position[0] - max[0]), (this.position[1] - max[1]), (this.position[2] + max[2]) ];
        }

        /**
        * @return {Array<number>}
        */
        this.MaxVertexPosition = function()
        {
           return maxVertexPosition;
        }

        /**
        * Moves to new position
        * @param {Array<number>} newPosition
        */
        this.MoveTo = function(newPosition)
        {
            if (!isNaN(parseFloat(newPosition[0])) &&
                !isNaN(parseFloat(newPosition[1])) &&
                !isNaN(parseFloat(newPosition[2])))
            {
                this.position = newPosition;
                this.updateTranslation();

                if (this.Parent.Type() === ComponentType.HUD)
                    this.Parent.Update();

                if (boundingVolume) {
                    boundingVolume.position = this.position;
                    boundingVolume.updateTranslation();
                }
            }
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

                this.updateBoundingVolume();
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

                this.updateBoundingVolume();
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

                componentElement.selectedIndex = (scope.getComponentIndex(this.Parent) + 1);
                scope.component                = this.Parent;
                scope.child                    = this;

                scope.selectComponent(this.Parent);
                scope.selectChild(this);
                scope.$apply();
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

                this.updateBoundingVolume();
            }
        }

        this.SetBoundingBox = function()
        {
            boundingVolume = new Mesh(this);
            boundingVolume.LoadBoundingBoxJSON(maxVertexPosition);
        }

        this.SetBoundingSphere = function()
        {
            boundingVolume = new Mesh(this);
            boundingVolume.LoadBoundingSphereJSON(maxVertexPosition);
        }

        /**
        * @param {BoundingVolumeType} type
        */
        this.SetBoundingVolume = function(type)
        {
            switch (type) {
            case BoundingVolumeType.BOX_AABB:
            case BoundingVolumeType.BOX_OBB:
                this.SetBoundingBox();
                break;
            case BoundingVolumeType.SPHERE:
                this.SetBoundingSphere();
                break;
            default:
                type           = BoundingVolumeType.NONE;
                boundingVolume = null;
                break;
            }

            boundingVolumeType = type;
        }

        this.setMaxVertexPosition = function()
        {
            maxVertexPosition = [ 0.0, 0.0, 0.0];

            for (let i = 0; i < vertices.length; i += 3)
            {
                let origin  = vec3.create();
                let rotated = vec3.create();

                let vertex = [
                     (vertices[i]     * this.scale[0]),
                     (vertices[i + 1] * this.scale[1]),
                     (vertices[i + 2] * this.scale[2])
                ];

                vec3.rotateX(rotated, vertex,  origin, this.rotation[0]);
                vec3.rotateY(rotated, rotated, origin, this.rotation[1]);
                vec3.rotateZ(rotated, rotated, origin, this.rotation[2]);
                
                maxVertexPosition[0] = Math.max(maxVertexPosition[0], Math.abs(rotated[0]));
                maxVertexPosition[1] = Math.max(maxVertexPosition[1], Math.abs(rotated[1]));
                maxVertexPosition[2] = Math.max(maxVertexPosition[2], Math.abs(rotated[2]));
            }
        }

        this.setModelData = function()
        {
            if (indices && (indices.length > 0))
                indexBuffer = new Buffer(gl.ELEMENT_ARRAY_BUFFER, ArrayType.UINT32, indices);

            if (normals && (normals.length > 0))
                normalBuffer = new Buffer(gl.ARRAY_BUFFER, ArrayType.FLOAT32, normals);

            if (textureCoords && (textureCoords.length > 0))
                textureCoordsBuffer = new Buffer(gl.ARRAY_BUFFER, ArrayType.FLOAT32, textureCoords);

            if (vertices && (vertices.length > 0))
                vertexBuffer = new Buffer(gl.ARRAY_BUFFER, ArrayType.FLOAT32, vertices);
        }

        this.updateBoundingVolume = function()
        {
            if (boundingVolume) {
                this.setMaxVertexPosition();
                boundingVolume.scale = [ maxVertexPosition[0], maxVertexPosition[1], maxVertexPosition[2] ];
                boundingVolume.updateScale();
            }
        }

        this.updateModelData = function()
        {
            this.MoveTo(this.position);
            this.ScaleTo(this.scale);
            this.RotateTo(this.rotation);
        
            for (let i = 0; i < MAX_TEXTURES; i++) {
                if (!this.Textures[i])
                    this.LoadTexture(Utils.EmptyTexture, i);
            }
        }    
    }
}
