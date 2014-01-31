var threed = function threeD() {
    var that = this;
    this.renderer = new THREE.WebGLRenderer({
        antialias: false
    });
    this.renderer.setSize(0.5 * window.innerWidth, window.innerHeight - 150);
    document.body.appendChild(this.renderer.domElement);
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(40, (0.45 * window.innerWidth) / (window.innerHeight - 150), 1, 5000);
    this.camera.position.set(500, 500, 500);
    this.controls = new THREE.TrackballControls(this.camera, this.renderer.domElement);

    this.ambient = new THREE.AmbientLight(0x101010);
    this.scene.add(this.ambient);

    this.directionalLight = new THREE.DirectionalLight(0xffffff);
    this.directionalLight.position.set(1, 20, 2).normalize();
    this.scene.add(this.directionalLight);


    this.light = new THREE.SpotLight(0xffffff, 1, 0, Math.PI, 1);
    this.light.target.position.set(0, 0, 0);
    this.light.position.set(0, 200, 0);
    this.light.castShadow = true;
    this.light.shadowCameraNear = 10;
    this.light.shadowCameraFar = 3000;
    this.light.shadowCameraFov = 50;
    this.light.shadowBias = 0.0001;
    this.light.shadowDarkness = 0.5;
    this.light.shadowMapWidth = 1024;
    this.light.shadowMapHeight = 1024;
    this.scene.add(this.light);

/*
	var materialArray = [];
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/skybox/dawnmountain-xpos.png' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/skybox/dawnmountain-xneg.png' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/skybox/dawnmountain-ypos.png' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/skybox/dawnmountain-yneg.png' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/skybox/dawnmountain-zpos.png' ) }));
	materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/skybox/dawnmountain-zneg.png' ) }));
	for (var i = 0; i < 6; i++)
	   materialArray[i].side = THREE.BackSide;
	var skyboxMaterial = new THREE.MeshFaceMaterial( materialArray );
	var skyboxGeom = new THREE.CubeGeometry( 5000, 5000, 5000, 1, 1, 1 );
	var skybox = new THREE.Mesh( skyboxGeom, skyboxMaterial );
	this.scene.add( skybox );
*/

    this.reflectionCube = THREE.ImageUtils.loadTexture("refmap.jpg");
    //this.reflectionCube.format = THREE.RGBFormat;
    //this.reflectionCube.wrapS = this.reflectionCube.wrapT = THREE.RepeatWrapping;

    this.refMaterial = function() {
//return new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: that.reflectionCube } );
//return new THREE.MeshLambertMaterial( { color: 0xffffff, envMap: that.reflectionCube } );

        return new THREE.MeshPhongMaterial({
            ambient: 0x000000,
            color: 0xffffff,
            specular: 0x555555,
            shininess: 30,
            side: THREE.DoubleSide,
            
        });

    };
    this.sphere = new THREE.SphereGeometry(100, 16, 8);
    this.lightMesh = new THREE.Mesh(this.sphere, new THREE.MeshBasicMaterial({
        color: 0xffaa00
    }));
    this.lightMesh.scale.set(0.05, 0.05, 0.05);
    this.lightMesh.position = this.light.position;
    this.lightMesh.overdraw = true;
    this.scene.add(this.lightMesh);


    this.stats = new Stats();
    this.stats.domElement.style.cssText = 'position: absolute; right: 0; top: 0px; zIndex: 100; ';
    document.body.appendChild(this.stats.domElement);

    this.geometry = new THREE.AxisHelper(80);
    this.scene.add(this.geometry);

    this.geometry = new THREE.PlaneGeometry(400, 400, 1, 1);
    //this.geometry.rotation.x = - Math.PI / 2;
    // this.geometry.scale.set(100,100,100);
    this.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
    this.material = new THREE.MeshPhongMaterial({
        ambient: 0x000000,
        color: 0x5500ff,
        specular: 0x555555,
        shininess: 30,
        side: THREE.DoubleSide
    });
    /*
    new THREE.MeshBasicMaterial({
        color: Math.random() * 0xffffff,
        side: THREE.DoubleSide
    });
    */

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(0, 0, 0);
    this.mesh.castShadow = false;
    this.mesh.receiveShadow = true;
    this.scene.add(this.mesh);

    this.renderer.shadowMapEnabled = true;
    this.renderer.shadowMapType = THREE.PCFShadowMap;
};
threed.prototype.normalMaterial = function(){
    return new THREE.MeshNormalMaterial();
};
threed.prototype.phongMaterial = function(colr, colg, colb) {
    return new THREE.MeshPhongMaterial({
        color: new THREE.Color("rgb(" + parseFloat(colr) + "," + parseFloat(colg) + "," + parseFloat(colb) + ")")
    });
};
threed.prototype.rotateTwoPoint = function rotateTwoPoint(rotatemesh, pt1, pt2) {
console.log("rotateTwoPoint");
    var axis = new THREE.Vector3();

    var vec = pt1.clone().sub(pt2);

    var up = new THREE.Vector3(0, 1, 0);

    var tangent = vec.normalize();

    axis.crossVectors(up, tangent).normalize();

    var radians = Math.acos(up.dot(tangent));

    rotatemesh.quaternion.setFromAxisAngle(axis, radians);
};

threed.prototype.makeCube = function makeCube(pt1, pt2) {
    var compLine = new THREE.Line3(pt1, pt2);
    var cubeyHeight = compLine.distance();
    var compCent = compLine.center();

    geometry = new THREE.CubeGeometry(5, cubeyHeight, 5);
    //geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
    material = this.phongMaterial(200, 200, 200); //otherMat; //threeD.normalMaterial(); //new THREE.MeshNormalMaterial();
    var meshy = new THREE.Mesh(geometry, material);
    meshy.position.set(compCent.x, compCent.y, compCent.z);
    this.rotateTwoPoint(meshy, compLine.start, compLine.end);
    return meshy;
};
var threeD = new threed();