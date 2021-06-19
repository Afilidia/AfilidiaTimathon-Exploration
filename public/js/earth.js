// document.body.style.backgroundColor = '#000';//'#171133';
// document.getElementById("earth").style.width = '100%';
// document.getElementById("earth").style.height = '100%';

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 35, 1, 1, 10000 );//window.innerWidth / window.innerHeight, 1, 10000 );

var renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
renderer.setSize( 800, 800 );
renderer.setClearColor( 0x000000, 0 );
document.getElementById("earth").appendChild( renderer.domElement );
// document.getElementById("earth").getElementsByTagName("canvas")[0].id = 'earth-canvas';

const light = new THREE.PointLight(0xbfb0cc, 2);
light.position.set(10, 10, 10);
scene.add(light);
const ambient = new THREE.AmbientLight(0xbfb0cc, 0.1);
scene.add(ambient);

var textureLoader = new THREE.TextureLoader();

var geometry = new THREE.SphereGeometry(0.99, 128, 128);
var material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    map: textureLoader.load('/images/earthmap5k.jpg'),//textureLoader.load('/images/earthmap2k.jpg'),
    bumpMap  : textureLoader.load('/images/earthbump2k.jpg'),
    bumpScale: 0.2,
    specularMap: textureLoader.load('/images/earthspec1k.jpg'),
    specular : 0x000000,
});

var earthMesh = new THREE.Mesh(geometry, material);

var geometry = new THREE.SphereGeometry(0.995, 128, 128);
var material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    map: textureLoader.load('/images/earthlights1k.jpg'),
    bumpMap  : textureLoader.load('/images/earthbump2k.jpg'),
    bumpScale: 0.2,
    opacity     : 0.9,
    transparent : true,
    specularMap: textureLoader.load('/images/earthspec1k.jpg'),
    specular : 0x000000,
});

var lightsMesh = new THREE.Mesh(geometry, material);
var geometry   = new THREE.SphereGeometry(1, 128, 128)
var material  = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    map         : textureLoader.load('/images/earthcloudmap.jpg'),//new THREE.Texture(canvasCloud),
    side        : THREE.DoubleSide,
    opacity     : 0.4,
    transparent : true,
    // depthWrite  : false,
    specularMap: textureLoader.load('/images/earthcloudmaptrans.jpg'),
    specular : 0x333333,
});
var cloudMesh = new THREE.Mesh(geometry, material);

scene.add( earthMesh );
camera.position.z = 4;

// earthMesh.add(cloudMesh);
earthMesh.add(lightsMesh);

var isDragging = false;
var previousMousePosition = {
    x: 0,
    y: 0
};
$(renderer.domElement).on('mousedown', function(e) {
    isDragging = true;
})
.on('mousemove', function(e) {
    //console.log(e);
    var deltaMove = {
        x: e.offsetX-previousMousePosition.x,
        y: e.offsetY-previousMousePosition.y
    };

    if(isDragging) {
            
        var deltaRotationQuaternion = new THREE.Quaternion()
            .setFromEuler(new THREE.Euler(
                toRadians(deltaMove.y * 0.2),
                toRadians(deltaMove.x * 0.2),
                0,
                'XYZ'
            ));
        
        earthMesh.quaternion.multiplyQuaternions(deltaRotationQuaternion, earthMesh.quaternion);
    }
    
    previousMousePosition = {
        x: e.offsetX,
        y: e.offsetY
    };
});
setInterval(()=>{
    if (!isDragging) {
        var deltaRotationQuaternion = new THREE.Quaternion()
            .setFromEuler(new THREE.Euler(
                toRadians(0.01),
                toRadians(0.05),
                0,
                'XYZ'
            ));
        
        earthMesh.quaternion.multiplyQuaternions(deltaRotationQuaternion, earthMesh.quaternion);
    }
}, 1000/60)
/* */

$(document).on('mouseup', function(e) {
    isDragging = false;
});

let hour = 0;
document.getElementById("hour-range").value = `${new Date().getHours()*60*60 + new Date().getMinutes()*60 + new Date().getSeconds()}`;
setInterval(()=>{
    document.getElementById("hour-range").value = `${(parseInt(document.getElementById("hour-range").value)+1>86399?0:parseInt(document.getElementById("hour-range").value)+1)}`;
    hour = (document.getElementById("hour-range").value/60/60);
    if(hour>=24) hour = 0;
    document.getElementById("hour-range-label").innerText = `${Math.floor(hour)<10?`0`+Math.floor(hour):Math.floor(hour)}:${Math.floor((hour-Math.floor(hour))*60)<10?`0`+Math.floor((hour-Math.floor(hour))*60):Math.floor((hour-Math.floor(hour))*60)}`;
}, 1000);

// spawnPlane(9.1105,45.4086,11277.6);

function animate() {
    requestAnimationFrame( animate );
    let time = hour-12;
    let opacity = 1/12*(time<0?-time:time);
    lightsMesh.material.opacity = opacity;
    // cloudMesh.rotation.y += 1 / 8 * 0.02;
    // earthMesh.rotation.y += 1 / 16 * 0.01;
    let size = {x: document.getElementById("earth").clientWidth, y: document.getElementById("earth").clientHeight};
    renderer.setSize(size.x, size.y);
    camera.aspect = size.x / size.y;
    camera.updateProjectionMatrix();
    renderer.render( scene, camera );
}
animate();
// setInterval(animate, 16);
function toRadians(angle) {
    return angle * (Math.PI / 180);
}

function toDegrees(angle) {
    return angle * (180 / Math.PI);
}

let MODELS = [
    { name: "bae146" }
];

for ( let i = 0; i < MODELS.length; ++ i ) {

    const m = MODELS[ i ];

    loadGltfModel( m, function () {
        fetch(`/api/opensky/get-data?model=${m.name}`)
        .then(res => res.json())
        .then(async res => {
            console.log(`Loaded config for ${m.name} with ${res.states.length} states.`);
            res.states.forEach(async state => {
                let coords = await llhxyz(state.x,state.y,state.z);
                spawnPlane((coords[0]/6378.137*1),-(coords[1]/6378.137*1),(coords[2]/6378.137*1));
            });
        });
    } );

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
spawnPlane = (x, y, z) => {
    let coords = {x,y,z}
    let model = getModelByName("bae146");
    const clonedScene = SkeletonUtils.clone( model.scene );

    if ( clonedScene ) {

        // THREE.Scene is cloned properly, let's find one mesh and launch animation for it
        const clonedMesh = clonedScene.getObjectByName( u.meshName );

        clonedMesh.position = {x:coords.x, y:coords.y, z:coords.z};
        clonedMesh.rotation.set(-Math.cos(coords.x), Math.sin(coords.y), -Math.sin(coords.z));
        // Different models can have different configurations of armatures and meshes. Therefore,
        // We can't set position, scale or rotation to individual mesh objects. Instead we set
        // it to the whole cloned scene and then add the whole scene to the game world
        // Note: this may have weird effects if you have lights or other items in the GLTF file's scene!
        worldScene.add( clonedScene );
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