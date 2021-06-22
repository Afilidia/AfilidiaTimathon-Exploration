let MODELS = [
    { name: "ba146", scale: 0.002 } // 0.002
];

let numLoadedModels = 0;

for (let i = 0; i < MODELS.length; ++ i) {
        const m = MODELS[ i ];

        loadGltfModel(m, function () {

            // Fetch the planes data
            fetch(`/api/opensky/get-data?model=${m.name}`)
                .then(res => res.json())
                    .then(async res => {
                        console.log(`Loaded config for ${m.name} with ${Object.values(res).filter((flight)=>flight.on_ground==0&&flight.airline_icao!="").length} flights and ${Object.values(res).length} total airplanes.`);
                        Object.values(res).filter((flight)=>flight.on_ground==0&&flight.airline_icao!="").forEach(async flight => {
                            let cartesian = {};

                            // flight.longitude = 20.6285677;
                            // flight.latitude = 50.8660773;

                            // * Prepare calc data
                            let phi = (90 - flight.latitude) * Math.PI / 180;
                            let theta = (flight.longitude + 180) * Math.PI / 180;
                            let r = (flight.altitude/700000) + 1;
                            let heading = flight.heading;

                            // * Calculate xyz
                            cartesian.x = -(r * Math.sin(phi)) * Math.cos(theta);
                            cartesian.y = r * Math.cos(phi);
                            cartesian.z = r * Math.sin(phi) * Math.sin(theta);

                            // console.log(cartesian.x, cartesian.y, cartesian.z);

                            // * Spawn
                            spawnPlane(cartesian.x, cartesian.y, cartesian.z, m, flight);
                        });
                    });
        });
}

let aircrafts = [];

// * Plane spawner
spawnPlane = (x, y, z, u, flight) => {
    let coords = {x,y,z}
    let model = getModelByName(u.name);

    // * Clone plane object
    const clonedScene = THREE.SkeletonUtils.clone( model.scene );

    // * Set the calculated xyz position of the plane
    if ( clonedScene ) {
        clonedScene.position.set(coords.x, coords.y, coords.z);

        // * Plane rotation
        rotatePlane(clonedScene);
        
        // * Set information about the plane
        clonedScene.giveInfo = () => {
            console.log(flight);
        }

        // * Add aircraft
        aircrafts.push(clonedScene);
        earthMesh.add(clonedScene);
    }
}

// * Find a model object by name
function getModelByName( name ) {
    for ( let i = 0; i < MODELS.length; ++ i ) {
        if ( MODELS[ i ].name === name ) {
            return MODELS[ i ];
        }
    }
    return null;
}

function rotatePlane(plane) {
    plane.rotateY(0); // left - right
    plane.rotateZ(0); // side - side

    plane.lookAt(earthMesh.position);
    plane.rotateX(180.5); // up - down
}

// * Load a 3D model from a GLTF file. Use the GLTFLoader.
function loadGltfModel( model, onLoaded ) {
    const loader = new THREE.GLTFLoader();
    const modelName = "/assets/models/" + model.name + ".glb";
    loader.load( modelName, function ( gltf ) {
        const scene = gltf.scene;
        // model.animations = gltf.animations;
        model.scene = scene;

        if (model.scale) scene.scale.set(model.scale,model.scale,model.scale);

        // Enable Shadows
        gltf.scene.traverse( function ( object ) {
            if ( object.isMesh ) {
                object.castShadow = true;
            }
        });

        console.log( "Done loading model", model.name );
        onLoaded();
    } );
}

// * Probably wrong becouse of this fuckin three.js
function getRotation(angle) {
    return (1 / 45) * angle;
}

// * Flight data * //
// window.onload = function() {
//     var raycaster = new THREE.Raycaster();
//     var mouse = new THREE.Vector2();

//     function onDocumentMouseDown(event) {
//         event.preventDefault();

//         mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
//         mouse.y =  - (event.clientY / renderer.domElement.clientHeight) * 2 + 1;

//         raycaster.setFromCamera(mouse, camera);

//         var intersects = raycaster.intersectObjects(aircrafts);

//         if (intersects.length > 0) {
//             intersects[0].object.giveInfo();
//         }

//     }

//     document.addEventListener('mousedown', onDocumentMouseDown, false);
// };