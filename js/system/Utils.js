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
    * @param {Component} parent
    */
    static LoadModel(modelText, parent)
    {
        let json   = Utils.LoadJSON(modelText);
        let meshes = [];

        if (!json || (json.meshes.length == 0)) {
            alert("ERROR: Failed to parse the JSON.");
            return meshes;
        }

        for (let i = 0; i < json.meshes.length; i++)
        {
            let name = ((json.meshes[i].name != "") ? json.meshes[i].name : json.rootnode.children[i].name);
            let mesh = new Mesh(parent, ((name != "") ? name : "Mesh"));

            if (!mesh)
                continue;

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
}

Utils.CubeJSON     = null;
Utils.SphereJSON   = null;
Utils.EmptyTexture = null;     // Empty Texture (white 1x1 HTMLImageElement)
Utils.EmptyCubemap = null;     // Empty Cubemap (6 white 1x1 HTMLImageElements)
Utils.GameIsPaused = true;
Utils.MAX_TEXTURES = 6;        // Max nr of textures in fragment shader
