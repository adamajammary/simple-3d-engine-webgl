/**
* Shader Manager
* @class
*/
class ShaderManager
{
    /**
    * @param  {string} file
    * @return {string}
    */
    static async loadResource(file)
    {
        let response = await fetch((!DEBUG ? "" : "http://localhost:8000/") + file);
        return response.text();
    }

    /**
    * @param {object} scope
    */
    static Init(scope)
    {
        let result = 0;

        for (let i = 0; i < ShaderID.NR_OF_SHADERS; i++)
        {
            let vs = scope.resourcesTexts[(i * 2) + 0];
            let fs = scope.resourcesTexts[(i * 2) + 1];
            let gs = null;

            if (!vs || !fs || (vs.name.indexOf("_vs") < 0))
                continue;

            if (i == ShaderID.DEPTH_OMNI) {
                gs = { file: "resources/shaders/depth.omni.gs.glsl", name: "depth.omni_gs", result: null };
                gs.result = ShaderManager.loadResource(gs.file);
            }
            
            let shaderName            = vs.name.substr(0, vs.name.indexOf("_"));
            ShaderManager.Programs[i] = new ShaderProgram(shaderName);
            result = ShaderManager.Programs[i].LoadAndLink(vs, fs, gs);

            if ((result != 0) || !ShaderManager.Programs[i].Program())
                return result;
        }

        return result;
    }
}

ShaderManager.Programs = [ null, null, null, null, null, null ];
