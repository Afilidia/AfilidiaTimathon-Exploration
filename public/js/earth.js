var canvasCloud = document.getElementById("canvasCloud");
var ctx = canvasCloud.getContext("2d");
var img = document.getElementById("clouds");
ctx.drawImage(img, 10, 10);

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, 1, 1, 10000 );//window.innerWidth / window.innerHeight, 1, 10000 );

var renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
renderer.setSize( 800, 800 );
renderer.setClearColor( 0x000000, 0 );
document.getElementById("earth").appendChild( renderer.domElement );

const light = new THREE.PointLight(0xbfb0cc, 2);
light.position.set(5, 10, 10);
scene.add(light);

var textureLoader = new THREE.TextureLoader();

var geometry = new THREE.SphereGeometry(1, 128, 128);
var material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    map: textureLoader.load('/images/earthmap1k.jpg'),
    bumpMap  : textureLoader.load('/images/earthbump2k.jpg'),
    bumpScale: 0.2,
    specularMap: textureLoader.load('/images/earthspec1k.jpg'),
    specular : 0x000000,
});
// material.color= 0xffffff;
// material.map    = textureLoader.load('/images/earthmap1k.jpg');
// material.bumpMap   = textureLoader.load('/images/earthbump1k.jpg');
// material.bumpScale = 0.05;
// material.specularMap = textureLoader.load('/images/earthspec1k.jpg');
// material.specular  = 0xffffff;
var earthMesh = new THREE.Mesh(geometry, material);
var geometry   = new THREE.SphereGeometry(0.51, 32, 32)
var material  = new THREE.MeshPhongMaterial({
    map         : new THREE.Texture(canvasCloud),
    side        : THREE.DoubleSide,
    opacity     : 0.8,
    transparent : true,
    depthWrite  : false
});

scene.add( earthMesh );
camera.position.z = 2;

var cloudMesh = new THREE.Mesh(geometry, material);
earthMesh.add(cloudMesh);

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


function animate() {
    requestAnimationFrame( animate );
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