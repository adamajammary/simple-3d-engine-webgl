
/**
* Terrain
* @class
*/
class Terrain extends Component
{
    /**
    * @param {Array<object>} images Array<{ file:string, name:string, result:HTMLImageElement }>
    * @param {number}        terrainSize
    * @param {number}        terrainOctaves
    * @param {number}        terrainRedistribution
    */
    constructor(images, terrainSize, terrainOctaves, terrainRedistribution)
    {
        super("Terrain");

        let mesh = null;
        
        /**
        * @param {number} size
        * @param {number} octaves
        * @param {number} redistribution
        * @param {object} parent
        */
        this.init = function(size, octaves, redistribution, parent)
        {
            terrainOctaves        = octaves;
            terrainRedistribution = redistribution;
            terrainSize           = size;

            let offset = (size / 2);

            let vertices      = [];
            let normals       = [];
            let textureCoords = [];
            let indices       = [];

            let vertex = 0;

            for (let z = 0; z < size; z++) {
            for (let x = 0; x < size; x++)
            {
                vertices[vertex * 3 + 0] = (x - offset);
                vertices[vertex * 3 + 2] = (z - offset);
                vertices[vertex * 3 + 1] = Noise.Height(x, z, octaves, redistribution);

                normals[vertex * 3 + 0] = vertices[vertex * 3 + 0];
                normals[vertex * 3 + 1] = vertices[vertex * 3 + 1];
                normals[vertex * 3 + 2] = vertices[vertex * 3 + 2];

                textureCoords[vertex * 2 + 0] = (x / size);
                textureCoords[vertex * 2 + 1] = (z / size);

                vertex++;
            }
            }

            // http://www.mbsoftworks.sk/index.php?page=tutorials&series=1&tutorial=8
            //
            // VERTICES
            // 0, 1, 2, 3,
            // 4, 5, 6, 7 ...
            //
            // INDICES
            // 0, 4, 1,
            // 1, 4, 5
            // 
            let index = 0;

            // FACES (TRIANGLE 1 + TRIANGLE 2)
            for (let z = 0; z < size - 1; z++) {
            for (let x = 0; x < size - 1; x++)
            {
                let topLeft    = (((z + 0) * size) + x);   // CURRENT ROW
                let bottomLeft = (((z + 1) * size) + x);   // NEXT ROW

                // TRIANGLE 1
                indices[index++] = (topLeft    + 0);    // TOP-LEFT
                indices[index++] = (bottomLeft + 0);    // BOTTOM-LEFT
                indices[index++] = (topLeft    + 1);    // TOP-RIGHT

                // TRIANGLE 2
                indices[index++] = (topLeft    + 1);    // TOP-RIGHT
                indices[index++] = (bottomLeft + 0);    // BOTTOM-LEFT
                indices[index++] = (bottomLeft + 1);    // BOTTOM-RIGHT
            }
            }

            if (!mesh)
                mesh = new Mesh(parent);

            if (mesh)
            {
                mesh.LoadArrays(vertices, textureCoords, normals, indices, "Mesh (Terrain)");

                for (let i = 0; i < 5; i++)
                {
                    let texture = new Texture([ images[i] ], TextureType.TEX_2D, FBOType.UNKNOWN, 0, 0, true);

                    texture.ScaleTo([ size, size ]);
                    mesh.LoadTexture(texture, i);
                }

                for (let i = 5; i < MAX_TEXTURES; i++)
                    mesh.LoadTexture(Utils.EmptyTexture, i);

                this.Children = [ mesh ];
            }

            this.isValid = (this.Children.length > 0);
        }

        this.Octaves = function()
        {
            return terrainOctaves;
        }

        /**
        * @param {number} size
        * @param {number} octaves
        * @param {number} redistribution
        */
        this.Resize = function(size, octaves, redistribution)
        {
            this.init(size, octaves, redistribution, this);
        }

        this.Redistribution = function()
        {
            return terrainRedistribution;
        }
        
        this.Size = function()
        {
            return terrainSize;
        }

        /**
         * MAIN
         */
        this.type = ComponentType.TERRAIN;

        this.init(terrainSize, terrainOctaves, terrainRedistribution, this);
    }
}
