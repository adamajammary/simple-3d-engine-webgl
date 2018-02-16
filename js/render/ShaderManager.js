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

        for (var i = 0; i < scope.resourcesTexts.length; i += 2)
        {
            if (i >= scope.resourcesTexts.length - 1)
                continue;

            let vs = scope.resourcesTexts[i + 0];
            let fs = scope.resourcesTexts[i + 1];

            if (!vs || !fs || (vs.name.indexOf("_vs") < 0))
                continue;

            let program = vs.name.substr(0, vs.name.indexOf("_"));

            ShaderManager.ShaderPrograms[program] = new ShaderProgram();

            result = ShaderManager.ShaderPrograms[program].LoadAndLink(vs.result, fs.result);

            if ((result != 0) || !ShaderManager.ShaderPrograms[program].Program())
                return result;
        }

        return result;
    }
}

ShaderManager.ShaderPrograms = [];
