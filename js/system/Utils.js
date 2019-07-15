/**
* Utils
* @class
*/
class Utils
{
    /**
    * 
    * @param  {string} jsonText
    * @return {object}
    */
    static LoadJSON(jsonText)
    {
        var json = null;

        if (typeof jsonText === "object") {
            json = jsonText;
        } else {
            try {
                json = JSON.parse(jsonText);
            } catch(exception) {
                alert(exception);
                json = null;
            }
        }

        return json;        
    }

    /**
    * 
    * @param {string}    modelText
    * @param {string}    modelFile
    * @param {Component} parent
    */
    static LoadModel(modelText, modelFile, parent)
    {
        let json   = Utils.LoadJSON(modelText);
        let meshes = [];

        if (!json || (json.meshes.length == 0)) {
            alert("ERROR: Failed to parse the JSON.");
            return meshes;
        }

        let pathSepIndex = modelFile.lastIndexOf("/");

        if (pathSepIndex >= 0)
            pathSepIndex = modelFile.lastIndexOf("\\");

        let path = (pathSepIndex >= 0 ? modelFile.substr(0, pathSepIndex + 1) : "");

        for (let i = 0; i < json.meshes.length; i++)
        {
            let name = ((json.meshes[i].name != "") ? json.meshes[i].name : json.rootnode.children[i].name);
            let mesh = new Mesh(parent, ((name != "") ? name : "Mesh"));

            if (!mesh)
                continue;

            // http://assimp.sourceforge.net/lib_html/material_8h.html
            if (json.materials.length > 0)
            {
                let material = json.materials[json.meshes[i].materialindex];

                for (let j = 0; j < material.properties.length; j++)
                {
                    let key   = material.properties[j].key;
                    let type  = material.properties[j].type;
                    let value = material.properties[j].value;

                    if (key === "$clr.diffuse")
                        mesh.ComponentMaterial.diffuse = [ value[0], value[1], value[2], 1.0 ];
                    else if (key === "$clr.specular")
                        mesh.ComponentMaterial.specular.intensity = [ value[0], value[1], value[2], 1.0 ];
                    else if (key === "$mat.shininess")
                        mesh.ComponentMaterial.specular.shininess = parseFloat(value);
                    else if ((key === "$tex.file") && (parseInt(type) === 1))
                        mesh.ComponentMaterial.textures[0] = (path + value);
                    else if ((key === "$tex.file") && (parseInt(type) === 2))
                        mesh.ComponentMaterial.textures[1] = (path + value);
                }
            }    

            mesh.LoadJSON(json.meshes[i], json.rootnode.children[i].transformation);

            if (!mesh.IsValid())
                continue;
            
            meshes.push(mesh);
        }

        return meshes;        
    }

    /**
    * Converts rgb array "[0.0, 1.0, 0.0]" to hex string "00ff00"
    * @param {Array<number>} rgbArray
    */
    static ToColorHex(rgbArray)
    {
        var r = (parseInt(rgbArray[0] * 255)).toString(16); r = (r.length < 2 ? ("0" + r) : r);
        var g = (parseInt(rgbArray[1] * 255)).toString(16); g = (g.length < 2 ? ("0" + g) : g);
        var b = (parseInt(rgbArray[2] * 255)).toString(16); b = (b.length < 2 ? ("0" + b) : b);

        return String(r + g + b);
    }

    /**
    * Converts hex string "00ff00" to rgb array "[0.0, 1.0, 0.0]"
    * @param {string} hexString
    */
    static ToColorRGB(hexString)
    {
        return [
            parseInt(hexString.substr(0, 2), 16) / 255.0,
            parseInt(hexString.substr(2, 2), 16) / 255.0,
            parseInt(hexString.substr(4, 2), 16) / 255.0
        ];
    }

    /**
    * @param {object} object
    */
    static ToFloatArray2(object)
    {
        return [ parseFloat(object[0]), parseFloat(object[1]) ];
    }

    /**
    * @param {object} object
    */
    static ToFloatArray3(object)
    {
        return [ parseFloat(object[0]), parseFloat(object[1]), parseFloat(object[2]) ];
    }

    /**
    * @param {object} object
    */
    static ToFloatArray4(object)
    {
        return [ parseFloat(object[0]), parseFloat(object[1]), parseFloat(object[2]), parseFloat(object[3]) ];
    }

    /**
    * @param  {TextureType} textureType
    * @return {number}
    */
    static ToGlTextureType(textureType)
    {
        let gl = RenderEngine.GLContext();

        switch (textureType) {
            case TextureType.TEX_2D:        return gl.TEXTURE_2D;
            case TextureType.TEX_2D_ARRAY:  return gl.TEXTURE_2D_ARRAY;
            case TextureType.CUBEMAP:       return gl.TEXTURE_CUBE_MAP;
            case TextureType.CUBEMAP_ARRAY: return gl.TEXTURE_CUBE_MAP_ARRAY;
            default: break;
        }

        return -1;
    }
    
    /**
    * @param {boolean} boolValue
    */
    static ToVec4FromBool(boolValue)
    {
        let value = (boolValue ? 1.0 : 0.0);
        return vec4.fromValues(value, value, value, value);
    }
    
    /**
    * @param {number} nrValue
    */
    static ToVec4FromInt(nrValue)
    {
        return vec4.fromValues(nrValue, nrValue, nrValue, nrValue);
    }
    
    /**
    * @param {boolean} boolValue
    * @param {number}  nrValue
    */
    static ToVec4FromBoolInt(boolValue, nrValue)
    {
        return vec4.fromValues((boolValue ? 1.0 : 0.0), nrValue, 0.0, 0.0);
    }
    
    /**
    * @param {Array<number>} vec2Value
    */
    static ToVec4FromVec2(vec2Value)
    {
        return vec4.fromValues(vec2Value[0], vec2Value[1], 0.0, 0.0);
    }
    
    /**
    * @param {Array<number>} vec3Value
    */
    static ToVec4FromVec3(vec3Value)
    {
        return vec4.fromValues(vec3Value[0], vec3Value[1], vec3Value[2], 0.0);
    }
    
    /**
    * @param {Array<number>} vec3Value
    * @param {number}        nrValue
    */
    static ToVec4FromVec3Float(vec3Value, nrValue)
    {
        return vec4.fromValues(vec3Value[0], vec3Value[1], vec3Value[2], nrValue);
    }
}

Utils.CubeJSON            = null;
Utils.SphereJSON          = null;
Utils.DepthMap2D          = null;
Utils.DepthMapCube        = null;
Utils.EmptyTexture        = null; // 1x white 1x1px HTMLImageElement
Utils.EmptyCubemap        = null; // 6x white 1x1px HTMLImageElements
Utils.GameIsPaused        = true;
Utils.SelectColor         = vec4.fromValues(1.0, 0.5, 0.0, 1.0);

Utils.LightSources = [ null, null, null, null, null, null, null, null, null, null, null, null, null ];
