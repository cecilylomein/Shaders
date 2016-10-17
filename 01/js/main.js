// Global variables
var scene, renderer, camera, controls;
var container;
var camera, scene, renderer;
var cameraCube, sceneCube;
var mesh, lightMesh, geometry;
var directionalLight, pointLight;
var mouseX = 0;
var mouseY = 0;
//var sound_effect;
//var sound_effect2;
var path = "images/bg/";
var format = '.jpg';
//var projector, mouse = new THREE.Vector2(), closestIntersection;
//var raycaster;
var urls = [
	path + 'posx' + format, path + 'negx' + format,
	path + 'posy' + format, path + 'negy' + format,
	path + 'posz' + format, path + 'negz' + format
];
var loader = new THREE.CubeTextureLoader();
var skybox = loader.load(urls);


	if ( ! Detector.webgl ) {
		Detector.addGetWebGLMessage();
		document.getElementById( 'container' ).innerHTML = "";
	}
	var sphere;
	var parameters = {
		width: 2000,
		height: 2000,
		widthSegments: 250,
		heightSegments: 250,
		depth: 1500,
		param: 4,
		filterparam: 1
	};

	var waterNormals;

	init();
	animate();

	function init() {

		container = document.createElement( 'div' );
		document.body.appendChild( container );

		renderer = new THREE.WebGLRenderer();
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
		container.appendChild( renderer.domElement );

		scene = new THREE.Scene();

		camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 0.5, 3000000 );
		camera.position.set( 2000, 750, 2000 );

		controls = new THREE.OrbitControls( camera, renderer.domElement );
		controls.enablePan = false;
		controls.minDistance = 1000.0;
		controls.maxDistance = 5000.0;
		controls.maxPolarAngle = Math.PI * 0.495;
		controls.target.set( 0, 500, 0 );

		scene.add( new THREE.AmbientLight( 0x444444 ) );
		var light = new THREE.DirectionalLight( 0xffffbb, 1 );
		light.position.set( - 1, 1, - 1 );
		scene.add( light );

		waterNormals = new THREE.TextureLoader().load( 'textures/waternormals.jpg' );
		waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

		water = new THREE.Water( renderer, camera, scene, {
			textureWidth: 512,
			textureHeight: 512,
			waterNormals: waterNormals,
			alpha: 	1.0,
			sunDirection: light.position.clone().normalize(),
			sunColor: 0xffffff,
			waterColor: 0x001e0f,
			distortionScale: 50.0,
		} );

		mirrorMesh = new THREE.Mesh(
			new THREE.PlaneBufferGeometry( 2000 * 500, 2000 * 500 ),
			water.material
		);
		mirrorMesh.add( water );
		mirrorMesh.rotation.x = - Math.PI * 0.5;
		scene.add( mirrorMesh );

		// load skybox
		var cubeMap = new THREE.CubeTexture( [] );
		cubeMap.format = THREE.RGBFormat;
		var loader = new THREE.ImageLoader();


		scene.addEventListener('ready', function() {
			//scene.setGravity(new THREE.Vector3(0,0,0));
			sceneCube = new THREE.Scene; // change to Physijs if applicable
			var geometry = new THREE.SphereBufferGeometry( 100, 32, 16 );
			var path = "images/";
			var format = '.jpg';

			// SKYBOX
			skybox.format = THREE.RGBFormat;
			var shader = THREE.ShaderLib[ "cube" ];
			shader.uniforms[ "tCube" ].value = skybox;
			var material = THREE.createMaterial( // change to Physijs
				new THREE.ShaderMaterial( {
					fragmentShader: shader.fragmentShader,
					vertexShader: shader.vertexShader,
					uniforms: shader.uniforms,
					side: THREE.BackSide
				} )
			);
			var mesh = new THREE.Mesh( // change to Physijs.BoxMesh
			  new THREE.BoxGeometry( 100000, 100000, 100000 ), material );
			mesh.__dirtyPosition = true;
			sceneCube.add( mesh );



		});

		var shader = THREE.FresnelShader;
		var uniforms = THREE.UniformsUtils.clone( shader.uniforms );
		uniforms[ "tCube" ].value = skybox;
		var parameters = { fragmentShader: shader.fragmentShader, vertexShader: shader.vertexShader, uniforms: uniforms };
		var material =	new THREE.ShaderMaterial( parameters );

		sphere = new THREE.Mesh(   
			new THREE.SphereGeometry(
    		100, 100, 100), material );
		scene.add( sphere );
	}
	


	function animate() {
		requestAnimationFrame( animate );
		render();
	}

	function render() {
		var time = performance.now() * 0.001;
		sphere.position.y = Math.sin( time ) * 500 + 250;
		sphere.rotation.x = time * 0.5;
		sphere.rotation.z = time * 0.51;
		water.material.uniforms.time.value += 1.0 / 60.0;
		controls.update();
		water.render();
		renderer.render( scene, camera );
	}
