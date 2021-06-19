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

// let shapeLight = new THREE.PointLight( 0xffffff, 5000, 2000 );
// shapeLight.color.setHSL( 0.55, 0.9, 0.5 );
// shapeLight.position.set( 0, 5000, 0 );
// scene.add( shapeLight );
var textureLoader = new THREE.TextureLoader();

var earthgeometry = new THREE.SphereGeometry(0.99, 128, 128);
var material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    map: textureLoader.load('/images/earthmap5k.jpg'),//textureLoader.load('/images/earthmap2k.jpg'),
    bumpMap  : textureLoader.load('/images/earthbump1k.jpg'),
    bumpScale: 0.1,
    specularMap: textureLoader.load('/images/earthspec1k.jpg'),
    specular : 0x000000,
});

var earthMesh = new THREE.Mesh(earthgeometry, material);

var lightsgeometry = new THREE.SphereGeometry(0.995, 128, 128);
var material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    map: textureLoader.load('/images/earthlights1k.jpg'),
    bumpMap  : textureLoader.load('/images/earthbump1k.jpg'),
    bumpScale: 0.1,
    opacity     : 0.9,
    transparent : true,
    specularMap: textureLoader.load('/images/earthspec1k.jpg'),
    specular : 0x000000,
});

var lightsMesh = new THREE.Mesh(lightsgeometry, material);
var cloudsgeometry   = new THREE.SphereGeometry(1, 128, 128)
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
var cloudMesh = new THREE.Mesh(cloudsgeometry, material);


const clouds = textureLoader.load( '/images/earth_clouds_2048.png' );
clouds.encoding = THREE.sRGBEncoding;

const earthCloudsMat = new THREE.MeshLambertMaterial( {
    color: 0xffffff,
    blending: THREE.NormalBlending,
    opacity     : 0.8,
    transparent: true,
    depthTest: false,
    map: clouds
} );

const sphereCloudsMesh = new THREE.Mesh( earthgeometry, earthCloudsMat );
earthMesh.add( sphereCloudsMesh );

scene.add( earthMesh );
camera.position.z = 4;

// earthMesh.add(cloudMesh);
earthMesh.add(lightsMesh);

var isDragging = false;
var previousMousePosition = {
    x: 0,
    y: 0
};

let moveratio = {x:0,y:0};

$(renderer.domElement).on('mousedown', function(e) {
    isDragging = true;
}).on('mousemove', function(e) {
    mousemove(e);
});

$(renderer.domElement).on('touchstart', function() {
    isDragging = true;
}).on('touchmove', function(e) {
    mousemove(e);
});

function mousemove(e) {
    //console.log(e);
    var deltaMove = {
        x: e.offsetX-previousMousePosition.x,
        y: e.offsetY-previousMousePosition.y
    };

    if(isDragging) {
        if(moveratio.x + 0.002 <= deltaMove.x) moveratio.x+=0.002;
        else if(moveratio.x - 0.002 >= deltaMove.x) moveratio.x-=0.002;
        else moveratio.x=0;
    
        if(moveratio.y + 0.002 <= deltaMove.y) moveratio.y+=0.002;
        else if(moveratio.y - 0.002 >= deltaMove.y) moveratio.y-=0.002;
        else moveratio.y=0;

        /* if(moveratio.x + 0.01 <= deltaMove.x && deltaMove.x > 0.01) moveratio.x+=0.01;
        else if(moveratio.x - 0.01 >= deltaMove.x && deltaMove.x < -0.01) moveratio.x-=0.01;
        else moveratio.x=0;
    
        if(moveratio.y + 0.01 <= deltaMove.y && deltaMove.y > 0.01) moveratio.y+=0.01;
        else if(moveratio.y - 0.01 >= deltaMove.y && deltaMove.y < -0.01) moveratio.y-=0.01;
        else moveratio.y=0; */

        var deltaRotationQuaternion = new THREE.Quaternion()
            .setFromEuler(new THREE.Euler(
                toRadians(moveratio.y*0.25),
                toRadians(moveratio.x*0.25),
                0,
                'XYZ'
            ));
        
        earthMesh.quaternion.multiplyQuaternions(deltaRotationQuaternion, earthMesh.quaternion);
    }
    
    previousMousePosition = {
        x: e.offsetX,
        y: e.offsetY
    };
}
setInterval(()=>{
    if (!isDragging) {
        if(moveratio.x + 0.004 <= 0) moveratio.x+=0.004;
        else if(moveratio.x - 0.004 >= 0) moveratio.x-=0.004;
        else moveratio.x=0;
    
        if(moveratio.y + 0.004 <= 0) moveratio.y+=0.004;
        else if(moveratio.y - 0.004 >= 0) moveratio.y-=0.004;
        else moveratio.y=0;
        var deltaRotationQuaternion = new THREE.Quaternion()
            .setFromEuler(new THREE.Euler(
                toRadians(moveratio.y==0?0:moveratio.y*2),
                toRadians(moveratio.x==0?-0.02:moveratio.x*2),
                0,
                'XYZ'
            ));
        
        earthMesh.quaternion.multiplyQuaternions(deltaRotationQuaternion, earthMesh.quaternion);
    } else {
        if(moveratio.x + 0.002 <= 0) moveratio.x+=0.002;
        else if(moveratio.x - 0.002 >= 0) moveratio.x-=0.002;
        else moveratio.x=0;
    
        if(moveratio.y + 0.002 <= 0) moveratio.y+=0.002;
        else if(moveratio.y - 0.002 >= 0) moveratio.y-=0.002;
        else moveratio.y=0;
    }
    
}, 1000/60)
/* */

$(document).on('mouseup', function(e) {
    isDragging = false;
});
$(document).on('touchend', function() {
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

// let startx = -silnia(-Math.ceil(earthMesh.position.x));
// esetx = () => {
//     earthMesh.position.x -= 0.1;
//     if(earthMesh.position.x < 0) setTimeout(esetx(startx+silnia(-Math.ceil(earthMesh.position.x))));
// };
// esetx();
// let starty = -silnia(-Math.ceil(earthMesh.position.y));
// esety = () => {
//     earthMesh.position.y -= 0.1;
//     if(earthMesh.position.y < 0) setTimeout(esety(starty+silnia(-Math.ceil(earthMesh.position.y))));
// };
// esety();
// let startz = -silnia(-Math.ceil(earthMesh.position.z));
// esetz = () => {
//     earthMesh.position.z -= 0.1;
//     if(earthMesh.position.z < 0) setTimeout(esetz(startz+silnia(-Math.ceil(earthMesh.position.z))));
// };
// esetz();
function animate() {
    requestAnimationFrame( animate );
    let time = hour-12;
    let opacity = 1/12*(time<0?-time:time);
    lightsMesh.material.opacity = opacity;
    sphereCloudsMesh.material.opacity = 0.9-(1/12*(time<0?-time:time))*0.8;
    sphereCloudsMesh.rotation.y -= (1-(1/12*(time<0?-time:time))*0.8)*(1 / 64 * 0.01);
    // sphereCloudsMesh.rotation.x -= 1 / 64 * 0.01;
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