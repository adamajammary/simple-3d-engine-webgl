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
* Component Type
* @global
* @enum {number}
*/
var ComponentType = 
{
    UNKNOWN: -1, CAMERA: 0, HUD: 1, MESH: 2, MODEL: 3, SKYBOX: 4, TERRAIN: 5, WATER: 6
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

/**
* Shader ID
* @global
* @enum {number}
*/
var ShaderID =
{
	UNKNOWN: -1,
	DEFAULT: 0,
	HUD:     1,
	SKYBOX:  2,
	SOLID:   3,
	TERRAIN: 4,
	WATER:   5,
	NR_OF_SHADERS: 6
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
