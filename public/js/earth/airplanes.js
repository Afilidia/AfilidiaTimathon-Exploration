let MODELS = [
    { name: "ba146" }
];

let numLoadedModels = 0;

for ( let i = 0; i < MODELS.length; ++ i ) {
        const m = MODELS[ i ];
        loadGltfModel( m, function () {
        fetch(`/api/opensky/get-data?model=${m.name}`)
        .then(res => res.json())
        .then(async res => {
            console.log(`Loaded config for ${m.name} with ${res.states.length} states.`);
            res.states.forEach(async state => {
                let coords = await llhxyz(state.x,state.y,state.z);
                spawnPlane((coords[0]/6378.137*1),-(coords[1]/6378.137*1),(coords[2]/6378.137*1),m);
            });
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
        const clonedMesh = clonedScene.getObjectByName( u.name );
        clonedMesh.position = {x:coords.x, y:coords.y, z:coords.z};
        clonedMesh.rotation.set(-Math.cos(coords.x), Math.sin(coords.y), -Math.sin(coords.z));
        // Different models can have different configurations of armatures and meshes. Therefore,
        // We can't set position, scale or rotation to individual mesh objects. Instead we set
        // it to the whole cloned scene and then add the whole scene to the game world
        // Note: this may have weird effects if you have lights or other items in the GLTF file's scene!
        earthMesh.add( clonedMesh );
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