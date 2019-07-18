/**
* Array Type
* @global
* @enum {number}
*/
var ArrayType = 
{
    FLOAT32: 0, FLOAT64: 1, INT16: 2, UINT16: 3, INT32: 4, UINT32: 5, INT64: 6, UINT64: 7, NR_OF_ARRAY_TYPES: 8
};



/**
* Bounding Volume Type
* @global
* @enum {number}
*/
var BoundingVolumeType = 
{
    NONE: 0, BOX_AABB: 1, BOX_OBB: 2, SPHERE: 3, NR_OF_BOUNDING_VOLUME_TYPES: 4
};

/**
* Component Type
* @global
* @enum {number}
*/
var ComponentType = 
{
    UNKNOWN: -1, CAMERA: 0, HUD: 1, MESH: 2, MODEL: 3, SKYBOX: 4, TERRAIN: 5, WATER: 6, LIGHTSOURCE: 7, NR_OF_COMPONENT_TYPES: 8
};

/**
* Component Type
* @global
* @enum {number}
*/
var ComponentType = 
{
    UNKNOWN: -1, CAMERA: 0, HUD: 1, MESH: 2, MODEL: 3, SKYBOX: 4, TERRAIN: 5, WATER: 6, LIGHTSOURCE: 7, NR_OF_COMPONENT_TYPES: 8
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
* FBO Type
* @global
* @enum {number}
*/
var FBOType = 
{
	UNKNOWN: -1, COLOR: 0, DEPTH: 1, NR_OF_FBO_TYPES: 2
};

/**
* Light Type
* @global
* @enum {number}
*/
var LightType = 
{
    UNKNOWN: -1, DIRECTIONAL: 0, POINT: 1, SPOT: 2, NR_OF_LIGHT_TYPES: 3
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
	UNKNOWN:   -1,
	COLOR:      0,
	DEFAULT:    1,
	DEPTH:      2,
	DEPTH_OMNI: 3,
	HUD:        4,
	SKYBOX:     5,
    WIREFRAME:  6,
	NR_OF_SHADERS: 7
};

/**
* Texture Type
* @global
* @enum {number}
*/
var TextureType = 
{
	UNKNOWN:      -1,
	TEX_2D:        0,
	TEX_2D_ARRAY:  1,
	CUBEMAP:       2,
	CUBEMAP_ARRAY: 3,
	NR_OF_TEXTURE_TYPES: 4
};

/**
* Draw Properties
* @global
* @class
*/
class DrawProperties
{
    constructor()
    {
        this.ClipMax            = {};
        this.ClipMin            = {};
        this.DepthLayer         = 0;
        this.DrawBoundingVolume = false;
        this.DrawSelected       = false;
        this.EnableClipping     = false;
        this.FBO                = null;
        this.Light              = null;
        this.Shader             = ShaderID.UNKNOWN;
    }
}

/**
* Mouse State
* @global
* @class
*/
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
* @global
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

        if (!Noise.Simplex)
            Noise.Simplex = new SimplexNoise();

        for (let i = 0; i < parseInt(octaves); i++)
        {
            height    += (octave * (Noise.Simplex.noise2D((frequency * parseFloat(x)), (frequency * parseFloat(z))) * 0.5 + 0.5));
            octaveSum += octave;
            frequency *= 2.0;
            octave    *= 0.5;
        }
        
        height /= octaveSum;
        height  = Math.pow(height, redistribution);

        return height;
    }
}

Noise.Simplex = null;

/**
* Global variables
* @global
*/
var CLEAR_VALUE_COLOR   = [ 0.0, 0.0, 1.0, 1.0 ];
var CLEAR_VALUE_DEFAULT = [ 0.0, 0.2, 0.4, 1.0 ];
var CLEAR_VALUE_DEPTH   = [ 1.0, 1.0, 1.0, 1.0 ];
var DEBUG               = false;
//var DEBUG               = true;
var FBO_TEXTURE_SIZE    = 1024;
var MAX_LIGHT_SOURCES   = 13;
var MAX_TEXTURES        = 6;
var PI                  = Math.PI;
var PI_HALF             = (Math.PI * 0.5);
var PI_QUARTER          = (Math.PI * 0.25);
