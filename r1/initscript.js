var init = function init(){
    console.log("init start");
    

	requestFile( '../bvh-truebones/TPOSE.bvh' );
	
	Bvh.info.innerHTML = '<h1>Jaanga BVH Reader - Truebones files</h1>' +
		'<select id=selBvh onchange=requestFile("../bvh-truebones/"+Bvh.files[this.selectedIndex]) ></select> ' +
		'<input type=file onchange=readText(this) /> <input type="checkbox" id="play" checked>Play - ' +
		'<button type=button onclick=Bvh.play.checked=false;Bvh.animate(0); >First frame</button>';

	Bvh.files = ['1754.bvh', '6448.bvh', '3854.bvh', '7106.bvh', '15a.bvh'];
	for (var len = Bvh.files.length, option, i = 0; i < len; i++) {
	    option = document.createElement('option');
	    option.innerText = Bvh.files[i];
	    selBvh.appendChild(option);

	}
	Bvh.play = document.getElementById('play');
	selBvh.selectedIndex = 3;

	Bvh.root = "";
	Bvh.root.material = "";

    Bvh.parseNode = function( data) {
		var name, done, geometry, i, material, n, node, t;
		name = data.shift();
		var lname = name.toLowerCase();
		var rightMat = threeD.phongMaterial(0, 255, 0);
		var leftMat = threeD.phongMaterial(255, 0, 0);
		var otherMat = threeD.phongMaterial(0, 0, 255);
		var nodemesh = function(mat, sx, sy, sz) {
		    var ageometry = new THREE.SphereGeometry(3,4,4);//new THREE.CubeGeometry(sx || 3, sy || 3, sz || 3);
		    //ageometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		    var amaterial = mat; //otherMat;//threeD.normalMaterial(); //new THREE.MeshNormalMaterial();
		    return new THREE.Mesh(ageometry, amaterial);

		};
		if (lname === 'site') {
		    geometry = new THREE.SphereGeometry(3,4,4);
		    material = otherMat; //threeD.refMaterial();

		    node = new THREE.Mesh(geometry, material);

		}
		else if (lname === 'head') {
		    /*
			geometry = new THREE.CubeGeometry( 12, 20, 15 );
			geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 8, 0 ) );
			material = new THREE.MeshNormalMaterial();
			node = new THREE.Mesh(geometry, material);
			*/
		    geometry = new THREE.CubeGeometry(5, 5, 5);
		    geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		    material = new THREE.MeshPhongMaterial({
		        ambient: 0x000000,
		        color: 0x5500ff,
		        specular: 0x555555,
		        shininess: 30,
		        side: THREE.DoubleSide
		    }); //new THREE.MeshPhongMaterial( { ambient: 0x000000, color: 0x5500ff, specular: 0x555555, shininess: 30 } );//new THREE.MeshNormalMaterial();

		    node = new THREE.Mesh(geometry, material);
		}
		else if (lname === 'hip') {
		    geometry = new THREE.CubeGeometry(5, 5, 5);
		    geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, 0));
		    material = otherMat; //threeD.normalMaterial(); //new THREE.MeshNormalMaterial();
		    node = new THREE.Mesh(geometry, material);

		}
		else if (lname === 'neck') {

		    node = nodemesh(otherMat);
		}
		else if (lname === 'lcollar') {

		    node = nodemesh(leftMat);
		}
		else if (lname === 'rcollar') {

		    node = nodemesh(rightMat);
		}
		else if (lname === 'lshldr') {

		    node = nodemesh(leftMat);

		}
		else if (lname === 'rshldr') {

		    node = nodemesh(rightMat);
		}

		else if (lname === 'lforearm') {

		    node = nodemesh(leftMat);
		}
		else if (lname === 'rforearm') {

		    node = nodemesh(rightMat);

		}
		else if (lname === 'lhand') {

		    node = nodemesh(leftMat);
		}
		else if (lname === 'rhand') {

		    node = nodemesh(rightMat);
		}
		else if (lname === 'chest' || name === 'Chest2' || name === 'Chest3' || name === 'Chest4') {

		    node = nodemesh(otherMat);
		}
		else if (lname === 'abdomen') {

		    node = nodemesh(otherMat);
		}
		else if (lname === 'lthigh') {

		    node = nodemesh(leftMat);
		}
		else if (lname === 'rthigh') {

		    node = nodemesh(rightMat);
		}
		else if (lname === 'lshin') {

		    node = nodemesh(leftMat);
		}
		else if (lname === 'rshin') {

		    node = nodemesh(rightMat);
		}
		else if (lname === 'lfoot') {

		    node = nodemesh(leftMat);
		}
		else if (lname === 'rfoot') {

		    node = nodemesh(rightMat);
		}
		else {

		    node = nodemesh(otherMat);
		}

		
		
		node.castShadow = true;
		node.receiveShadow = false;

		node.name = name; // data.shift();
		console.log( node.name );		
		node.rotation.order = 'XYZ';
		/*
		var axes = new THREE.AxisHelper(50);
		axes.position = node.position;
		threeD.scene.add(axes);
		*/
		done = false;
		while ( !done ) {
			switch (t = data.shift()) {
				case 'OFFSET':
					node.position.set( parseFloat(data.shift()), parseFloat(data.shift()), parseFloat(data.shift()) );
					node.offset = node.position.clone();
					break;
				case 'CHANNELS':
					n = parseInt(data.shift());
					for (i = 0; 0 <= n ? i < n : i > n; 0 <= n ? i++ : i--) {
					    this.channels.push({
					        node: node,
					        prop: data.shift()
					    });
					}
					break;
				case 'JOINT':
				case 'End':
					node.add( this.parseNode(data) );
					break;
				case '}':
					done = true;
			}
		}
		return node;
		//Bvh.root = node;
		//Bvh.root.material = new THREE.MeshBasicMaterial({ color: 0xff0000});
		//threeD.scene.add(Bvh.root);
    };	

    }();