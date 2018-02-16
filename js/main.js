let app = angular.module('mainApp', []);

app.config(['$compileProvider', function ($compileProvider) {
    // ftp|mailto|file|chrome-extension|local|blob|tel|sms|
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|data):/);
}]);

app.controller('mainController', function($controller, $http, $rootScope, $scope)
{
    $scope.appName           = "Simple 3D Engine (WebGL)";
    $scope.appVersion        = "1.0.0";
    $scope.boundingVolumes   = [ "none", "box", "sphere" ];
    $scope.components        = [];
    $scope.copyright         = "\u00A9 2017 Adam A. Jammary";
    $scope.drawModes         = [ "Filled", "Wireframe" ];
    $scope.FPS               = 0;
    $scope.GPU               = "";
    $scope.sceneURL          = "";
    $scope.selectedComponent = null;
    $scope.selectedChild     = null;
    $scope.state             = "";
    $scope.tested            = "Tested on 64-bit Chrome v.64.0.3282.167 and Firefox v.58.0.2";

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
        { value: (Math.PI * 0.2500), name: "45\u00B0" },
        { value: (Math.PI * 0.3333), name: "60\u00B0" },
        { value: (Math.PI * 0.4167), name: "75\u00B0" },
        { value: (Math.PI * 0.5000), name: "90\u00B0" }
    ];

    $scope.icons = [
        { file: "img/icon-plane-128.png",         name: "plane",       title: "Plane" },
        { file: "img/icon-cube-100.png",          name: "cube",        title: "Cube"  },
        { file: "img/icon-uvsphere-100.png",      name: "uv_sphere",   title: "UV Sphere"  },
        { file: "img/icon-icosphere-100-2.png",   name: "ico_sphere",  title: "Ico Sphere"  },
        { file: "img/icon-cylinder-100.png",      name: "cylinder",    title: "Cylinder"  },
        { file: "img/icon-cone-128-1.png",        name: "cone",        title: "Cone"  },
        { file: "img/icon-torus-256.png",         name: "torus",       title: "Torus"  },
        { file: "img/icon-monkeyhead-100x83.png", name: "monkey_head", title: "Monkey"  },
        { file: "img/icon-skybox-256.png",        name: "skybox",      title: "Skybox"  },
        { file: "img/icon-terrain-200x121.png",   name: "terrain",     title: "Terrain"  },
        { file: "img/icon-water-208x235.png",     name: "water",       title: "Water"  },
        { file: "img/icon-hud-128.png",           name: "hud",         title: "HUD"  }
    ];

    $scope.interactions = [
        { header: "Keyboard F5:",              data: "Resets the session, all unsaved work will be lost." },
        { header: "Keyboard WASD:",            data: "Move forward / left / back / right." },
        { header: "Mouse-Middle:",             data: "Rotate horizontal / vertical (yaw / pitch)." },
        { header: "Mouse-Middle + CTRL-key:",  data: "Move forward / back." },
        { header: "Mouse-Middle + SHIFT-key:", data: "Move horizontal / vertical." },
        { header: "Mouse-Scroll:",             data: "Move forward / back." },
        { header: "Mouse-Scroll + CTRL-key:",  data: "Move left / right." },
        { header: "Mouse-Scroll + SHIFT-key:", data: "Move up / down." }
    ];

    $scope.resourcesTexts = [
        { file: "resources/shaders/default.vs.glsl",                name: "default_vs",        result: "" },
        { file: "resources/shaders/default.fs.glsl",                name: "default_fs",        result: "" },
        { file: "resources/shaders/hud.vs.glsl",                    name: "hud_vs",            result: "" },
        { file: "resources/shaders/hud.fs.glsl",                    name: "hud_fs",            result: "" },
        { file: "resources/shaders/skybox.vs.glsl",                 name: "skybox_vs",         result: "" },
        { file: "resources/shaders/skybox.fs.glsl",                 name: "skybox_fs",         result: "" },
        { file: "resources/shaders/solid.vs.glsl",                  name: "solid_vs",          result: "" },
        { file: "resources/shaders/solid.fs.glsl",                  name: "solid_fs",          result: "" },
        { file: "resources/shaders/terrain.vs.glsl",                name: "terrain_vs",        result: "" },
        { file: "resources/shaders/terrain.fs.glsl",                name: "terrain_fs",        result: "" },
        { file: "resources/shaders/water.vs.glsl",                  name: "water_vs",          result: "" },
        { file: "resources/shaders/water.fs.glsl",                  name: "water_fs",          result: "" },
        { file: "resources/models/quad.json",                       name: "quad",              result: "" },
        { file: "resources/models/plane.json",                      name: "plane",             result: "" },
        { file: "resources/models/cube.json",                       name: "cube",              result: "" },
        { file: "resources/models/uv_sphere.json",                  name: "uv_sphere",         result: "" },
        { file: "resources/models/ico_sphere.json",                 name: "ico_sphere",        result: "" },
        { file: "resources/models/cylinder.json",                   name: "cylinder",          result: "" },
        { file: "resources/models/cone.json",                       name: "cone",              result: "" },
        { file: "resources/models/torus.json",                      name: "torus",             result: "" },
        { file: "resources/models/monkey_head.json",                name: "monkey_head",       result: "" }
    ];

    $scope.resourceImages = [
        { file: "resources/textures/white_1x1.png",                 name: "emptyTexture",      result: "" },
        { file: "resources/textures/terrain/backgroundTexture.png", name: "backgroundTexture", result: "" },
        { file: "resources/textures/terrain/rTexture.png",          name: "rTexture",          result: "" },
        { file: "resources/textures/terrain/gTexture.png",          name: "gTexture",          result: "" },
        { file: "resources/textures/terrain/bTexture.png",          name: "bTexture",          result: "" },
        { file: "resources/textures/terrain/blendMap.png",          name: "blendMap",          result: "" },
        { file: "resources/textures/water/duDvMap.png",             name: "duDvMap",           result: "" },
        { file: "resources/textures/water/normalMap.png",           name: "normalMap",         result: "" },
        { file: "resources/textures/skybox/right.png",              name: "skyboxRight",       result: "" },
        { file: "resources/textures/skybox/left.png",               name: "skyboxLeft",        result: "" },
        { file: "resources/textures/skybox/top.png",                name: "skyboxTop",         result: "" },
        { file: "resources/textures/skybox/bottom.png",             name: "skyboxBottom",      result: "" },
        { file: "resources/textures/skybox/back.png",               name: "skyboxBack",        result: "" },
        { file: "resources/textures/skybox/front.png",              name: "skyboxFront",       result: "" }
    ];

    /**
     * @param {object} component 
     */
    $scope.addComponent = function(component)
    {
        let children = component.Children();
        
        switch (component.Name()) {
        case "Camera":
            RenderEngine.Camera = component;
            break;
        case "HUD":
            for (let hud of children)
                RenderEngine.HUDs.push(hud);
            break;
        case "Skybox":
            RenderEngine.Skybox = children[0];
            break;
        case "Terrain":
            for (let terrain of children)
                RenderEngine.Terrains.push(terrain);
            break;
        case "Water":
            for (let water of children)
                RenderEngine.Waters.push(water);
            break;
        default:
            for (let mesh of children)
                RenderEngine.Renderables.push(mesh);
            break;
        }
        
        $scope.components.push(component);
    }

    /**
     */
    $scope.clearScene = function()
    {
        RenderEngine.HUDs        = [];
        RenderEngine.Skybox      = null;
        RenderEngine.Terrains    = [];
        RenderEngine.Waters      = [];
        RenderEngine.Renderables = [];

        // Skip camera
        for (let i = 1; i < $scope.components.length; i++)
            $scope.removeComponent(i);
        
        $scope.selectedComponent = null;
        $scope.selectedChild     = null;

        $scope.components.splice(1);
    }

    /**
     * @param {object} component
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
     */
    $scope.getTextures = function()
    {
        if ($scope.showTest7())
            return $scope.selectedComponent.Textures();
        else if ($scope.showTest2())
            return $scope.selectedChild.Textures();

        return null;
    }

    /**
     * @param {string} name
     */
    $scope.iconClick = function(name)
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
        default:
            let resource = $scope.getResource(name);
            if (resource)
                $scope.loadModel(resource.result);
            break;
        }
    }

    /**
     */
    $scope.isLoadComplete = function()
    {
        for (let resource of $scope.resourcesTexts) {
            if (resource.result === "")
                return false;
        }

        for (let resource of $scope.resourceImages) {
            if (resource.result === "")
                return false;
        }
        
        return true;
    }

    /**
     */
    $scope.isReadOnlyName = function()
    {
        return (!$scope.selected.Parent() || ($scope.selected.Parent().Name() === "Skybox"));
    }

    /**
     */
    $scope.loadHUD = function()
    {
        let hud = new HUD($scope.getResource("quad").result);

        if (!hud || !hud.IsValid())
            return null;

        $scope.addComponent(hud);

        return hud;
    }

    /**
    * @param {object} resource  // { file:"", name:"", result:"" }
    * @param {any}    callback
    */
    $scope.loadImage = function(resource, callback)
    {
        let image = new Image();

        if (!image)
            return -1;

        image.onload = function() {
            callback(null, image, resource);
        };

        image.src = resource.file;
    }

    /**
    * @param {string} modelText
    */
    $scope.loadModel = function(modelText)
    {
        let model = new Model(modelText);

        if (!model || !model.IsValid())
            return null;

        $scope.addComponent(model);

        return model;
    }

    /**
    * Load Model File (JSON)
    * @param {Array<object>} files
    */
    $scope.loadModelFile = function(files)
    {
        if (!files || (files.length < 1) || !files[0])
            return -1;

        let fileReader = new FileReader();

        fileReader.onload = function(event) {
            $scope.loadModel(event.target.result);
        }

        fileReader.readAsText(files[0]);

        return 0;
    }
    
    /**
    * @param {string} error
    * @param {string} result
    * @param {object} resource
    */
    $scope.loadResource = function(error, result, resource)
    {
        if (!error)
        {
            resource.result = result;
            $scope.state    = ("Loading " + resource.file + " ... OK");

            if ($scope.isLoadComplete()) {
                //setTimeout(function() { $scope.startEngine(); }, 10);
                $scope.startEngine();
            }
        } else {
            $scope.state = ("Loading " + resource.file + " ... FAIL");
        }
    }

    /**
     */
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

        let sceneData = JSON.parse(LZString.decompressFromEncodedURIComponent(sceneText));
        //let sceneData = JSON.parse(sceneText);

        // COMPONENTS
        for (let i = 0; i < sceneData.nr_of_components; i++)
        {
            if (!sceneData.components[i])
                continue;

            let component = null;

            // CAMERA
            if (sceneData.components[i].name === "Camera") {
                component = RenderEngine.Camera;
                component.SetPosition(Utils.ToFloatArray3(sceneData.components[i].position));
                component.SetRotation(Utils.ToFloatArray3(sceneData.components[i].rotation));
            // HUD
            } else if (sceneData.components[i].name === "HUD") {
                component = $scope.loadHUD();
            // MODEL
            } else if (sceneData.components[i].name === "Model") {
                component = $scope.loadModel(sceneData.components[i].json);
            // SKYBOX
            } else if (sceneData.components[i].name === "Skybox") {
                component = $scope.loadSkybox();
            // TERRAIN
            } else if (sceneData.components[i].name === "Terrain") {
                component = $scope.loadTerrain(parseFloat(sceneData.components[i].size), parseInt(sceneData.components[i].octaves), parseFloat(sceneData.components[i].redistribution));
            // WATER
            } else if (sceneData.components[i].name === "Water") {
                component = $scope.loadWater();
                component.FBO().SetSpeed(parseFloat(sceneData.components[i].speed));
                component.FBO().SetWaveStrength(parseFloat(sceneData.components[i].wave_strength));
            }
            // MATERIAL
            // LIGHTS

            // CHILDREN
            for (let j = 0; j < sceneData.components[i].nr_of_children; j++)
            {
                if (!component || !sceneData.components[i].children[j])
                    continue;

                let child = component.Child(j);

                if (!child)
                    continue;

                child.SetName(sceneData.components[i].children[j].name);
                child.SetPosition(Utils.ToFloatArray3(sceneData.components[i].children[j].position));
                child.SetScale(Utils.ToFloatArray3(sceneData.components[i].children[j].scale));
                child.SetRotation(Utils.ToFloatArray3(sceneData.components[i].children[j].rotation));
                child.SetAutoRotation(Utils.ToFloatArray3(sceneData.components[i].children[j].auto_rotation));
                child.SetAutoRotate(sceneData.components[i].children[j].auto_rotate);
                child.SetColor(Utils.ToFloatArray4(sceneData.components[i].children[j].color));

                // TEXTURES
                for (let k = 0; k < sceneData.components[i].children[j].nr_of_textures; k++)
                {
                    if (!sceneData.components[i].children[j].textures[k])
                        continue;

                    // TERRAIN, WATER
                    if ((component.Name() === "Terrain") || (component.Name() === "Water"))
                    {
                        let texture = (component.Name() === "Water" ? component.Texture(k) : child.Texture(k));

                        if (!texture)
                            continue;

                        texture.SetScale(Utils.ToFloatArray2(sceneData.components[i].children[j].textures[k].scale));
                    }
                    // SKYBOX
                    else if (component.Name() === "Skybox")
                    {
                        //
                    }
                    // MODEL
                    else
                    {
                        // HUD
                        if ((component.Name() === "HUD") && (k > 0))
                            continue;

                        let image = new Image();
                        image.src = sceneData.components[i].children[j].textures[k].image;

                        setTimeout(function(image, properties, child, index)
                        {
                            let texture = new Texture(
                                image, properties.file, false,
                                properties.repeat, properties.flip,
                                Utils.ToFloatArray2(properties.scale)
                            );

                            child.LoadTexture(texture, index);
                        }, 10, image, sceneData.components[i].children[j].textures[k], child, k);
                    }
                }
            }
        }
    }

    /**
    * Load Scene File (scene)
    * @param {object} element
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
     */
    $scope.loadSkybox = function()
    {
        let images = [];

        images.push($scope.getResource("skyboxRight").result);
        images.push($scope.getResource("skyboxLeft").result);
        images.push($scope.getResource("skyboxTop").result);
        images.push($scope.getResource("skyboxBottom").result);
        images.push($scope.getResource("skyboxBack").result);
        images.push($scope.getResource("skyboxFront").result);

        let skybox = new Skybox($scope.getResource("cube").result, images);

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
    * @param {number} size
    * @param {number} octaves
    * @param {number} redistribution
    */
    // @param {number} amplitude
    //static AddTerrain(size, amplitude, octaves, redistribution)
    $scope.loadTerrain = function(size, octaves, redistribution)
    {
        let images = [];

        images.push($scope.getResource("backgroundTexture").result);
        images.push($scope.getResource("rTexture").result);
        images.push($scope.getResource("gTexture").result);
        images.push($scope.getResource("bTexture").result);
        images.push($scope.getResource("blendMap").result);

        //let terrain = new Terrain(size, amplitude, octaves, redistribution);
        let terrain = new Terrain(images, size, octaves, redistribution);

        if (!terrain || !terrain.IsValid())
            return null;

        $scope.addComponent(terrain);

        return terrain;
    }
    
    /**
    * @param {object}  resource  // { file:"", name:"", result:"" }
    * @param {any}     callback
    */
    $scope.loadText = function(resource, callback)
    {
        $http.get(resource.file)
        .then(function(response) {
            callback(null, response.data, resource);
        }, function(response) {
            callback("ERROR: HTTP Status: " + response.status, "", resource);
        });
    }

    /**
    * @param {object} image
    * @param {string} filename
    * @param {number} textureIndex
    */
    $scope.loadTexture = function(image, filename, textureIndex)
    {
        if ($scope.selectedChild)
            $scope.selectedChild.LoadTextureImage(image, filename, textureIndex);
    }

    /**
    * Load Texture File (image)
    * @param {object} element
    * @param {number} index
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

            setTimeout(function(img, el, idx) {
                $scope.loadTexture(img, el.files[0].name, idx);
                el.value = "";
            }, 10, image, element, index);
        }

        fileReader.readAsDataURL(element.files[0]);

        return 0;
    }

    /**
     */
    $scope.loadWater = function()
    {
        let images = [];

        images.push($scope.getResource("duDvMap").result);
        images.push($scope.getResource("normalMap").result);

        let water = new Water($scope.getResource("plane").result, images);

        if (!water || !water.IsValid())
            return null;

        $scope.addComponent(water);

        return water;
    }

    /**
    * @param {number} index
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
     */
    $scope.removeSelectedComponent = function()
    {
        let index = $scope.components.indexOf($scope.selectedComponent);

        if (index >= 0)
        {
            let children = $scope.selectedComponent.Children();

            for (let mesh of children)
                RenderEngine.RemoveMesh(mesh);

            $scope.removeComponent(index);
            $scope.components.splice(index, 1);

            $scope.selectedComponent = null;
            $scope.selectedChild     = null;
        }
    }

    /**
     */
    $scope.removeSelectedChild = function()
    {
        RenderEngine.RemoveMesh($scope.selectedChild);

        if ($scope.selectedComponent.RemoveChild($scope.selectedChild) === 0)
        {
            if ($scope.selectedComponent.Children().length === 0)
                $scope.removeSelectedComponent();

            $scope.selectedChild = null;
        }
    }

    /**
     */
    $scope.saveScene = function()
    {
        //console.log("saveScene: START");

        let sceneData        = { "nr_of_components": $scope.components.length };
        sceneData.components = {};

        for (let i = 0; i < $scope.components.length; i++)
        {
            let component = $scope.components[i];

            if (!component)
                continue;

            let children = component.Children();
            
            switch (component.Name()) {
            case "Camera":
                sceneData.components[i] = {
                    "name":           component.Name(),
                    "position":       component.Position(),
                    "rotation":       component.Rotation(),
                    "nr_of_children": 0
                };
                break;
            case "HUD":
                sceneData.components[i] = {
                    "name":           component.Name(),
                    "nr_of_children": children.length
                }
                break;
            case "Skybox":
                sceneData.components[i] = {
                    "name":           component.Name(),
                    "nr_of_children": children.length
                }
                break;
            case "Terrain":
                sceneData.components[i] = {
                    "name":           component.Name(),
                    "size":           component.Size(),
                    "octaves":        component.Octaves(),
                    "redistribution": component.Redistribution(),
                    "nr_of_children": children.length
                };
                break;
            case "Water":
                sceneData.components[i] = {
                    "name":          component.Name(),
                    "speed":         component.FBO().Speed(),
                    "wave_strength": component.FBO().WaveStrength(),
                    "nr_of_children": children.length
                };
                break;
            case "Model":
                sceneData.components[i] = {
                    "name":           component.Name(),
                    "json":           component.JSON(),
                    "nr_of_children": children.length
                };
                break;
            // MATERIAL
            // LIGHTS
            default:
                break;
            }

            if (component.Name() === "Camera")
                continue;

            sceneData.components[i].children = {};

            // CHILDREN
            for (let j = 0; j < children.length; j++)
            {
                sceneData.components[i].children[j] = {
                    "name":            children[j].Name(),
                    "position":        children[j].Position(),
                    "scale":           children[j].Scale(),
                    "rotation":        children[j].Rotation(),
                    "auto_rotation":   children[j].AutoRotation(),
                    "auto_rotate":     children[j].AutoRotate(),
                    "color":           children[j].Color(),
                    "nr_of_textures":  Utils.MAX_TEXTURES
                };
                
                sceneData.components[i].children[j].textures = {};

                for (let k = 0; k < Utils.MAX_TEXTURES; k++)
                {
                    let texture = (component.Name() === "Water" ? component.Texture(k) : children[j].Texture(k));

                    sceneData.components[i].children[j].textures[k] = {
                        "file":   texture.File(),
                        "image":  texture.ImageSource(),
                        "repeat": texture.Repeat(),
                        "flip":   texture.FlipY(),
                        "scale":  texture.Scale()
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
    * @param {object} component
    */
    $scope.selectComponent = function(component)
    {
        if (component)
        {
            $scope.selectedComponent = component;
            
            let children = component.Children();

            if (children.length > 0)
                $scope.selectChild(children[0]);
            else
                $scope.selectedChild = null;

            //$scope.volume = "";
        }
    }

    /**
    * @param {object} child
    */
    $scope.selectChild = function(child)
    {
        if (child)
            $scope.selectedChild = child;
    }

    /**
    * @param {string} state
    */
    $scope.setState = function(state)
    {
        $scope.state = state;
    }

    /**
     */
    $scope.showTest1 = function()
    {
        return (($scope.selectedChild != null) && ($scope.selectedChild !== undefined));
    }

    /**
     */
    $scope.showTest2 = function()
    {
        return ($scope.selectedComponent && ($scope.selectedComponent.Name() != "Camera"));
    }

    /**
     */
    $scope.showTest3 = function()
    {
        return ($scope.selectedComponent && ($scope.selectedComponent.Name() != "Skybox"));
    }

    /**
     */
    $scope.showTest4 = function()
    {
        return (
            $scope.selectedComponent && 
            ($scope.selectedComponent.Name() != "Camera") && 
            ($scope.selectedComponent.Name() != "Skybox")
        );
    }

    /**
     */
    $scope.showTest5 = function()
    {
        return (
            $scope.selectedComponent && 
            ($scope.selectedComponent.Name() != "Skybox")  && 
            ($scope.selectedComponent.Name() != "Terrain") && 
            ($scope.selectedComponent.Name() != "Water")
        );
    }

    /**
     */
    $scope.showTest6 = function()
    {
        return ($scope.selectedComponent && ($scope.selectedComponent.Name() === "Terrain"));
    }

    /**
     */
    $scope.showTest7 = function()
    {
        return ($scope.selectedComponent && ($scope.selectedComponent.Name() === "Water"));
    }

    /**
     */
    $scope.showTest8 = function()
    {
        return ($scope.selectedComponent && ($scope.selectedComponent.Name() === "HUD"));
    }

    /**
     */
    $scope.showTest9 = function()
    {
        return (
            $scope.selectedComponent && 
            ($scope.selectedComponent.Name() != "Camera")  && 
            ($scope.selectedComponent.Name() != "HUD")     && 
            ($scope.selectedComponent.Name() != "Skybox")  && 
            ($scope.selectedComponent.Name() != "Terrain") && 
            ($scope.selectedComponent.Name() != "Water")
        );

        //return (RenderEngine.Renderables.indexOf($scope.selectedComponent) >= 0);
    }

    /**
     * INIT ENGINE
     */
    $scope.startEngine = function()
    {
        let result = -1;

        $scope.setState("Starting the WebGL 3D Engine ...");

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
            return -1;
        }

        $scope.setState("Checking the browser support ... OK");

        // RENDER ENGINE
        $scope.setState("Initializing the Render Engine ...");

        result = RenderEngine.Init();

        if (result != 0)
        {
            alert("ERROR: Failed to initialize the Render Engine.");
            $scope.setState("Initializing the Render Engine ... FAIL");
            $scope.$apply();
            return -1;
        }

        $scope.setState("Initializing the Render Engine ... OK");

        $scope.GPU = RenderEngine.GPU();

        // SHADER MANAGER
        $scope.setState("Initializing the Shader Manager ...");

        result = ShaderManager.Init($scope);

        if (result != 0)
        {
            alert("ERROR: Failed to initialize the Shader Manager.");
            $scope.setState("Initializing the Shader Manager ... FAIL");
            $scope.$apply();
            return -1;
        }

        $scope.setState("Initializing the Shader Manager ... OK");

        // CAMERA
        $scope.setState("Creating the Camera ...");

        let camera = new Camera(
            vec3.fromValues(0, 2.5, 10),
            vec3.fromValues(0, 0, 0),
            (Math.PI / 4.0), 0.1, 100.0
        );

        if (!camera)
        {
            alert("ERROR: Failed to create the camera.");
            $scope.setState("Creating the Camera ... FAIL");
            $scope.$apply();
            return -1;
        }

        $scope.setState("Creating the Camera ... OK");

        $scope.addComponent(camera);

        // INPUT MANAGER
        $scope.setState("Initializing the Input Manager ...");

        result = InputManager.Init();

        if (result != 0)
        {
            alert("ERROR: Failed to initialize the input manager.");
            $scope.setState("Initializing the Input Manager ... FAIL");
            $scope.$apply();
            return -1;
        }

        $scope.setState("Initializing the Input Manager ... OK");

        Utils.EmptyTexture = new Texture($scope.getResource("emptyTexture").result, "");

        let images = [];

        for (let i = 0; i < Utils.MAX_TEXTURES; i++)
            images.push($scope.getResource("emptyTexture").result);

        Utils.EmptyCubemap = new Texture(images, "", true);
        
        Utils.CubeJSON   = Utils.LoadJSON($scope.getResource("cube").result).meshes[0];
        //Utils.SphereJSON = Utils.LoadJSON($scope.getResource("uv_sphere").result).meshes[0];
        Utils.SphereJSON = Utils.LoadJSON($scope.getResource("ico_sphere").result).meshes[0];

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
