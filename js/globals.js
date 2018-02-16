/**
* Array Type
* @global
* @enum {number}
*/
var ArrayType = 
{
    FLOAT32: 0, FLOAT64: 1, INT16: 2, UINT16: 3, INT32: 4, UINT32: 5, INT64: 6, UINT64: 7
};

/**
* Engine State
* @global
* @enum {number}
*/
var EngineState = 
{
    FAILED: -1, STARTING: 0, STARTED: 1, STOPPING: 2, STOPPED: 3
};

/**
* Component Type
* @global
* @enum {number}
*/
var ComponentType = 
{
    UNKNOWN: -1, CAMERA: 0, HUD: 1, MESH: 2, MODEL: 3, SKYBOX: 4, TERRAIN: 5, WATER: 6
};

/**
* MouseButton
* 0: Left mouse button
* 1: Wheel button or middle button (if present)
* 2: Right mouse button
* @global
* @enum {number}
*/
var MouseButton = 
{
    LEFT: 0, MIDDLE: 1, RIGHT: 2
};

class MouseState
{
    constructor()
    {
        this.Drag     = false;
        this.Position = { x: 0, y: 0 };
    }
}

/**
* Noise
* @class
* http://www.redblobgames.com/maps/terrain-from-noise/
*/
class Noise
{
    /**
    * @member
    * @param  {number} x
    * @param  {number} z
    * @param  {number} octaves
    * @param  {number} redistribution
    * @return {number}
    */
    static Height(x, z, octaves, redistribution)
    {
        let height    = 0.0;
        let frequency = 1.0;
        let octave    = 1.0;
        let octaveSum = 0.0;

        for (let i = 0; i < parseInt(octaves); i++)
        {
            height    += (octave * (this.Simplex.noise2D((frequency * parseFloat(x)), (frequency * parseFloat(z))) * 0.5 + 0.5));
            octaveSum += octave;
            frequency *= 2.0;
            octave    *= 0.5;
        }
        
        height /= octaveSum;
        height  = Math.pow(height, redistribution);

        return height;
    }
}

Noise.Simplex = new SimplexNoise();



//var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || function(callback) { setTimeout(callback, 0); };

/*
Math.Gradient = new Array(10).fill(new Array(10).fill(new Array(2).fill(Math.random())));

// Function to linearly interpolate between a0 and a1
// Weight w should be in the range [0.0, 1.0]
Math.lerp = function(a0, a1, w)
{
    return ((1.0 - parseFloat(w)) * parseFloat(a0) + parseFloat(w) * parseFloat(a1));
}
 
// Computes the dot product of the distance and gradient vectors.
Math.dotGridGradient = function(ix, iy, x, y)
{
     // Precomputed (or otherwise) gradient vectors at each grid node
     //extern float Gradient[IYMAX][IXMAX][2];
 
     // Compute the distance vector
     var dx = x - parseFloat(ix);
     var dy = y - parseFloat(iy);
 
     // Compute the dot-product
     return (dx * Math.Gradient[iy][ix][0] + dy * Math.Gradient[iy][ix][1]);
}
 
// Compute Perlin noise at coordinates x, y
Math.perlinNoise = function(x, y)
{
     // Determine grid cell coordinates
     var x0 = Math.floor(parseFloat(x));
     var x1 = (x0 + 1);
     var y0 = Math.floor(parseFloat(y));
     var y1 = (y0 + 1);
 
     // Determine interpolation weights
     // Could also use higher order polynomial/s-curve here
     var sx = x - parseFloat(x0);
     var sy = y - parseFloat(y0);
 
     // Interpolate between grid point gradients
     var n0, n1, ix0, ix1, value;

     n0    = Math.dotGridGradient(x0, y0, x, y);
     n1    = Math.dotGridGradient(x1, y0, x, y);
     ix0   = Math.lerp (n0, n1, sx);
     n0    = Math.dotGridGradient(x0, y1, x, y);
     n1    = Math.dotGridGradient(x1, y1, x, y);
     ix1   = Math.lerp (n0, n1, sx);
     value = Math.lerp (ix0, ix1, sy);
 
     return value;
}
*/

