/**
* Light Source
* @class
*/
class LightSource extends Component
{
    /**
    * @param {string}    sphereText
    * @param {string}    sphereFile
    * @param {LightType} lightType
    */
    constructor(sphereText, sphereFile, lightType)
    {
        super("Light Source");

        /**
        * @return {Light}
        */
        this.initLight = function()
        {
            let light = new Light();

            switch (this.sourceType) {
            case LightType.DIRECTIONAL:
                light.direction        = vec3.fromValues(0.5, -1.0, -0.2);
                light.position         = vec3.fromValues(-2.0, 3.0, 3.0);
                light.material.diffuse = vec4.fromValues(0.4, 0.4, 0.4, 1.0);
                break;
            case LightType.POINT:
                light.attenuation.constant  = 1.0;
                light.attenuation.linear    = 0.09;
                light.attenuation.quadratic = 0.032;
                light.position              = vec3.fromValues(0.0, 5.0, 0.0);
                light.material.diffuse      = vec4.fromValues(1.0, 1.0, 0.0, 1.0);
                break;
            case LightType.SPOT:
                light.attenuation.constant  = 1.0;
                light.attenuation.linear    = 0.09;
                light.attenuation.quadratic = 0.032;
                light.direction             = vec3.fromValues(0.0, -1.0, 0.0);
                light.position              = vec3.fromValues(0.0, 5.0,  0.0);
                light.innerAngle            = glMatrix.toRadian(12.5);
                light.outerAngle            = glMatrix.toRadian(17.5);
                light.material.diffuse      = vec4.fromValues(1.0, 1.0, 0.0, 1.0);
                break;
            default:
                break;
            }

            light.material.ambient            = vec3.fromValues(0.2, 0.2, 0.2);
            light.material.specular.intensity = vec3.fromValues(0.6, 0.6, 0.6);
            light.material.specular.shininess = 20.0;

            return light;
        }

        /**
        * @return {boolean}
        */
        this.Active = function()
        {
            return this.light.active;
        }

        /**
        * @return {number}
        */
        this.ConeInnerAngle = function()
        {
            return this.light.innerAngle;
        }

        /**
        * @return {number}
        */
        this.ConeOuterAngle = function()
        {
            return this.light.outerAngle;
        }

        /**
        * @return {Array<number>}
        */
        this.Direction = function()
        {
            return this.light.direction;
        }

        /**
        * @return {Attenuation}
        */
        this.GetAttenuation = function()
        {
            return this.light.attenuation;
        }

        /**
        * @return {Light}
        */
        this.GetLight = function()
        {
            return this.light;
        }

        /**
        * @return {Material}
        */
        this.GetMaterial = function()
        {
            return this.light.material;
        }

        /**
        * @return {Material}
        */
        this.GetMaterialHex = function()
        {
            let material = new Material();

            material.ambient            = Utils.ToColorHex(this.light.material.ambient);
            material.diffuse            = Utils.ToColorHex(this.light.material.diffuse);
            material.specular.intensity = Utils.ToColorHex(this.light.material.specular.intensity);
            material.specular.shininess = this.light.material.specular.shininess;

            return material;
        }

        /**
        * @param {Array<number>} newPosition
        */
        this.MoveTo = function(newPosition)
        {
            this.light.position = newPosition;

            if (this.Children.length > 0)
                this.Children[0].MoveTo(newPosition);

            this.updateView();
        }

        /**
        * @param  {Array<number>} model
        * @return {Array<number>}
        */
        this.MVP = function(model)
        {
            return (this.projection * views[0] * model);
        }

        /**
        * @return {Array<number>}
        */
        this.Projection = function()
        {
            return this.projection;
        }

        /**
        * @param {boolean} active
        */
        this.SetActive = function(active)
        {
            this.light.active = active;
        }

        /**
        * @param {Array<number>} ambient
        */
        this.SetAmbient = function(ambient)
        {
            this.light.material.ambient = ambient;
        }

        /**
        * @param {string} newAmbient
        */
        this.SetAmbientHex = function(newAmbient)
        {
            let rgb = Utils.ToColorRGB(newAmbient.substr(1));
            this.light.material.ambient = [ rgb[0], rgb[1], rgb[2] ];
        }

        /**
        * @param {number} linear
        */
        this.SetAttenuationLinear = function(linear)
        {
            this.light.attenuation.linear = linear;
        }

        /**
        * @param {number} quadratic
        */
        this.SetAttenuationQuadratic = function(quadratic)
        {
            this.light.attenuation.quadratic = quadratic;
        }

        /**
        * @param {Array<number>} newColor
        */
        this.SetColor = function(newColor)
        {
            this.light.material.diffuse = newColor;
        }

        /**
        * @param {string} newColor
        */
        this.SetColorHex = function(newColor)
        {
            let rgb = Utils.ToColorRGB(newColor.substr(1));
            this.light.material.diffuse = [ rgb[0], rgb[1], rgb[2], 1.0 ];
        }

        /**
        * @param {number} angleRad
        */
        this.SetConeInnerAngle = function(angleRad)
        {
            this.light.innerAngle = angleRad;
        }

        /**
        * @param {number} angleRad
        */
        this.SetConeOuterAngle = function(angleRad)
        {
            this.light.outerAngle = angleRad;
        }

        /**
        * @param {Array<number>} direction
        */
        this.SetDirection = function(direction)
        {
            this.light.direction = direction;
            this.updateView();
        }

        /**
        * @param {Array<number>} intensity
        */
        this.SetSpecularIntensity = function(intensity)
        {
            this.light.material.specular.intensity = intensity;
        }

        /**
        * @param {string} newIntensity
        */
        this.SetSpecularIntensityHex = function(newIntensity)
        {
            let rgb = Utils.ToColorRGB(newIntensity.substr(1));
            this.light.material.specular.intensity = [ rgb[0], rgb[1], rgb[2] ];
        }

        /**
        * @param {number} shininess
        */
        this.SetSpecularShininess = function(shininess)
        {
            this.light.material.specular.shininess = shininess;
        }

        /**
        * @return {LightType}
        */
        this.SourceType = function()
        {
            return this.sourceType;
        }

        this.updateProjection = function()
        {
            let ORTHO_SIZE = 30.0;

            switch (this.sourceType) {
            case LightType.DIRECTIONAL:
                mat4.ortho(this.projection, -ORTHO_SIZE, ORTHO_SIZE, -ORTHO_SIZE, ORTHO_SIZE, 1.0, ORTHO_SIZE);
                break;
            case LightType.POINT:
                mat4.perspective(this.projection, PI_HALF, 1.0, 1.0, 25.0);
                break;
            case LightType.SPOT:
                mat4.perspective(this.projection, Math.acos(this.light.outerAngle), 1.0, 1.0, 20.0);
                break;
            default:
                break;
            }
        }

        this.updateView = function()
        {
            let dir = this.light.direction;
            let pos = this.light.position;

            switch (this.sourceType) {
            case LightType.DIRECTIONAL:
                mat4.lookAt(views[0], pos, (pos + dir), RenderEngine.Camera.Up());
                break;
            case LightType.POINT:
                // 6 view directions: right, left, top, bottom, near, far
                mat4.lookAt(views[0], pos, (pos + vec3.fromValues(1.0,  0.0, 0.0)), vec3.fromValues(0.0, -1.0, 0.0));
                mat4.lookAt(views[1], pos, (pos + vec3.fromValues(-1.0, 0.0, 0.0)), vec3.fromValues(0.0, -1.0, 0.0));
                mat4.lookAt(views[2], pos, (pos + vec3.fromValues(0.0,  1.0, 0.0)), vec3.fromValues(0.0,  0.0, 1.0));
                mat4.lookAt(views[3], pos, (pos + vec3.fromValues(0.0, -1.0, 0.0)), vec3.fromValues(0.0, 0.0, -1.0));
                mat4.lookAt(views[4], pos, (pos + vec3.fromValues(0.0,  0.0, 1.0)), vec3.fromValues(0.0, -1.0, 0.0));
                mat4.lookAt(views[5], pos, (pos + vec3.fromValues(0.0, 0.0, -1.0)), vec3.fromValues(0.0, -1.0, 0.0));
                break;
            case LightType.SPOT:
                mat4.lookAt(views[0], pos, dir, RenderEngine.Camera.Up());
                break;
            default:
                break;
            }
        }

        /**
        * @param  {number} index
        * @return {Array<number>}
        */
        this.View = function(index)
        {
            return (index < MAX_TEXTURES ? views[index] : mat4.create());
        }

        /**
        * MAIN
        */
        this.sourceType = lightType;
        this.type       = ComponentType.LIGHTSOURCE;
        this.light      = this.initLight();
        this.projection = mat4.create();
        let  views      = [];

        for (let i = 0; i < MAX_TEXTURES; i++)
            views[i] = mat4.create();

        this.updateProjection();
        this.updateView();

        this.Children = Utils.LoadModel(sphereText, sphereFile, this);
        this.isValid  = (this.Children.length > 0);

        if (this.isValid && this.Children[0])
        {
            switch (this.sourceType) {
                case LightType.DIRECTIONAL: this.Children[0].Name = "Directional Light"; break;
                case LightType.POINT:       this.Children[0].Name = "Point Light";       break;
                case LightType.SPOT:        this.Children[0].Name = "Spot Light";        break;
                default: break;
            }

            this.Children[0].ComponentMaterial = this.light.material;
            this.Children[0].MoveTo(this.light.position);

            this.Children[0].ScaleTo(vec3.fromValues(0.25, 0.25, 0.25));
        }
    }
}
