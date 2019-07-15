/**
* Attenuation
* @class
*/
class Attenuation
{
    constructor()
    {
        this.constant  = 0;
        this.linear    = 0;
        this.quadratic = 0;
    }
}

/**
* Light
* @class
*/
class Light
{
    constructor()
    {
        this.active      = true;
        this.attenuation = new Attenuation();
        this.direction   = {};
        this.innerAngle  = 0;
        this.outerAngle  = 0;
        this.material    = new Material();
        this.position    = {};
    }
}
