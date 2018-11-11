/**
* Shader Manager
* @class
*/
class ShaderManager
{
    /**
    * @param {object} scope
    */
    static Init(scope)
    {
        var result = 0;

        for (var i = 0; i < ShaderID.NR_OF_SHADERS; i++)
        {
            let vs = scope.resourcesTexts[(i * 2) + 0];
            let fs = scope.resourcesTexts[(i * 2) + 1];

            if (!vs || !fs || (vs.name.indexOf("_vs") < 0))
                continue;

            let shaderName            = vs.name.substr(0, vs.name.indexOf("_"));
            ShaderManager.Programs[i] = new ShaderProgram(shaderName);

            result = ShaderManager.Programs[i].LoadAndLink(vs.result, fs.result, vs.name, fs.name);

            if ((result != 0) || !ShaderManager.Programs[i].Program())
                return result;
        }

        return result;
    }
}

ShaderManager.Programs = [ null, null, null, null, null, null ];