/*

window.onload = function () {

	// WEBGL CHECK
	if( Detector.webgl ) {
		renderer = new THREE.WebGLRenderer( { antialias: true } );
	}
	// SUBSTITUTE IF NOT AVAILABLE
	else {
		renderer = new THREE.CanvasRenderer();
	}
	// RENDERER SETTINGS 
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.autoClear = false;

	container = document.createElement( 'container' );
	document.body.appendChild( container );
	container.appendChild( renderer.domElement );

	// INIT RAYCASTER FOR MOUSE INTERACTION
	// projector = new THREE.Projector();
	// raycaster = new THREE.Raycaster();

	// INIT PHYSIJS
	// Physijs.scripts.worker = 'js/physijs_worker.js';
    // Physijs.scripts.ammo = 'js/ammo.js';



	// CREATE SCENE
	scene = new THREE.Scene; // change to Physijs if applicable
	scene.addEventListener('ready', function() {
		scene.setGravity(new THREE.Vector3(0,0,0));
		sceneCube = new THREE.Scene; // change to Physijs if applicable
		var geometry = new THREE.SphereBufferGeometry( 100, 32, 16 );
		var path = "images/";
		var format = '.jpg';

		// SKYBOX
		skybox.format = THREE.RGBFormat;
		var shader = THREE.ShaderLib[ "cube" ];
		shader.uniforms[ "tCube" ].value = skybox;
		var material = THREE.createMaterial( // change to Physijs
			new THREE.ShaderMaterial( {
				fragmentShader: shader.fragmentShader,
				vertexShader: shader.vertexShader,
				uniforms: shader.uniforms,
				side: THREE.BackSide
			} )
		);
		var mesh = new THREE.Mesh( // chang eto Physijs.BoxMesh
		  new THREE.BoxGeometry( 100000, 100000, 100000 ), material );
		mesh.__dirtyPosition = true;
		sceneCube.add( mesh );


		// CAMERA
		camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 100000 );
		camera.position.set(0, 0, 4000);
		cameraCube = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 100000 );

		// CAMERA CONTROL
		controls = new THREE.OrbitControls( camera );
		controls.addEventListener( 'change', render );

		window.addEventListener( 'resize', onWindowResize, false );
		document.addEventListener( 'mousemove', onDocumentMouseMove, false );

		// ANIMATE
		animate();
	});
	
}



function animate() 
{
    requestAnimationFrame( animate );
	render();
}

function render() {
	// scene.simulate(); uncomment for Physijs

	camera.lookAt( scene.position );
	cameraCube.rotation.copy( camera.rotation );
	renderer.render( sceneCube, cameraCube );
	renderer.render( scene, camera );
	
}
*/

/* window functions */
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	cameraCube.aspect = window.innerWidth / window.innerHeight;
	cameraCube.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentMouseMove( event ) 
{
	event.preventDefault();
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	updateIntersections();
}



