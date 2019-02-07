 
 OBJLoader2Example.prototype.loadModel = function(i, j) {

        var modelName = this.models.name[i];

        var parameters = {
            uniforms: this.uniforms,
            vertexShader: document.getElementById('vertexShader').textContent,
            fragmentShader: document.getElementById(this.shaders[j]).textContent,
            lights: false
        }

        var scope = this;
        var objLoader = new THREE.OBJLoader2();

        objLoader.setModelName(modelName);
        var callbackOnLoad = function(event) {

            console.log("callbackOnLoad");
            console.log(event);

            event.detail.loaderRootNode.traverse(function(child) {
                if (child.isMesh) {
                    bufferGeo = child.geometry;
                    materials = new THREE.ShaderMaterial(parameters);
                    bMaterials = new THREE.MeshLambertMaterial({
                        color: 0xffffff,
                        opacity: 0.25,
                        transparent: true
                    });
                    materials.needsUpdate = true;
                    bMaterials.needsUpdate = true;
                    sMesh = new THREE.Mesh(bufferGeo, materials);
                    bMesh = new THREE.Mesh(bufferGeo, bMaterials);
                    scope.scene.add(sMesh);
                    scope.shaderMesh.push(sMesh);
                    //bMesh = child;
                    scope.scene.add(bMesh);
                    scope.basicMesh.push(bMesh);
                    scope.meshByShader[j].push(sMesh);
                    sMesh.visible = false;
                    bMesh.visible = true;

                }
            });

            // scope.scene.add(event.detail.loaderRootNode);
            scope._reportProgress({ detail: { text: '' } });
        };

        objLoader.setLogging(true, true);
        objLoader.load(this.models.load[i], callbackOnLoad, null, null, null, false);

    }

    OBJLoader2Example.prototype.turnonShader = function() {

        for (var i = 0; i < this.shaderMesh.length; i++) {
            this.shaderMesh[i].visible = false;
        }
        for (var i = 0; i < this.basicMesh.length; i++) {
            this.basicMesh[i].visible = false;
        }
        var yushu = this.mouseCountInside % this.shaders.length;
        for (var j = 0; j < this.shaders.length; j++) {
            if (yushu == j) {
                for (var i = 0; i < this.models.name.length; i++) {
                    this.meshByShader[j][i].visible = true;
                }
            }
        }

    };


    OBJLoader2Example.prototype.noLightup = function() {
        var modelName = 'cubes';


        var imgTexture = new THREE.TextureLoader().load('shared/models/materials/white.jpg');
        var thicknessTexture = new THREE.TextureLoader().load('shared/models/materials/glass1.jpg');
        imgTexture.wrapS = imgTexture.wrapT = THREE.RepeatWrapping;


        var transShader = new THREE.TranslucentShader();
        var transUniforms = THREE.UniformsUtils.clone(transShader.uniforms);

        transUniforms['map'].value = imgTexture;
        transUniforms['diffuse'].value = new THREE.Vector3(0.912, 0.903, 0.903);

        transUniforms['shininess'].value = 500;
        transUniforms['thicknessMap'].value = thicknessTexture;
        transUniforms['thicknessColor'].value = new THREE.Vector3(1.000, 0.981, 0.950);
        transUniforms['thicknessDistortion'].value = 0.35;
        transUniforms['thicknessAmbient'].value = 0.5;
        transUniforms['thicknessAttenuation'].value = 1.0;
        transUniforms['thicknessPower'].value = 7.5;
        transUniforms['thicknessScale'].value = 20.0;


        var scope = this;
        var objLoader = new THREE.OBJLoader2();

        objLoader.setModelName(modelName);
        var callbackOnLoad = function(event) {

            event.detail.loaderRootNode.traverse(function(child) {
                if (child.isMesh) {
                    bufferGeo = child.geometry;
                    oMaterials = new THREE.ShaderMaterial({
                        uniforms: transUniforms,
                        vertexShader: transShader.vertexShader,
                        fragmentShader: transShader.fragmentShader,
                        lights: true
                    });
                    oMaterials.extensions.derivatives = true;
                    oMaterials.needsUpdate = true;
                    oMesh = new THREE.Mesh(bufferGeo, oMaterials);
                    scope.scene.add(oMesh);
                    scope.otherMesh.push(oMesh);
                    oMesh.visible = true;

                }
            });
            scope.scene.add(event.detail.loaderRootNode);
            scope._reportProgress({ detail: { text: '' } });
        };


        objLoader.setLogging(true, true);
        objLoader.load('shared/models/noLightup.obj', callbackOnLoad, null, null, null, false);

        objLoader.load('shared/models/bottom.obj', callbackOnLoad, null, null, null, false);
    };

    OBJLoader2Example.prototype.Bottom = function() {
        var modelName = 'cubes';
        this.uniforms = {
            time: { value: 1.0 }
        };

        var scope = this;
        var objLoader = new THREE.OBJLoader2();

        objLoader.setModelName(modelName);
        var callbackOnLoad = function(event) {
            event.detail.loaderRootNode.traverse(function(child) {
                if (child.isMesh) {
                    bufferGeo = child.geometry;
                    oMaterials = new THREE.MeshBasicMaterial({
                        color: 0xffffff,
                        wireframe: false
                    });
                    oMaterials.needsUpdate = true;
                    oMesh = new THREE.Mesh(bufferGeo, oMaterials);
                    scope.scene.add(oMesh);
                    scope.otherMesh.push(oMesh);
                    oMesh.visible = true;
                    oMesh.position.y = -30;

                }
            });
            scope.scene.add(event.detail.loaderRootNode);
            scope._reportProgress({ detail: { text: '' } });
        };


        objLoader.setLogging(true, true);
        objLoader.load('shared/models/bottom.obj', callbackOnLoad, null, null, null, false);

    };


var app = new OBJLoader2Example(document.getElementById('example'));

app.initGL();
app.resizeDisplayGL();
app.noLightup();
app.Bottom();

for (var i = 0; i < app.models.name.length; i++) {
    for (var j = 0; j < app.shaders.length; j++) {
        app.loadModel(i, j);
    }

}

