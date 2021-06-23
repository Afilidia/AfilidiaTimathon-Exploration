let MODELS = [
    { name: "ba146", scale: 0.01 } // 0.001
];

let numLoadedModels = 0;

for (let i = 0; i < MODELS.length; ++ i) {
        const m = MODELS[ i ];

        loadGltfModel(m, function () {

            // Fetch the planes data
            fetch(`/api/opensky/get-data?model=${m.name}`)
                .then(res => res.json())
                    .then(async res => {
                        let progressMax = Object.values(res).filter((flight)=>flight.on_ground==0&&flight.airline_icao!="").length;
                        let progress = 0;
                        console.log(`Loaded config for ${m.name} with ${progressMax} flights and ${Object.values(res).length} total airplanes.`);
                        Object.values(res).filter((flight)=>flight.on_ground==0&&flight.airline_icao!="").forEach(async flight => {
                            let cartesian = {};

                            // flight.longitude = 20.6285677;
                            // flight.latitude = 50.8660773;

                            // * Prepare calc data
                            let phi = (90 - flight.latitude) * Math.PI / 180;
                            let theta = (flight.longitude + 180) * Math.PI / 180;
                            let r = (flight.altitude/500000) + 1;
                            let heading = flight.heading;

                            // * Calculate xyz
                            cartesian.x = -(r * Math.sin(phi)) * Math.cos(theta);
                            cartesian.y = r * Math.cos(phi);
                            cartesian.z = r * Math.sin(phi) * Math.sin(theta);

                            // console.log(cartesian.x, cartesian.y, cartesian.z);

                            // * Spawn
                            spawnPlane(cartesian.x, cartesian.y, cartesian.z, m, flight);

                            progress++;
                            // document.getElementById("loading").setAttribute('progress', Math.round(progress/progressMax*100));
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


        // * Set information about the plane
        clonedScene.children[0].children.forEach(child => {
            child.giveInfo = () => {
                console.log(flight);
            }
        });
        // clonedScene.giveInfo = () => {
        //     console.log(flight);
        // }
        clonedScene.icao_24bit = flight.icao_24bit;
        clonedScene.heading = flight.heading;

        // * Plane rotation
        rotatePlane(clonedScene);

        // * Add aircraft
        aircrafts[flight.icao_24bit] = clonedScene;
        earthMesh.add(clonedScene);
    }
}

let debuglat = 50.8660773;
updatePlanes = () => {
    for (let i = 0; i < MODELS.length; ++ i) {
        const m = MODELS[ i ];
        fetch(`/api/opensky/get-data?model=${m.name}`)
            .then(res => res.json())
                .then(async res => {
                    // debuglat+=0.1;
                    let progressMax = Object.values(res).filter((flight)=>flight.on_ground==0&&flight.airline_icao!="").length;
                    let progress = 0;
                    console.log(`Updated config for ${m.name} with ${progressMax} flights and ${Object.values(res).length} total airplanes.`);
                    aircrafts.forEach(plane => {
                        plane.toRemove = true;
                    });
                    Object.values(res).filter((flight)=>flight.on_ground==0&&flight.airline_icao!="").forEach(async flight => {
                        let cartesian = {};

                        // flight.longitude = 20.6285677;
                        // flight.latitude = debuglat;

                        // * Prepare calc data
                        let phi = (90 - flight.latitude) * Math.PI / 180;
                        let theta = (flight.longitude + 180) * Math.PI / 180;
                        let r = (flight.altitude/500000) + 1;
                        let heading = flight.heading;

                        // * Calculate xyz
                        cartesian.x = -(r * Math.sin(phi)) * Math.cos(theta);
                        cartesian.y = r * Math.cos(phi);
                        cartesian.z = r * Math.sin(phi) * Math.sin(theta);

                        // console.log(cartesian.x, cartesian.y, cartesian.z);

                        // * Spawn
                        if(aircrafts[flight.icao_24bit]) aircrafts[flight.icao_24bit].position.set(cartesian.x, cartesian.y, cartesian.z);
                        else await spawnPlane(cartesian.x, cartesian.y, cartesian.z, m, flight);


                        aircrafts[flight.icao_24bit].toRemove = false;

                        progress++;
                        // document.getElementById("loading").setAttribute('progress', Math.round(progress/progressMax*100));
                    });
                    aircrafts.forEach(plane => {
                        if(plane.toRemove) removePlane(plane.icao_24bit);
                    });
                });
    }
}
setInterval(updatePlanes, 5000)

let removePlane = (icao) => {
    earthMesh.remove(aircrafts[icao]);
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
    plane.rotateX(toRadians(-90)); // up - down
    plane.rotateY(toRadians(180+plane.heading));
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
        scene.children[0].children.forEach(child => {
            child.material.color.setHex( 0x7a7a7a );
            // child.material.metalness = 100;
        });

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

// * Flight data * //
window.onload = function() {
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();

    function onDocumentMouseDown(event) {
        event.preventDefault();

        mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
        mouse.y =  - (event.clientY / renderer.domElement.clientHeight) * 2 + 1;

        
    }

    document.addEventListener('mousedown', onDocumentMouseDown, false);
};