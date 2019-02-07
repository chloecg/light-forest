var OBJLoader2Example = (function() {


    var Validator = THREE.LoaderSupport.Validator;
    //set up basic camera position
    function OBJLoader2Example(elementToBindTo) {
        this.renderer = null;
        this.canvas = elementToBindTo;
        this.aspectRatio = 1;
        this.recalcAspectRatio();

        this.scene = null;
        this.cameraDefaults = {
            posCamera: new THREE.Vector3(0.0, 0.0, 200.0),
            posCameraTarget: new THREE.Vector3(0, 0, 0),
            near: 0.1,
            far: 10000,
            fov: 50

        };
        this.camera = null;
        this.camPositions = [{ x: 500, y: 1800, z: 500 }, { x: 100, y: 2200, z: 600 }, { x: 100, y: 1290, z: 2500 }, { x: -900, y: 400, z: 900 }];
        this.cameraTarget = this.cameraDefaults.posCameraTarget;
        this.mouseCountInside = 0;
        this.mouseCountOutside = 0;
        this.pointLight;
        this.Aspect;
        this.uniforms = null;
        this.basicMesh = [];
        this.shaderMesh = [];
        this.otherMesh = [];
        this.meshByShader = [
            [],
            [],
            [],
            [],
            [],
            []
        ];
        this.controls = null;
        this.isMouseDown = false;
        this.mouseClick = null;

        this.models = {

            name: ["c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "c10", "c11", "c12", "c13", "c14", "c15"],

            load: ["shared/models/Lightup/1.obj", "shared/models/Lightup/2.obj", "shared/models/Lightup/3.obj",
                "shared/models/Lightup/4.obj", "shared/models/Lightup/5.obj", "shared/models/Lightup/6.obj",
                "shared/models/Lightup/7.obj", "shared/models/Lightup/8.obj", "shared/models/Lightup/9.obj",
                "shared/models/Lightup/10.obj", "shared/models/Lightup/11.obj", "shared/models/Lightup/12.obj",
                "shared/models/Lightup/13.obj", "shared/models/Lightup/14.obj", "shared/models/Lightup/15.obj"
            ]

        };

        this.shaders = ["fragment_shader1", "fragment_shader2", "fragment_shader3", "fragment_shader4", "fragment_shader5", "fragment_shader6"];


    }
    //set up environment 
    OBJLoader2Example.prototype.initGL = function() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            autoClear: true
        });
        this.renderer.setClearColor(0x000000);
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(this.scene.background, 3000, 10000);
        this.camera = new THREE.PerspectiveCamera(this.cameraDefaults.fov, this.aspectRatio, this.cameraDefaults.near, this.cameraDefaults.far);
        this.resetCamera();
        this.controls = new THREE.TrackballControls(this.camera, this.renderer.domElement);

        var ambientLight = new THREE.AmbientLight(0xcccccc, 0.2);
        var directionalLight1 = new THREE.DirectionalLight(0xF4CCCC);
        var directionalLight2 = new THREE.DirectionalLight(0xD9D2E9);
        directionalLight1.position.set(-100, -50, 100);
        directionalLight2.position.set(100, 50, -100);
        this.pointLight = new THREE.PointLight(0xFCE5CD, 0.5, 500);
        this.clock = new THREE.Clock();
        // this.cubeShadow = new THREE.ShadowMesh();
        this.scene.add(directionalLight1);
        this.scene.add(directionalLight2);
        this.scene.add(ambientLight);
        this.scene.add(this.pointLight);
        //this.scene.add(this.cubeShadow);


        var geometry = new THREE.PlaneBufferGeometry(10000, 10000);
        var material1 = new THREE.MeshLambertMaterial({ color: 0xcccccc, opacity: 0.45, transparent: true, side: THREE.DoubleSide });


        var Floor = new THREE.Mesh(geometry, material1);
        Floor.position.y = 3.5;
        Floor.rotation.x = Math.PI / 2;
        this.scene.add(Floor);


        //mirror
        var geometry = new THREE.CircleBufferGeometry(2000, 2000);
        var groundMirror = new THREE.Reflector(geometry, {
            clipBias: 0.003,
            textureWidth: this.canvas.offsetWidth * window.devicePixelRatio,
            textureHeight: this.canvas.offsetHeight * window.devicePixelRatio,
            color: 0x777777,
            recursion: 1
        });
        groundMirror.position.y = -4.5;
        groundMirror.position.z = -1000;
        groundMirror.rotateX(-Math.PI / 2);
        this.scene.add(groundMirror);
        var geometry = new THREE.PlaneBufferGeometry(5000, 5000);
        var verticalMirror = new THREE.Reflector(geometry, {
            clipBias: 0.003,
            textureWidth: this.canvas.offsetWidth * window.devicePixelRatio,
            textureHeight: this.canvas.offsetHeight * window.devicePixelRatio,
            color: 0x777777,
            recursion: 0.1
        });
        verticalMirror.position.y = 1500;
        verticalMirror.position.z = -1500;
        //verticalMirror.rotateX(-Math.PI / 2);
        //this.scene.add(verticalMirror);

        //walls
        //var planeGeo = new THREE.PlaneBufferGeometry(5000, 1500);

        // var planeTop = new THREE.Mesh(planeGeo, new THREE.MeshPhongMaterial({ color: 0xeeeeee }));
        // planeTop.position.y = 1500;
        // planeTop.rotateX(Math.PI / 2);
        // this.scene.add(planeTop);

        // var planeFront = new THREE.Mesh(planeGeo, new THREE.MeshPhongMaterial({ color: 0x000000, opacity: 0.20, transparent: true, side: THREE.DoubleSide }));
        // planeFront.position.z = -1480;
        // planeFront.position.y = 760;
        // planeFront.rotateY(Math.PI);
        // this.scene.add(planeFront);
        // var planeBack = new THREE.Mesh(planeGeo, new THREE.MeshPhongMaterial({ color: 0x000000 }));
        // planeBack.position.z = 1600;
        // planeBack.position.y = 50;
        // planeBack.rotateY(Math.PI);
        // this.scene.add(planeBack);
        // var planeRight = new THREE.Mesh(planeGeo, new THREE.MeshPhongMaterial({ color: 0x000000 }));
        // planeRight.position.x = 1500;
        // planeRight.position.y = 50;
        // planeRight.rotateY(-Math.PI / 2);
        // this.scene.add(planeRight);
        // var planeLeft = new THREE.Mesh(planeGeo, new THREE.MeshPhongMaterial({ color: 0x000000 }));
        // planeLeft.position.x = -1500;
        // planeLeft.position.y = 50;
        // planeLeft.rotateY(Math.PI / 2);
        // this.scene.add(planeLeft);


    };



    //
    OBJLoader2Example.prototype._reportProgress = function(event) {
        var output = Validator.verifyInput(event.detail.text, '');
        console.log('Progress: ' + output);
        document.getElementById('feedback').innerHTML = output;
    };

    OBJLoader2Example.prototype.resizeDisplayGL = function() {
        this.controls.handleResize();

        this.recalcAspectRatio();
        this.renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight, false);

        this.updateCamera();
    };

    OBJLoader2Example.prototype.recalcAspectRatio = function() {
        this.aspectRatio = (this.canvas.offsetHeight === 0) ? 1 : this.canvas.offsetWidth / this.canvas.offsetHeight;
    };

    OBJLoader2Example.prototype.resetCamera = function() {
        this.camera.position.copy(this.cameraDefaults.posCamera);
        this.cameraTarget.copy(this.cameraDefaults.posCameraTarget);

        this.updateCamera();
    };

    OBJLoader2Example.prototype.updateCamera = function() {
        this.camera.aspect = this.aspectRatio;
        this.camera.lookAt(this.cameraTarget);
        this.camera.updateProjectionMatrix();
    };

    OBJLoader2Example.prototype.cameraMovements = function() {
        var timer = Date.now() * 0.0002;
        this.camera.position.x = Math.cos(timer) * 2500;
        this.camera.position.z = Math.sin(timer) * 2500;
        this.camera.position.y = 50;

    };

    OBJLoader2Example.prototype.switchPositions = function() {
        var pNumber = this.mouseCountOutside % this.camPositions.length;
        for (var i = 0; i < this.camPositions.length; i++) {
            if (pNumber == i)
                this.camera.position = this.camera.position.lerp(new THREE.Vector3(this.camPositions[i].x, this.camPositions[i].y, this.camPositions[i].z), 0.025);
        }

    };

    OBJLoader2Example.prototype.backToDefault = function() {

        this.isMouseDown = false;
        console.log("Clicked");


    };

    OBJLoader2Example.prototype.render = function(timestamp) {
        if (!this.renderer.autoClear) this.renderer.clear();
        this.controls.update();
        this.uniforms.time.value = timestamp / 1000;
        this.camera.lookAt(this.scene.position);
        this.renderer.render(this.scene, this.camera);

        // var r = this.clock.getElapsedTime();
        // this.pointLight.position.x = 1000 * Math.cos(r);
        // this.pointLight.position.z = 1000 * Math.sin(r);

        if (!this.isMouseDown) {
            app.cameraMovements();

        } else {
            app.switchPositions();

        }

    };
    return OBJLoader2Example;


})();


