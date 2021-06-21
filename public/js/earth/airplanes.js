let MODELS = [
    { name: "ba146", scale: 0.002 }
];

let numLoadedModels = 0;

for ( let i = 0; i < MODELS.length; ++ i ) {
        const m = MODELS[ i ];
        loadGltfModel( m, function () {
        fetch(`/api/opensky/get-data?model=${m.name}`)
        .then(res => res.json())
        .then(async res => {
            console.log(`Loaded config for ${m.name} with ${res.filter((flight)=>flight.on_ground!='0'&&flight.airline_icao!="").length} flights and ${res.length} total airplanes.`);
            // let cartesian = {};
            // cartesian.x = 0.99 * Math.cos(50.86606607780635) * Math.cos(20.628595248594912)
            // cartesian.y = 0.99 * Math.cos(50.86606607780635) * Math.sin(20.628595248594912)
            // cartesian.z = 0.99 * Math.sin(50.86606607780635) * 1.3
            // spawnPlane(cartesian.y, cartesian.z, cartesian.x, MODELS[0]);
            res.filter((flight)=>flight.on_ground!='0'&&flight.airline_icao!="").forEach(async flight => {
                let cartesian = {};

                // flight.longitude = 20.6285677;
                // flight.latitude = 50.8660773;
                // console.log(flight.altitude);
                // let lat = flight.latitude;
                // let lon = flight.longitude;

                // * wikgu
                // cartesian.x = 1 * Math.cos(flight.latitude) * Math.cos(flight.longitude);
                // cartesian.y = 1 * Math.cos(flight.latitude) * Math.sin(flight.longitude);
                // cartesian.z = 1 * Math.sin(flight.latitude);// * (1 + flight.altitude/1000);


                let phi = (90 - flight.latitude) * Math.PI / 180;
                let theta = (flight.longitude + 180) * Math.PI / 180;
                let r = flight.altitude + 1.03;

                // * Coding train
                // cartesian.x = alt * Math.sin(lat) * Math.cos(lon);
                // cartesian.y = alt * Math.sin(lat) * Math.sin(lon);
                // cartesian.z = alt * Math.cos(lat);

                // * Random guy from comments (after some FUCKIN repairs)
                cartesian.x = -(r * Math.sin(phi)) * Math.cos(theta);
                cartesian.y = r * Math.cos(phi);
                cartesian.z = r * Math.sin(phi) * Math.sin(theta);


                // let cartesian2 = cartesian / 6378.137 * 0.8
                // let coords = await llhxyz(flight.lat,flight.long,flight.alt);
                // console.log(`LLH: ${flight.lat} ${flight.long} ${flight.alt} | Cartesian:`, cartesian);
                // spawnPlane((coords[0]/6378.137*1),-(coords[1]/6378.137*1),(coords[2]/6378.137*1),m);

                console.log(cartesian.x, cartesian.y, cartesian.z);
                spawnPlane(cartesian.x, cartesian.y, cartesian.z, m);
                // spawnPlane(cartesian.y, cartesian.z, cartesian.x, m);
            });

            //     var line = new THREE.Line(geometry, material);
            //     scene.add(line);

            // for (let i = 0; i < 500; i++) {
            //     let state = res.states[i];
            //     let cartesian = {};
            //     cartesian.x = 1 * Math.cos(state.lat) * Math.cos(state.long)
            //     cartesian.y = 1 * Math.cos(state.lat) * Math.sin(state.long)
            //     cartesian.z = 1 * Math.sin(state.lat)
            //     // let cartesian2 = cartesian / 6378.137 * 0.8
            //     // let coords = await llhxyz(state.lat,state.long,state.alt);
            //     // console.log(`LLH: ${state.lat} ${state.long} ${state.alt} | Cartesian:`, cartesian);
            //     // spawnPlane((coords[0]/6378.137*1),-(coords[1]/6378.137*1),(coords[2]/6378.137*1),m);
            //     spawnPlane(cartesian.x, cartesian.y, cartesian.z, m)
            // }
        });
    });
}
// let objLoader = new THREE.OBJLoader();
// let airplanes = [];
// objLoader.load("/assets/models/airplane1/11803_Airplane_v1_l1.obj", (obj) => {
//     // obj.position.set(coords.x, coords.y, coords.z);
//     // obj.rotation.set(-Math.cos(coords.x), Math.sin(coords.y), -Math.sin(coords.z));
//     // console.log(obj);
//     obj.scale.set(0.00002, 0.00002, 0.00002);
//     earthMesh.add(obj);
//     airplanes.push(obj);
// });
// setInterval(async ()=>{
// setTimeout(()=>{
//     fetch("/api/opensky/get-data")
//     .then(res => res.json())
//     .then(async res => {
//         // console.log(res.states.states);
//         console.log(res.states.length);
//         await res.states.filter(state => !state.on_ground).forEach(async state => {
//             let coords = await llhxyz(state.x,state.y,state.z);
//             spawnPlane((coords[0]/6378.137*1),-(coords[1]/6378.137*1),(coords[2]/6378.137*1));
//         });
//         console.log(scene);
//     });
// }, 5000)
// }, 30000);
// spawnPlane = (x, y, z) => {
//     let coords = {x,y,z}
//     let grp = {};
//     // $.extend(grp, airplanes[0]);
//     grp = airplanes[0];
//     grp.position = {x:coords.x, y:coords.y, z:coords.z};
//     // grp.rotation.set(-Math.cos(coords.x), Math.sin(coords.y), -Math.sin(coords.z));
//     airplanes.push(grp);
//     scene.children.push(grp);
// }
spawnPlane = (x, y, z, u) => {
    let coords = {x,y,z}
    let model = getModelByName(u.name);
    const clonedScene = THREE.SkeletonUtils.clone( model.scene );
    if ( clonedScene ) {
        // THREE.Scene is cloned properly, let's find one mesh and launch animation for it
        // const clonedMesh = clonedScene.getObjectByName( u.name );

        // if(u.scale) clonedScene.scale = {x:u.scale,y:u.scale,z:u.scale};

        clonedScene.position.set(coords.x, coords.y, coords.z);

        // clonedScene.rotation.set(-Math.cos(coords.x), Math.sin(coords.y), -Math.sin(coords.z));
        // Different models can have different configurations of armatures and meshes. Therefore,
        // We can't set position, scale or rotation to individual mesh objects. Instead we set
        // it to the whole cloned scene and then add the whole scene to the game world
        // Note: this may have weird effects if you have lights or other items in the GLTF file's scene!
        earthMesh.add( clonedScene );
    }
}
/**
 * Find a model object by name
 * @param name
 * @returns {object|null}
 */
function getModelByName( name ) {
    for ( let i = 0; i < MODELS.length; ++ i ) {
        if ( MODELS[ i ].name === name ) {
            return MODELS[ i ];
        }
    }
    return null;
}
/**
 * Load a 3D model from a GLTF file. Use the GLTFLoader.
 * @param model {object} Model config, one item from the MODELS array. It will be updated inside the function!
 * @param onLoaded {function} A callback function that will be called when the model is loaded
 */
function loadGltfModel( model, onLoaded ) {
    const loader = new THREE.GLTFLoader();
    const modelName = "/assets/models/" + model.name + ".glb";
    loader.load( modelName, function ( gltf ) {
        const scene = gltf.scene;
        // model.animations = gltf.animations;
        model.scene = scene;

        if(model.scale) scene.scale.set(model.scale,model.scale,model.scale);

        // Enable Shadows
        gltf.scene.traverse( function ( object ) {
            if ( object.isMesh ) {
                object.castShadow = true;
            }
        } );
        console.log( "Done loading model", model.name );
        onLoaded();
    } );
}