// class Noise
// {
//     /**
//     * @member
//     * @param  {number} x
//     * @param  {number} z
//     * @param  {number} amplitude
//     * @param  {number} octaves
//     * @param  {number} roughness
//     * @return {number}
//     */
//     static Height(x, z, amplitude, octaves, roughness)
//     {
//         var total = 0;
//         var d     = parseFloat(Math.pow(2, octaves - 1));

//         for (var i = 0; i < octaves; i++)
//         {
//             var frequency  = parseFloat(Math.pow(2, i) / d);
//             var amplitude2 = parseFloat(Math.pow(roughness, i) * amplitude);

//             //total += Noise.InterpolatedNoise((x + xOffset) * freq, (z + zOffset) * freq) * amp;
//             total += Noise.InterpolatedNoise((x * frequency), ((z * frequency) * amplitude2));
//         }

//         return total;
//     }

//     /**
//     * @member
//     */
//     static Reset()
//     {
//         this.seed = Date.now();
//     }
// }

// /**
// * @member
// * @type {number}
// */
// Noise.seed = Date.now();

// /**
// * @member
// * @param  {number} x
// * @param  {number} z
// * @return {number}
// */
// Noise.InterpolatedNoise = function(x, z)
// {
//     var intX  = parseInt(x);
//     var intZ  = parseInt(z);
//     var fracX = parseFloat(x - intX);
//     var fracZ = parseFloat(z - intZ);
        
//     var v1 = parseFloat(this.SmoothNoise(intX,       intZ));
//     var v2 = parseFloat(this.SmoothNoise((intX + 1), intZ));
//     var v3 = parseFloat(this.SmoothNoise(intX,       (intZ + 1)));
//     var v4 = parseFloat(this.SmoothNoise((intX + 1), (intZ + 1)));
//     var i1 = parseFloat(this.Interpolate(v1, v2, fracX));
//     var i2 = parseFloat(this.Interpolate(v3, v4, fracX));

//     return this.Interpolate(i1, i2, fracZ);
// }

// /**
// * @member
// * @param  {number} a
// * @param  {number} b
// * @param  {number} blend
// * @return {number}
// */
// Noise.Interpolate = function(a, b, blend)
// {
//     var theta = (parseFloat(blend) * Math.PI);
//     var f     = (parseFloat(1.0 - Math.cos(theta)) * 0.5);

//     return (parseFloat(a) * (1.0 - f) + parseFloat(b) * f);
// }

// /**
// * @member
// * @param  {number} x
// * @param  {number} z
// * @return {number}
// */
// Noise.Noise = function(x, z)
// {
//     //var seed = (x * 49632 + z * 325176 + this.seed);
//     var seed = (x + z + this.seed);

//     return (parseFloat(this.Random(seed)) * 2.0 - 1.0);
// }

// /**
// * @member
// * @param  {number} seed
// * @return {number}
// */
// Noise.Random = function(seed)
// {
//     var x = (Math.sin(seed) * 10000);

//     return (x - Math.floor(x));
// }

// /**
// * @member
// * @param  {number} x
// * @param  {number} z
// * @return {number}
// */
// Noise.SmoothNoise = function(x, z)
// {
//     var corners = ((this.Noise(x - 1, z - 1) + this.Noise(x + 1, z - 1) + this.Noise(x - 1, z + 1) + this.Noise(x + 1, z + 1)) / 16.0);
//     var sides   = ((this.Noise(x - 1, z)     + this.Noise(x + 1, z)     + this.Noise(x, z - 1)     + this.Noise(x, z + 1))     / 8.0);
//     var center  = (this.Noise(x, z) / 4.0);

//     return (corners + sides + center);
// }
