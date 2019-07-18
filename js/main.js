let app = angular.module("mainApp", []);

app.config(["$compileProvider", function ($compileProvider) {
    // ftp|mailto|file|chrome-extension|local|blob|tel|sms|
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|data):/);
}]);

app.controller("mainController", function($controller, $http, $rootScope, $scope)
{
    $scope.appName           = "Simple 3D Engine (WebGL)";
    $scope.appVersion        = "1.0.2";
    $scope.boundingVolumes   = [ "None", "Box (AABB)", "Box (OBB)", "Sphere" ];
    $scope.components        = [];
    $scope.controller        = $controller;
    $scope.copyright         = "\u00A9 2017 Adam A. Jammary";
    $scope.drawModes         = [ "Filled", "Wireframe" ];
    $scope.FPS               = 0;
    $scope.GPU               = "";
    $scope.http              = $http;
    $scope.rootScope         = $rootScope;
    $scope.sceneURL          = "";
    $scope.selectedComponent = null;
    $scope.selectedChild     = null;
    $scope.state             = "";
    $scope.tested            = "Tested on Firefox v.67.0.4 (64-bit)";

    $scope.alignments = [
        "Top-Left",
        "Top-Center",
        "Top-Right",
        "Middle-Left",
        "Middle-Center",
        "Middle-Right",
        "Bottom-Left",
        "Bottom-Center",
        "Bottom-Right"
    ];

    $scope.aspectRatios = [
        { value: 0.5625, name: "16:9" },
        { value: 0.75,   name: "4:3" }
    ];

    $scope.fonts = [
        "Arial",
        "Arial Black",
        "Comic Sans MS",
        "Courier New",
        "Georgia",
        "Impact",
        "Lucida Console",
        "Lucida Sans Unicode",
        "Palatino Linotype",
        "Tahoma",
        "Times New Roman",
        "Trebuchet MS",
        "Verdana"
    ];

    $scope.fovs = [
        { value: PI_QUARTER,         name: "45\u00B0" },
        { value: (Math.PI * 0.3333), name: "60\u00B0" },
        { value: (Math.PI * 0.4167), name: "75\u00B0" },
        { value: PI_HALF,            name: "90\u00B0" }
    ];

    $scope.icons_geometry = [
        { file: "img/icon-plane-128.png",         name: "plane",       title: "Plane" },
        { file: "img/icon-cube-100.png",          name: "cube",        title: "Cube"  },
        { file: "img/icon-uvsphere-100.png",      name: "uv_sphere",   title: "UV Sphere"  },
        { file: "img/icon-icosphere-100-2.png",   name: "ico_sphere",  title: "Ico Sphere"  },
        { file: "img/icon-cylinder-100.png",      name: "cylinder",    title: "Cylinder"  },
        { file: "img/icon-cone-128-1.png",        name: "cone",        title: "Cone"  },
        { file: "img/icon-torus-256.png",         name: "torus",       title: "Torus"  },
        { file: "img/icon-monkeyhead-100x83.png", name: "monkey_head", title: "Monkey"  }
    ];

    $scope.icons_environment = [
        { file: "img/icon-skybox-256.png",      name: "skybox",  title: "Skybox"  },
        { file: "img/icon-terrain-200x121.png", name: "terrain", title: "Terrain"  },
        { file: "img/icon-water-208x235.png",   name: "water",   title: "Water"  }
    ];

    $scope.icons_lights = [
        { file: "img/icon-light-directional-128.png", name: "light_directional", title: "Directional Light" },
        { file: "img/icon-light-point-128.png",       name: "light_point",       title: "Point Light"  },
        { file: "img/icon-light-spot-2-128.png",      name: "light_spot",        title: "Spot Light"  }
    ];

    $scope.icons_ui = [
        { file: "img/icon-hud-128.png", name: "hud", title: "HUD"  }
    ];

    $scope.interactions = [
        { header: "Keyboard F5",                    data: "Resets the session, all unsaved work will be lost." },
        { header: "Keyboard WASD",                  data: "Move forward / left / back / right." },
        { header: "Mouse Middle/Right",             data: "Rotate horizontal / vertical (yaw / pitch)." },
        { header: "Mouse Middle/Right + CTRL-key",  data: "Move forward / back." },
        { header: "Mouse Middle/Right + SHIFT-key", data: "Move horizontal / vertical." },
        { header: "Mouse Scroll",                   data: "Move forward / back." },
        { header: "Mouse Scroll + CTRL-key",        data: "Move left / right." },
        { header: "Mouse Scroll + SHIFT-key",       data: "Move up / down." }
    ];

    $scope.labelsDefault = [ "Diffuse", "Specular" ];
    $scope.labelsSkybox  = [ "Right", "Left", "Top", "Bottom", "Back", "Front" ];
    $scope.labelsTerrain = [ "Background", "Red",  "Green", "Blue", "Blend Map" ];
    $scope.labelsWater   = [ "DU/DV Map", "Normal Map" ];

    $scope.resourcesTexts = [
        { file: "resources/shaders/color.vs.glsl",      name: "color_vs",      result: null },
        { file: "resources/shaders/color.fs.glsl",      name: "color_fs",      result: null },
        { file: "resources/shaders/default.vs.glsl",    name: "default_vs",    result: null },
        { file: "resources/shaders/default.fs.glsl",    name: "default_fs",    result: null },
        { file: "resources/shaders/depth.vs.glsl",      name: "depth_vs",      result: null },
        { file: "resources/shaders/depth.fs.glsl",      name: "depth_fs",      result: null },
        { file: "resources/shaders/depth.omni.vs.glsl", name: "depth.omni_vs", result: null },
        { file: "resources/shaders/depth.omni.fs.glsl", name: "depth.omni_fs", result: null },
        { file: "resources/shaders/hud.vs.glsl",        name: "hud_vs",        result: null },
        { file: "resources/shaders/hud.fs.glsl",        name: "hud_fs",        result: null },
        { file: "resources/shaders/skybox.vs.glsl",     name: "skybox_vs",     result: null },
        { file: "resources/shaders/skybox.fs.glsl",     name: "skybox_fs",     result: null },
        { file: "resources/shaders/color.vs.glsl",      name: "wireframe_vs",  result: null },
        { file: "resources/shaders/color.fs.glsl",      name: "wireframe_fs",  result: null },
        { file: "resources/models/quad.json",           name: "quad",          result: null },
        { file: "resources/models/plane.json",          name: "plane",         result: null },
        { file: "resources/models/cube.json",           name: "cube",          result: null },
        { file: "resources/models/uv_sphere.json",      name: "uv_sphere",     result: null },
        { file: "resources/models/ico_sphere.json",     name: "ico_sphere",    result: null },
        { file: "resources/models/cylinder.json",       name: "cylinder",      result: null },
        { file: "resources/models/cone.json",           name: "cone",          result: null },
        { file: "resources/models/torus.json",          name: "torus",         result: null },
        { file: "resources/models/monkey_head.json",    name: "monkey_head",   result: null }
    ];

    $scope.resourceImages = [
        { file: "resources/textures/white_1x1.png",                 name: "emptyTexture",      result: null },
        { file: "resources/textures/terrain/backgroundTexture.png", name: "backgroundTexture", result: null },
        { file: "resources/textures/terrain/rTexture.png",          name: "rTexture",          result: null },
        { file: "resources/textures/terrain/gTexture.png",          name: "gTexture",          result: null },
        { file: "resources/textures/terrain/bTexture.png",          name: "bTexture",          result: null },
        { file: "resources/textures/terrain/blendMap.png",          name: "blendMap",          result: null },
        { file: "resources/textures/water/duDvMap.png",             name: "duDvMap",           result: null },
        { file: "resources/textures/water/normalMap.png",           name: "normalMap",         result: null },
        { file: "resources/textures/skybox/right.png",              name: "skyboxRight",       result: null },
        { file: "resources/textures/skybox/left.png",               name: "skyboxLeft",        result: null },
        { file: "resources/textures/skybox/top.png",                name: "skyboxTop",         result: null },
        { file: "resources/textures/skybox/bottom.png",             name: "skyboxBottom",      result: null },
        { file: "resources/textures/skybox/back.png",               name: "skyboxBack",        result: null },
        { file: "resources/textures/skybox/front.png",              name: "skyboxFront",       result: null }
    ];

    /**
     * @param  {Component} component
     * @return {number}
     */
    $scope.addComponent = function(component)
    {
        switch (component.Type()) {
        case ComponentType.CAMERA:
            RenderEngine.Camera = component;
            break;
        case ComponentType.HUD:
            for (let hud of component.Children)
                RenderEngine.HUDs.push(hud);
            break;
        case ComponentType.SKYBOX:
            RenderEngine.Skybox = component.Children[0];
            break;
        case ComponentType.LIGHTSOURCE:
            if ($scope.addLightSource(component) < 0)
                return -2;

            if (component.SourceType() !== LightType.DIRECTIONAL) {
                for (let child of component.Children)
                    RenderEngine.LightSources.push(child);
            }

            break;
        default:
            for (let mesh of component.Children)
                RenderEngine.Renderables.push(mesh);
            break;
        }
        
        $scope.selectedComponent = component;
        $scope.components.push(component);
        $scope.selectComponent(component);
        
        return 0;
    }

    /**
     * @param  {Component} component 
     * @return {number}
     */
    $scope.addLightSource = function(component)
    {
        if (!component)
            return -1;
    
        for (let i = 0; i < MAX_LIGHT_SOURCES; i++) {
            if (!Utils.LightSources[i]) {
                Utils.LightSources[i] = component;
                return 0;
            }
        }
        
        alert("WARNING: Max " + MAX_LIGHT_SOURCES + " light sources are supported in the scene.");

        return -2;
    }
    
    /**
    * @return {boolean}
    */
    $scope.drawBoundingVolumesGet = function()
    {
        return RenderEngine.DrawBoundingVolume;
    }
    
    /**
    * @param {boolean} enable
    */
    $scope.drawBoundingVolumesSet = function(enable)
    {
        RenderEngine.DrawBoundingVolume = enable;
    }

    $scope.clearScene = function()
    {
        RenderEngine.Camera      = null;
        $scope.selectedComponent = null;
        $scope.selectedChild     = null;
        RenderEngine.Skybox      = null;

        for (let i = 0; i < MAX_LIGHT_SOURCES; i++)
            Utils.LightSources[i] = null;

        RenderEngine.HUDs         = [];
        RenderEngine.LightSources = [];
        RenderEngine.Renderables  = [];

        // Skip camera
        for (let i = 0; i < $scope.components.length; i++)
            $scope.removeComponent(i);

        $scope.components = [];

        Utils.DepthMap2D = new FrameBuffer(FBO_TEXTURE_SIZE, FBO_TEXTURE_SIZE, FBOType.DEPTH, TextureType.TEX_2D_ARRAY);
        //Utils.DepthMapCube = new FrameBuffer(FBO_TEXTURE_SIZE, FBO_TEXTURE_SIZE, FBOType.DEPTH, TextureType.CUBEMAP_ARRAY);
    }

    /**
     * @param {Component} component
     */
    $scope.getComponentIndex = function(component)
    {
        for (let i = 0; i < $scope.components.length; i++) {
            if ($scope.components[i] === component)
                return i;
        }
    }

    /**
     * @param {string} name 
     */
    $scope.getResource = function(name)
    {
        for (let resource of $scope.resourcesTexts) {
            if (resource.name === name)
                return resource;
        }

        for (let resource of $scope.resourceImages) {
            if (resource.name === name)
                return resource;
        }

        return null;
    }

    /**
    * @return {Array<Texture>}
    */
    $scope.getTextures = function()
    {
        let textures = [];

        if ($scope.showTestSkybox() && $scope.selectedChild.Textures)
            textures = $scope.selectedChild.Textures;
        else if ($scope.showTestWater() && $scope.selectedComponent.FBO())
            textures = $scope.selectedComponent.FBO().Textures.slice(2, 4);
        else if ($scope.showTestTerrain() && $scope.selectedChild.Textures)
            textures = $scope.selectedChild.Textures.slice(0, -1);
        else if ($scope.showTestModel() && $scope.selectedChild.Textures)
            textures = $scope.selectedChild.Textures.slice(0, 2);
        
        return textures;
    }

    /**
    * @return {boolean}
    */
    $scope.isLoadComplete = function()
    {
        for (let resource of $scope.resourcesTexts) {
            if (!resource.result)
                return false;
        }

        for (let resource of $scope.resourceImages) {
            if (!resource.result)
                return false;
        }
        
        return true;
    }

    /**
    * @return {boolean}
    */
    $scope.isReadOnlyName = function()
    {
        return (!$scope.selected.Parent || ($scope.selected.Parent.Type() === ComponentType.SKYBOX));
    }

    /**
    * @return {HUD}
    */
    $scope.loadHUD = function()
    {
        let resource = $scope.getResource("quad");
        let hud      = new HUD(resource.result, resource.file);

        if (!hud || !hud.IsValid())
            return null;

        $scope.addComponent(hud);

        return hud;
    }

    /**
    * @param {object} resource  // { file:"", name:"", result:null }
    * @param {any}    callback
    */
    $scope.loadImage = function(resource, callback)
    {
        let image = new Image();

        image.onload = function() {
            callback(image, resource);
        };

        image.src = resource.file;
    }

    /**
    * @param  {LightType} type
    * @return {LightSource}
    */
    $scope.loadLightSource = function(type)
    {
        let resource = $scope.getResource("ico_sphere");
        let light    = new LightSource(resource.result, resource.file, type);

        if (!light || !light.IsValid())
            return null;

        $scope.addComponent(light);

        return light;
    }

    /**
    * @param  {string} modelText
    * @param  {string} modelFile
    * @return {Model}
    */
    $scope.loadModel = function(modelText, modelFile)
    {
        let model = new Model(modelText, modelFile);

        if (!model || !model.IsValid())
            return null;

        $scope.addComponent(model);

        return model;
    }

    /**
    * Load Model File (JSON)
    * @param   {Array<object>} files
    * @returns {number}
    */
    $scope.loadModelFile = function(files)
    {
        if (!files || (files.length < 1) || !files[0])
            return -1;

        let fileReader = new FileReader();

        fileReader.onload = function(event) {
            $scope.loadModel(event.target.result, files[0].name);
        }

        fileReader.readAsText(files[0]);

        return 0;
    }
    
    /**
    * @param {object} result {HttpImage} or {string}
    * @param {object} resource
    */
    $scope.loadResource = function(result, resource)
    {
        if (result)
        {
            resource.result = result;
            $scope.state    = ("Loading " + resource.file + " ... OK");

            if ($scope.isLoadComplete())
                $scope.startEngine();
        } else {
            $scope.state = ("Loading " + resource.file + " ... FAIL");
        }
    }

    $scope.loadResources = function()
    {
        for (let resource of $scope.resourcesTexts)
            $scope.loadText(resource, $scope.loadResource);
        
        for (let resource of $scope.resourceImages)
            $scope.loadImage(resource, $scope.loadResource);
    };

    /**
    * @param {string} sceneText
    */
    $scope.loadScene = function(sceneText)
    {
        $scope.clearScene();
        RenderEngine.Draw();

        if (!RenderEngine.Camera)
            $scope.addComponent(new Camera());

        let component = null;
        let sceneData = JSON.parse(LZString.decompressFromEncodedURIComponent(sceneText));

        // COMPONENTS
        for (let i = 0; i < sceneData.nr_of_components; i++)
        {
            if (!sceneData.components[i])
                continue;

            switch (parseInt(sceneData.components[i].type)) {
            case ComponentType.CAMERA:
                RenderEngine.Camera.Name = sceneData.components[i].name;

                RenderEngine.Camera.MoveTo(Utils.ToFloatArray3(sceneData.components[i].position));
                RenderEngine.Camera.RotateTo(Utils.ToFloatArray3(sceneData.components[i].rotation));
                break;
            case ComponentType.HUD:
                component      = $scope.loadHUD();
                component.Name = sceneData.components[i].name;

                component.Transparent = sceneData.components[i].transparent;
                component.TextAlign   = sceneData.components[i].text_align;
                component.TextFont    = sceneData.components[i].text_font;
                component.TextSize    = sceneData.components[i].text_size;
                component.TextColor   = sceneData.components[i].text_color;

                component.Update(sceneData.components[i].text);
                break;
            case ComponentType.MODEL:
                component      = $scope.loadModel(sceneData.components[i].model_text, sceneData.components[i].model_file);
                component.Name = sceneData.components[i].name;
                break;
            case ComponentType.SKYBOX:
                component      = $scope.loadSkybox(sceneData.components[i].children[0].textures[0].image_files);
                component.Name = sceneData.components[i].name;
                continue;
            case ComponentType.TERRAIN:
                component      = $scope.loadTerrain(sceneData.components[i].size, sceneData.components[i].octaves, sceneData.components[i].redistribution);
                component.Name = sceneData.components[i].name;
                break;
            case ComponentType.WATER:
                component                    = $scope.loadWater();
                component.Name               = sceneData.components[i].name;
                component.FBO().Speed        = sceneData.components[i].speed;
                component.FBO().WaveStrength = sceneData.components[i].wave_strength;
                break;
            case ComponentType.LIGHTSOURCE:
                component      = $scope.loadLightSource(parseInt(sceneData.components[i].source_type));
                component.Name = sceneData.components[i].name;

                component.SetActive(sceneData.components[i].active);
                component.SetAmbient(Utils.ToFloatArray3(sceneData.components[i].ambient));
                component.SetColor(Utils.ToFloatArray4(sceneData.components[i].diffuse));
                component.SetSpecularIntensity(Utils.ToFloatArray3(sceneData.components[i].spec_intensity));
                component.SetSpecularShininess(sceneData.components[i].spec_shininess);
                component.SetDirection(Utils.ToFloatArray3(sceneData.components[i].direction));
                component.SetAttenuationLinear(sceneData.components[i].att_linear);
                component.SetAttenuationQuadratic(sceneData.components[i].att_quadratic);
                component.SetConeInnerAngle(sceneData.components[i].inner_angle);
                component.SetConeOuterAngle(sceneData.components[i].outer_angle);
                break;
            }

            // CHILDREN
            for (let j = 0; j < sceneData.components[i].nr_of_children; j++)
            {
                if (!component || !sceneData.components[i].children[j])
                    continue;

                let child = component.Children[j];

                if (!child)
                    continue;

                child.Name = sceneData.components[i].children[j].name;
                
                child.MoveTo(Utils.ToFloatArray3(sceneData.components[i].children[j].position));
                child.ScaleTo(Utils.ToFloatArray3(sceneData.components[i].children[j].scale));
                child.RotateTo(Utils.ToFloatArray3(sceneData.components[i].children[j].rotation));

                child.AutoRotate = sceneData.components[i].children[j].auto_rotate;
                child.SetAutoRotation(Utils.ToFloatArray3(sceneData.components[i].children[j].auto_rotation));

                child.ComponentMaterial.diffuse            = Utils.ToFloatArray4(sceneData.components[i].children[j].color);
                child.ComponentMaterial.specular.intensity = Utils.ToFloatArray3(sceneData.components[i].children[j].spec_intensity);
                child.ComponentMaterial.specular.shininess = sceneData.components[i].children[j].spec_shininess;

                child.SetBoundingVolume(sceneData.components[i].children[j].bounding_volume);

                // TEXTURES
                for (let k = 0; k < sceneData.components[i].children[j].nr_of_textures; k++)
                {
                    if (!sceneData.components[i].children[j].textures[k])
                        continue;

                    // TERRAIN, WATER
                    if ((component.Type() === ComponentType.TERRAIN) || (component.Type() === ComponentType.WATER))
                    {
                        let texture = (component.Type() === ComponentType.WATER ? component.FBO().Textures[k] : child.Textures[k]);

                        if (!texture)
                            continue;

                        texture.ScaleTo(Utils.ToFloatArray2(sceneData.components[i].children[j].textures[k].scale));
                    }
                    // MODEL
                    else
                    {
                        // HUD
                        if ((component.Type() === ComponentType.HUD) && (k > 0))
                            continue;

                        let image = new Image();
                        image.src = sceneData.components[i].children[j].textures[k].image_src;

                        setTimeout(function(image, tex, child, index)
                        {
                            let img = { file: tex.image_files[0], name: tex.image_files[0], result: image }

                            let texture = new Texture(
                                [ img ], TextureType.TEX_2D, FBOType.UNKNOWN,
                                tex.repeat, tex.flip, tex.transparent,
                                Utils.ToFloatArray2(tex.scale)
                            );

                            child.LoadTexture(texture, index);
                        }, 10, image, sceneData.components[i].children[j].textures[k], child, k);
                    }
                }
            }

            if (component && (component.Type() === ComponentType.LIGHTSOURCE))
                component.MoveTo(Utils.ToFloatArray3(sceneData.components[i].position));
        }
    }

    /**
    * Load Scene File (scene)
    * @param  {object} element
    * @return {number}
    */
    $scope.loadSceneFile = function(element)
    {
        if (!element.files || (element.files.length < 1) || !element.files[0])
            return -1;

        let fileReader = new FileReader();
        
        fileReader.onload = function(event) {
            $scope.loadScene(event.target.result);
            element.value = "";
        }

        fileReader.readAsText(element.files[0]);

        return 0;
    }

    /**
    * @param  {Array<string>} imageFiles
    * @return {Skybox}
    */
    $scope.loadSkybox = function(imageFiles = [])
    {
        let images2 = [];

        if (imageFiles.length === 0)
        {
            images2 = [
                $scope.getResource("skyboxRight"),
                $scope.getResource("skyboxLeft"),
                $scope.getResource("skyboxTop"),
                $scope.getResource("skyboxBottom"),
                $scope.getResource("skyboxBack"),
                $scope.getResource("skyboxFront")
            ];
        }
        else
        {
            for (let i = 0; i < MAX_TEXTURES; i++)
                images2[i] = $scope.getResource(imageFiles[i]);
        }

        let resource = $scope.getResource("cube");
        let skybox   = new Skybox(resource.result, resource.file, images2);

        if (!skybox || !skybox.IsValid())
            return null;

        if (RenderEngine.Skybox)
        {
            let index = $scope.components.indexOf(RenderEngine.Skybox);

            if (index >= 0)
                $scope.removeComponent(index);
        }

        $scope.addComponent(skybox);

        return skybox;
    }

    /**
    * @param  {number} size
    * @param  {number} octaves
    * @param  {number} redistribution
    * @return {Terrain}
    */
    $scope.loadTerrain = function(size, octaves, redistribution)
    {
        let images = [
            $scope.getResource("backgroundTexture"),
            $scope.getResource("rTexture"),
            $scope.getResource("gTexture"),
            $scope.getResource("bTexture"),
            $scope.getResource("blendMap")
        ];

        let terrain = new Terrain(images, size, octaves, redistribution);

        if (!terrain || !terrain.IsValid())
            return null;

        $scope.addComponent(terrain);

        return terrain;
    }
    
    /**
    * @param {object} resource  // { file:string, name:string, result:string }
    * @param {any}    callback
    */
    $scope.loadText = function(resource, callback)
    {
        let url = ((!DEBUG ? "" : "http://localhost:8000/") + resource.file);

        fetch(url)
        .then(function(response) {
            return (response.ok ? response.text() : null);
        })
        .then(function(data) {
            callback(data, resource);
        });
    }

    /**
    * Load Texture File (image)
    * @param  {object} element
    * @param  {number} index
    * @return {number}
    */
    $scope.loadTextureFile = function(element, index)
    {
        if (!element.files || (element.files.length < 1) || !element.files[0])
            return -1;

        let fileReader = new FileReader();

        fileReader.onload = function(event)
        {
            let image = new Image();
            image.src = event.target.result;

            setTimeout(function(img, el, idx)
            {
                if ($scope.selectedChild) {
                    let texImage = { file: el.files[0].name, name: el.files[0].name, result: img };
                    $scope.selectedChild.LoadTextureImage(texImage, idx);
                }
                
                el.value = "";
            }, 10, image, element, index);
        }

        fileReader.readAsDataURL(element.files[0]);

        return 0;
    }

    /**
    * @return {Water}
    */
    $scope.loadWater = function()
    {
        let images = [
            $scope.getResource("duDvMap"),
            $scope.getResource("normalMap")
        ];

        let resource = $scope.getResource("plane");
        let water    = new Water(resource.result, resource.file, images);

        if (!water || !water.IsValid())
            return null;

        $scope.addComponent(water);

        return water;
    }

    $scope.onClickClearScene = function()
    {
        $scope.clearScene();

        if (!RenderEngine.Camera) {
            $scope.addComponent(new Camera());
            $scope.loadLightSource(LightType.DIRECTIONAL);
        }
    }

    /**
     * @param {string} name
     */
    $scope.onClickIcon = function(name)
    {
        switch (name) {
        case "skybox":
            $scope.loadSkybox();
            break;
        case "terrain":
            $scope.loadTerrain(10.0, 1, 2.0);
            break;
        case "water":
            $scope.loadWater();
            break;
        case "hud":
            $scope.loadHUD();
            break;
        case "light_directional":
            $scope.loadLightSource(LightType.DIRECTIONAL);
            break;
        case "light_point":
            $scope.loadLightSource(LightType.POINT);
            break;
        case "light_spot":
            $scope.loadLightSource(LightType.SPOT);
            break;
        default:
            let resource = $scope.getResource(name);
            if (resource)
                $scope.loadModel(resource.result, resource.file);
            break;
        }
    }

    /**
    * @param {object} event
    * @param {string} tabName
    */
    $scope.onClickTab = function(event, tabName)
    {
        let tab        = document.getElementsByClassName("tab");
        let tabButtons = document.getElementsByClassName("tab_btn");
        let tabClicked = document.getElementById(tabName)

        for (let i = 0; i < tab.length; i++)
            tab[i].style.display = "none";

        for (let i = 0; i < tabButtons.length; i++)
            tabButtons[i].className = tabButtons[i].className.replace(" active", "");

        tabClicked.style.display       = "block";
        event.currentTarget.className += " active";
    }

    /**
    * @param  {number} index
    * @return {number}
    */
    $scope.removeComponent = function(index)
    {
        if ((index < 0) || (index >= $scope.components.length))
            return -1;

        delete $scope.components[index];
        $scope.components[index] = null;

        return 0;
    }

    /**
    * @return {number}
    */
    $scope.removeSelectedComponent = function()
    {
        if (!$scope.selectedComponent || ($scope.selectedComponent.Type() === ComponentType.CAMERA))
            return -1;
        
        for (let child of $scope.selectedComponent.Children)
            RenderEngine.RemoveMesh(child);

        if ($scope.selectedComponent.Type() === ComponentType.LIGHTSOURCE)
            $scope.removeSelectedLightSource();
        
        let index = $scope.components.indexOf($scope.selectedComponent);

        if (index > 0)
        {
            $scope.selectComponent($scope.components[index - 1]);
            $scope.removeComponent(index);
            $scope.components.splice(index, 1);
        }

        return 0;
    }

    /**
    * @return {number}
    */
    $scope.removeSelectedChild = function()
    {
        if (!$scope.selectedChild)
    		return -1;

        RenderEngine.RemoveMesh($scope.selectedChild);

        let index = $scope.selectedComponent.RemoveChild($scope.selectedChild);

        if (index >= 0)
        {
            if ($scope.selectedComponent.Children.length > 0)
            {
                if (index == $scope.selectedComponent.Children.length)
                    $scope.selectChild($scope.selectedComponent.Children[index - 1]);
                else
                    $scope.selectChild($scope.selectedComponent.Children[index]);
            } else {
                $scope.removeSelectedComponent();
            }
        }

        return 0;
    }

    $scope.removeSelectedLightSource = function()
    {
        for (let i = 0; i < MAX_LIGHT_SOURCES; i++) {
            if ($scope.selectedComponent === Utils.LightSources[i]) {
                Utils.LightSources[i] = null;
                break;
            }
        }
    }
    
    $scope.saveScene = function()
    {
        let sceneData        = { "nr_of_components": $scope.components.length };
        sceneData.components = {};

        for (let i = 0; i < $scope.components.length; i++)
        {
            let component = $scope.components[i];

            if (!component)
                continue;

            let children = component.Children;
            
            switch (component.Type()) {
            case ComponentType.CAMERA:
                sceneData.components[i] = {
                    "type":           parseInt(component.Type()),
                    "name":           component.Name,
                    "position":       component.Position(),
                    "rotation":       component.Rotation(),
                    "nr_of_children": 0
                };
                break;
            case ComponentType.HUD:
                sceneData.components[i] = {
                    "type":           parseInt(component.Type()),
                    "name":           component.Name,
                    "transparent":    component.Transparent(),
                    "text":           component.Text(),
                    "text_align":     component.TextAlign(),
                    "text_font":      component.TextFont(),
                    "text_size":      component.TextSize(),
                    "text_color":     component.TextColor(),
                    "nr_of_children": children.length
                };
                break;
            case ComponentType.LIGHTSOURCE:
                sceneData.components[i] = {
                    "type":           parseInt(component.Type()),
                    "name":           component.Name,
                    "source_type":    parseInt(component.SourceType()),
                    "active":         component.Active(),
                    "position":       component.Children[0].Position(),
                    "ambient":        component.GetMaterial().ambient,
                    "diffuse":        component.GetMaterial().diffuse,
                    "spec_intensity": component.GetMaterial().specular.intensity,
                    "spec_shininess": component.GetMaterial().specular.shininess,
                    "direction":      component.Direction(),
                    "att_linear":     component.GetAttenuation().linear,
                    "att_quadratic":  component.GetAttenuation().quadratic,
                    "inner_angle":    component.ConeInnerAngle(),
                    "outer_angle":    component.ConeOuterAngle(),
                    "nr_of_children": 0
                };
                break;
            case ComponentType.MODEL:
                sceneData.components[i] = {
                    "type":           parseInt(component.Type()),
                    "name":           component.Name,
                    "model_file":     component.ModelFile,
                    "model_text":     component.ModelText,
                    "nr_of_children": children.length
                };
                break;
            case ComponentType.SKYBOX:
                sceneData.components[i] = {
                    "type":           parseInt(component.Type()),
                    "name":           component.Name,
                    "nr_of_children": children.length
                };
                break;
            case ComponentType.TERRAIN:
                sceneData.components[i] = {
                    "type":           parseInt(component.Type()),
                    "name":           component.Name,
                    "size":           component.Size(),
                    "octaves":        component.Octaves(),
                    "redistribution": component.Redistribution(),
                    "nr_of_children": children.length
                };
                break;
            case ComponentType.WATER:
                sceneData.components[i] = {
                    "type":           parseInt(component.Type()),
                    "name":           component.Name,
                    "speed":          component.FBO().Speed,
                    "wave_strength":  component.FBO().WaveStrength,
                    "nr_of_children": children.length
                };
                break;
            default:
                break;
            }

            if (sceneData.components[i].nr_of_children === 0)
                continue;

            sceneData.components[i].children = [];

            // CHILDREN
            for (let j = 0; j < children.length; j++)
            {
                sceneData.components[i].children[j] = {
                    "name":            children[j].Name,
                    "position":        children[j].Position(),
                    "scale":           children[j].Scale(),
                    "rotation":        children[j].Rotation(),
                    "auto_rotation":   children[j].AutoRotation(),
                    "auto_rotate":     children[j].AutoRotate,
                    "color":           children[j].ComponentMaterial.diffuse,
                    "spec_intensity":  children[j].ComponentMaterial.specular.intensity,
                    "spec_shininess":  children[j].ComponentMaterial.specular.shininess,
                    "bounding_volume": (children[j].BoundingVolume() ? children[j].BoundingVolumeType() : BoundingVolumeType.NONE),
                    "nr_of_textures":  MAX_TEXTURES
                };
                
                sceneData.components[i].children[j].textures = {};

                for (let k = 0; k < MAX_TEXTURES; k++)
                {
                    let texture = (component.Type() === ComponentType.WATER ? component.FBO().Textures[k] : children[j].Textures[k]);

                    let imageFilesJSON = [];

                    for (let l = 0; l < MAX_TEXTURES; l++)
                        imageFilesJSON[l] = texture.File(l);

                    sceneData.components[i].children[j].textures[k] = {
                        "image_files": imageFilesJSON,
                        "image_src":   texture.ImageSource(),
                        "repeat":      texture.Repeat(),
                        "flip":        texture.FlipY(),
                        "transparent": texture.Transparent(),
                        "scale":       texture.Scale()
                    };
                }
            }
        }

        sceneData       = JSON.stringify(sceneData);
        let sceneData2  = LZString.compressToEncodedURIComponent(sceneData);
        //$scope.sceneURL = ("data:text/plain;base64," + sceneData2);
        $scope.sceneURL = ("data:text/plain;charset=utf-8," + sceneData2);
        //$scope.sceneURL = ("data:text/plain;charset=utf-16," + sceneData2);
        //$scope.sceneURL = ("data:text/plain;charset=utf-8," + encodeURIComponent(sceneData));

        //localStorage.setItem("scene_url",  "data:text/plain;charset=utf-8,");
        //localStorage.setItem("scene_data", sceneData);
    }

    /**
    * @param {Component} component
    */
    $scope.selectComponent = function(component)
    {
        if (component)
        {
            $scope.selectedComponent    = component;
            $scope.components_component = component;
            $scope.selectedChild        = null;

            for (let child of component.Children)
                $scope.selectChild(child);
        }
    }

    /**
    * @param {Component} child
    */
    $scope.selectChild = function(child)
    {
        if (child) {
            $scope.selectedChild    = child;
            $scope.components_child = child;
        }
    }

    /**
    * @param {string} state
    */
    $scope.setState = function(state)
    {
        $scope.state = state;

        if (DEBUG)
            console.debug(state);
    }

    /**
    * @return {boolean}
    */
    $scope.showTestDebug = function()
    {
        return DEBUG;
    }

    /**
    * @return {boolean}
    */
    $scope.showTestSelected = function()
    {
        return (($scope.selectedChild != null) && ($scope.selectedChild !== undefined));
    }

    /**
    * @return {boolean}
    */
    $scope.showTestCamera = function()
    {
        return ($scope.selectedComponent && ($scope.selectedComponent.Type() === ComponentType.CAMERA));
    }

    /**
    * @return {boolean}
    */
    $scope.showTestHUD = function()
    {
        return ($scope.selectedComponent && ($scope.selectedComponent.Type() === ComponentType.HUD));
    }

    /**
    * @return {boolean}
    */
    $scope.showTestLightSource = function()
    {
        return ($scope.selectedComponent && ($scope.selectedComponent.Type() === ComponentType.LIGHTSOURCE));
    }

    /**
    * @return {boolean}
    */
    $scope.showTestLightDirectional = function()
    {
        return ($scope.showTestLightSource() && ($scope.selectedComponent.SourceType() === LightType.DIRECTIONAL));
    }

    /**
    * @return {boolean}
    */
    $scope.showTestLightPoint = function()
    {
        return ($scope.showTestLightSource() && ($scope.selectedComponent.SourceType() === LightType.POINT));
    }

    /**
    * @return {boolean}
    */
    $scope.showTestLightSpot = function()
    {
        return ($scope.showTestLightSource() && ($scope.selectedComponent.SourceType() === LightType.SPOT));
    }

    /**
    * @return {boolean}
    */
    $scope.showTestModel = function()
    {
        return ($scope.selectedComponent && ($scope.selectedComponent.Type() === ComponentType.MODEL));
    }

    /**
    * @return {boolean}
    */
    $scope.showTestSkybox = function()
    {
        return ($scope.selectedComponent && ($scope.selectedComponent.Type() === ComponentType.SKYBOX));
    }

    /**
    * @return {boolean}
    */
    $scope.showTestTerrain = function()
    {
        return ($scope.selectedComponent && ($scope.selectedComponent.Type() === ComponentType.TERRAIN));
    }

    /**
    * @return {boolean}
    */
    $scope.showTestWater = function()
    {
        return ($scope.selectedComponent && ($scope.selectedComponent.Type() === ComponentType.WATER));
    }
    
    /**
    * @return {boolean}
    */
    $scope.srgbGammaCorrectionGet = function()
    {
        return RenderEngine.EnableSRGB;
    }
    
    /**
    * @param {boolean} enable
    */
    $scope.srgbGammaCorrectionSet = function(enable)
    {
        RenderEngine.EnableSRGB = enable;
    }

    /**
    * INIT ENGINE
    * @return {number}
    */
    $scope.startEngine = function()
    {
        // BROWSER CHECK
        $scope.setState("Checking the browser support ...");

        if ((navigator.userAgent.indexOf("MSIE") >= 0) || (navigator.appVersion.indexOf("Trident") >= 0))
        {
            alert("ERROR: Internet Explorer does not fully support ECMAScript 6.");
            $scope.setState("Checking the browser support ... FAIL");
            $scope.$apply();
            return -1;
        }

        if (!window.File || !window.FileReader || !window.FileList || !window.Blob || (typeof(Storage) === "undefined"))
        {
            alert("ERROR This browser does not fully support the HTML5 File and Storage APIs.");
            $scope.setState("Checking the browser support ... FAIL");
            $scope.$apply();
            return -2;
        }

        // RENDER ENGINE
        $scope.setState("Initializing the Render Engine ...");

        if (RenderEngine.Init() != 0)
        {
            alert("ERROR: Failed to initialize the Render Engine.");
            $scope.setState("Initializing the Render Engine ... FAIL");
            $scope.$apply();
            return -3;
        }

        // SHADER MANAGER
        $scope.setState("Initializing the Shader Manager ...");

        if (ShaderManager.Init($scope) != 0)
        {
            alert("ERROR: Failed to initialize the Shader Manager.");
            $scope.setState("Initializing the Shader Manager ... FAIL");
            $scope.$apply();
            return -4;
        }

        $scope.setState("Creating various resources ...");

        let images = [];

        for (let i = 0; i < MAX_TEXTURES; i++)
            images.push($scope.getResource("emptyTexture"));

        Utils.EmptyCubemap = new Texture(images, TextureType.CUBEMAP);
        Utils.EmptyTexture = new Texture([ $scope.getResource("emptyTexture") ]);
        Utils.DepthMap2D   = new FrameBuffer(FBO_TEXTURE_SIZE, FBO_TEXTURE_SIZE, FBOType.DEPTH, TextureType.TEX_2D_ARRAY);
        //Utils.DepthMapCube = new FrameBuffer(FBO_TEXTURE_SIZE, FBO_TEXTURE_SIZE, FBOType.DEPTH, TextureType.CUBEMAP_ARRAY);
        Utils.CubeJSON     = Utils.LoadJSON($scope.getResource("cube").result).meshes[0];
        Utils.SphereJSON   = Utils.LoadJSON($scope.getResource("ico_sphere").result).meshes[0];

        //if (!Utils.EmptyCubemap || !Utils.EmptyTexture || !Utils.DepthMap2D.Texture() || !Utils.DepthMapCube.Texture())
        if (!Utils.EmptyCubemap || !Utils.EmptyTexture || !Utils.DepthMap2D.Texture())
        {
            alert("ERROR: Failed to create various resources.");
            $scope.setState("Creating various resources ... FAIL");
            $scope.$apply();
            return -5;
        }

        // CAMERA
        $scope.setState("Creating the Camera ...");

        $scope.addComponent(new Camera());

        if (!RenderEngine.Camera)
        {
            alert("ERROR: Failed to create the camera.");
            $scope.setState("Creating the Camera ... FAIL");
            $scope.$apply();
            return -6;
        }

        $scope.setState("Creating the Directional Light ...");

        $scope.loadLightSource(LightType.DIRECTIONAL);

        if (!Utils.LightSources[0])
        {
            alert("ERROR: Failed to create the directional light.");
            $scope.setState("Creating the Directional Light ... FAIL");
            $scope.$apply();
            return -7;
        }

        // INPUT MANAGER
        $scope.setState("Initializing the Input Manager ...");

        if (InputManager.Init() != 0)
        {
            alert("ERROR: Failed to initialize the input manager.");
            $scope.setState("Initializing the Input Manager ... FAIL");
            $scope.$apply();
            return -8;
        }

        $scope.GPU = RenderEngine.GPU();

        for (let component of $scope.components)
            $scope.selectComponent(component);
    
        $scope.setState("Starting the WebGL 3D Engine ... OK");

        Utils.GameIsPaused = false;
        requestAnimationFrame($scope.startGameLoop);

        return 0;
    }

    /**
    * START GAME LOOP
    * @param {number} timePassed 
    */
    $scope.startGameLoop = function(timePassed)
    {
        if (!Utils.GameIsPaused)
        {
            // UPDATE
            TimeManager.UpdateDeltaTime();
            PhysicsEngine.Update($scope);

            // DRAW SCENE COMPONENTS
            RenderEngine.Draw();

            // FPS
            TimeManager.UpdateFPS(timePassed, $scope);
        }

        requestAnimationFrame($scope.startGameLoop);
    }

    /**
    * MAIN
    */
    $scope.loadResources();
});
