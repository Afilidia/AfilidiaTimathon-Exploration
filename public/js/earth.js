// document.body.style.backgroundColor = '#000';//'#171133';
// document.getElementById("earth").style.width = '100%';
// document.getElementById("earth").style.height = '100%';

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, 1, 1, 10000 );//window.innerWidth / window.innerHeight, 1, 10000 );

var renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
renderer.setSize( 800, 800 );
renderer.setClearColor( 0x000000, 0 );
document.getElementById("earth").appendChild( renderer.domElement );
// document.getElementById("earth").getElementsByTagName("canvas")[0].id = 'earth-canvas';

const light = new THREE.PointLight(0xbfb0cc, 2);
light.position.set(5, 10, 10);
scene.add(light);

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
camera.position.z = 2;

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
    console.log(hour);
    if(hour>=24) hour = 0;
    document.getElementById("hour-range-label").innerText = `${Math.floor(hour)}:${Math.floor((hour-Math.floor(hour))*60)}`;
}, 1000);
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