var resizeWindow = function() {
    app.resizeDisplayGL();
};
window.addEventListener('resize', resizeWindow, false);


var render = function(timestamp) {
    requestAnimationFrame(render);
    app.render(timestamp);
};

var onDocumentTouchStart = function(event) {

    event.preventDefault();
    event.clientX = event.touches[0].clientX;
    event.clientY = event.touches[0].clientY;
    onDocumentMouseDown(event);

};


var onDocumentMouseDown = function(event) {
    app.isMouseDown = true;
    var mouse = new THREE.Vector2();
    var raycaster = new THREE.Raycaster();
    mouse.x = (event.clientX / app.renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / app.renderer.domElement.clientHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, app.camera);
    var intersects = raycaster.intersectObjects(app.basicMesh.concat(app.shaderMesh));

    if (intersects.length > 0) {
        app.mouseCountInside += 1;
        app.turnonShader();
        console.log(app.mouseCountInside);

    } else {
        app.mouseCountOutside += 1;
        console.log(app.mouseCountOutside);
        app.switchPositions();
        clearTimeout(app.mouseClick);
        app.mouseClick = setTimeout(function() { app.backToDefault() }, 100000);

    }

    event.preventDefault();
    // console.log("MOUSECLICKED!!!");

};

var app = new OBJLoader2Example(document.getElementById('example'));

app.initGL();


app.renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);
app.renderer.domElement.addEventListener('touchstart', onDocumentTouchStart, false);

render();