/* 

function updateIntersections() {
	scene.updateMatrixWorld();
	raycaster.setFromCamera(mouse,camera);
	var intersects = raycaster.intersectObjects( scene.children );

	if ( intersects.length > 0 ) {
		if ( closestIntersection != intersects[ 0 ].object ) {


			closestIntersection = intersects[ 0 ].object;
			sound_effect.play();

			if (coolmode) var dx = 0.1;
			else var dx = closestIntersection.scale.x * 100;
			var old_len = spheres.length;

			var shader = THREE.FresnelShader;
			var geometry = new THREE.SphereBufferGeometry( 100, 32, 16 );
			shader.uniforms[ "tCube" ].value = skybox;
			var uniforms = THREE.UniformsUtils.clone( shader.uniforms );
			var parameters = { fragmentShader: shader.fragmentShader, vertexShader: shader.vertexShader, uniforms: uniforms };
			var material = Physijs.createMaterial(
				new THREE.ShaderMaterial( parameters )
			);

			var temp1 = cloneBubble(closestIntersection);
			temp1.position.x = closestIntersection.position.x + dx;
			temp1.position.y = closestIntersection.position.y + dx;
			temp1.position.z = closestIntersection.position.z + dx;
			temp1.scale.x = closestIntersection.scale.x / 1.3;
			temp1.scale.y = closestIntersection.scale.y / 1.3;
			temp1.scale.z = closestIntersection.scale.z / 1.3;
			temp1.__dirtyPosition = true;

			var temp2 = cloneBubble(closestIntersection);
			temp2.position.x = closestIntersection.position.x - dx;
			temp2.position.y = closestIntersection.position.y - dx;
			temp2.position.z = closestIntersection.position.z - dx;
			temp2.scale.x = closestIntersection.scale.x / 1.3;
			temp2.scale.y = closestIntersection.scale.y / 1.3;
			temp2.scale.z = closestIntersection.scale.z / 1.3;
			temp2.__dirtyPosition = true;
		
			var temp3 = cloneBubble(closestIntersection);
			temp3.position.x = closestIntersection.position.x + dx;
			temp3.position.y = closestIntersection.position.y - dx;
			temp3.position.z = closestIntersection.position.z + dx;
			temp3.scale.x = closestIntersection.scale.x / 1.3;
			temp3.scale.y = closestIntersection.scale.y / 1.3;
			temp3.scale.z = closestIntersection.scale.z / 1.3;
			temp3.__dirtyPosition = true;

			var temp4 = cloneBubble(closestIntersection);
			temp4.position.x = closestIntersection.position.x - dx;
			temp4.position.y = closestIntersection.position.y + dx;
			temp4.position.z = closestIntersection.position.z - dx;
			temp4.scale.x = closestIntersection.scale.x / 1.3;
			temp4.scale.y = closestIntersection.scale.y / 1.3;
			temp4.scale.z = closestIntersection.scale.z / 1.3;
			temp4.__dirtyPosition = true;
			
			scene.remove(closestIntersection);
			spheres.pop();
			if (temp1.scale.x > 1.0) {
				scene.add( temp1 );
				spheres.push( temp1 );
				sound_effect2.play();
				if (!coolmode) temp1.setLinearVelocity(new THREE.Vector3((Math.round(Math.random()) * 2 - 1) * 400, (Math.round(Math.random()) * 2 - 1) * 400, (Math.round(Math.random()) * 2 - 1) * 400));
			} 

			if (temp2.scale.x > 1.0) {
				scene.add( temp2 );
				spheres.push( temp2 );
				sound_effect2.play();
				if (!coolmode) temp2.setLinearVelocity(new THREE.Vector3((Math.round(Math.random()) * 2 - 1) * 400, (Math.round(Math.random()) * 2 - 1) * 400, (Math.round(Math.random()) * 2 - 1) * 400));
			}
			if (temp3.scale.x > 1.0) {
				scene.add( temp3 );
				spheres.push( temp3);
				sound_effect2.play();
				if (!coolmode) temp3.setLinearVelocity(new THREE.Vector3((Math.round(Math.random()) * 2 - 1) * 400, (Math.round(Math.random()) * 2 - 1) * 400, (Math.round(Math.random()) * 2 - 1) * 400));
			}

			if (temp4.scale.x > 1.0) {
				scene.add( temp4 );
				spheres.push( temp4 );
				sound_effect2.play();
				if (!coolmode) temp4.setLinearVelocity(new THREE.Vector3((Math.round(Math.random()) * 2 - 1) * 400, (Math.round(Math.random()) * 2 - 1) * 400, (Math.round(Math.random()) * 2 - 1) * 400));
			}

		}
	} else {
		closestIntersection = null;
	}	

	
}
*/
