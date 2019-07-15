/**
* Specular intensity and shininess
* @class
*/
class Specular
{
    constructor()
    {
        this.intensity = [ 0.6, 0.6, 0.6 ];
        this.shininess = 0.0;
    }
}

/**
* Mesh material
* @class
*/
class Material
{
    constructor()
    {
        this.diffuse  = [ 0.6, 0.6, 0.6, 1.0 ];
        this.ambient  = [ 0.6, 0.6, 0.6 ];
        this.specular = new Specular();
        this.textures = [ "", "", "", "", "", "" ];
    }
}
