
/**
* Terrain
* @class
*/
class Terrain
{
    /**
    * @param {Array<string>} images
    * @param {number}        terrainSize
    * @param {number}        terrainOctaves
    * @param {number}        terrainRedistribution
    */
    constructor(images, terrainSize, terrainOctaves, terrainRedistribution)
    {
        //
        // PRIVATE
        //
        var isValid  = false;
        var mesh     = null;
        var children = [];
        var type     = ComponentType.TERRAIN;

        //
        // PRIVATE
        //

        /**
        * @param {number} size
        * @param {number} octaves
        * @param {number} redistribution
        * @param {object} parent
        */
        function create(size, octaves, redistribution, parent)
        {
            // https://www.dropbox.com/sh/do47b1opx7sxr2a/AAA9Wt05Lgqdm1z9g-YKyDWya/HeightsGenerator.java?dl=0
            // https://en.wikipedia.org/wiki/Perlin_noise
            // http://codeflow.org/entries/2011/nov/10/webgl-gpu-landscaping-and-erosion/
            // http://www.mbsoftworks.sk/index.php?page=tutorials&series=1
            // https://www.google.no/search?q=opengl+terrain+perlin+noise+vs+heightmap+image&source=lnms&sa=X&ved=0ahUKEwjYmYnMiM3UAhWGDZoKHXjHChMQ_AUICSgA&biw=1546&bih=937&dpr=1

            // // https://www.khronos.org/opengl/wiki/Calculating_a_Surface_Normal
            // this.CalculateNormal = function(v1, v2, v3)
            // {
            //     var U = [(v2[0] - v1[0]), (v2[1] - v1[1]), (v2[2] - v1[2])];    // U[X,Y,Z]
            //     var V = [(v3[0] - v1[0]), (v3[1] - v1[1]), (v3[2] - v1[2])];    // V[X,Y,Z]
            //     var normal = [
            //         ((U[1] * V[2]) - (U[2] * V[1])),    // normal.X
            //         ((U[2] * V[0]) - (U[0] * V[2])),    // normal.Y
            //         ((U[0] * V[1]) - (U[1] * V[0]))     // normal.Z
            //     ];
            //     return normal;
            // }

            //var width   = 10;
            //var height  = 10;
            //var offsetZ = (this.Size / 2);
          
            //children      = [];
            //terrainAmplitude      = amplitude;
            terrainOctaves        = octaves;
            terrainRedistribution = redistribution;
            terrainSize           = size;

            var offset = (size / 2);

            var vertices      = [];
            var normals       = [];
            var textureCoords = [];
            var indices       = [];

            var vertex = 0;

            for (var z = 0; z < size; z++) {
            for (var x = 0; x < size; x++)
            {
                vertices[vertex * 3 + 0] = (x - offset);
                vertices[vertex * 3 + 2] = (z - offset);

                //vertices[vertex * 3 + 1] = Math.random() * 2.0 - 1.0;
                // vertices[vertex * 3 + 1] =       1 * Noise.Noise(1 * x, 1 * z)
                //                             +  0.5 * Noise.Noise(2 * x, 2 * z)
                //                             + 0.25 * Noise.Noise(4 * x, 2 * z);
                //vertices[vertex * 3 + 1] = Noise.Height(x, z, amplitude, octaves, roughness);
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
            var index = 0;

            // FACES (TRIANGLE 1 + TRIANGLE 2)
            for (var z = 0; z < size - 1; z++) {
            for (var x = 0; x < size - 1; x++)
            {
                var topLeft    = (((z + 0) * size) + x);   // CURRENT ROW
                var bottomLeft = (((z + 1) * size) + x);   // NEXT ROW

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

                var files = [ "backgroundTexture.png", "rTexture.png", "gTexture.png", "bTexture.png", "blendMap.png" ];

                for (var i = 0; i < 5; i++)
                {
                    var texture = new Texture(images[i], files[i], false, true);

                    texture.SetScale([ size, size ]);
                    mesh.LoadTexture(texture, i);
                }

                for (var i = 5; i < Utils.MAX_TEXTURES; i++)
                    mesh.LoadTexture(Utils.EmptyTexture, i);

                children = [ mesh ];
            }

            isValid = (children.length > 0);
        }

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
            return "Terrain";
        }

        this.Octaves = function()
        {
            return terrainOctaves;
        }

        /**
        * @member
        * @return {object}
        */
        this.Parent = function()
        {
            return null;
        }

        /**
        * @param {number} size
        * @param {number} octaves
        * @param {number} redistribution
        */
        this.Resize = function(size, octaves, redistribution)
        {
            create(size, octaves, redistribution, this);
        }

        this.Redistribution = function()
        {
            return terrainRedistribution;
        }
        
        /**
        * @param {object} child
        */
        this.RemoveChild = function(child)
        {
            var index = children.indexOf(child);
            if (index < 0) { return -1; }

            delete children[index];
            children[index] = null;
            children.splice(index, 1);
            
            return 0;
        }

        this.Size = function()
        {
            return terrainSize;
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

        create(terrainSize, terrainOctaves, terrainRedistribution, this);
    }
}
