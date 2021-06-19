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

let objLoader = new THREE.OBJLoader();
let airplanes = [];
spawnPlane = (x, y, z) => {
    // let coords = {
    //     x: x/90*0.1+0.6,
    //     y: y/190*0.1+0.6,
    //     z: z/15000*0.1+0.6,
    // }
    let coords = {x,y,z}
    objLoader.load("/assets/models/airplane1/11803_Airplane_v1_l1.obj", (obj) => {
        obj.position.set(coords.x, coords.y, coords.z);
        obj.rotation.set(-Math.cos(coords.x), Math.sin(coords.y), -Math.sin(coords.z));
        console.log(obj);
        obj.scale.set(0.00002, 0.00002, 0.00002);
        earthMesh.add(obj);
        airplanes.push(obj);
    });
}
// spawnPlane( 0.6, 0.6, 0.6 );
// spawnPlane(9.1105, 45.4086, 11277.6);
// spawnPlane(-78.6497, 42.4692, 10363.2);
let {x,y,z} = LLAtoXYZ(150.9142, -32.7491, 6774.18);
spawnPlane(x,y,z);
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

var EARTH_A  = undefined;
var EARTH_B  = undefined;
var EARTH_F  = undefined;
var EARTH_Ecc= undefined;
var EARTH_Esq= undefined;

function LLAtoXYZ (flati,floni, altkmi) {
    let  dtr =  Math.PI/180.0;
    let  flat,flon,altkm;
    let  clat,clon,slat,slon;
    let  rrnrm = new Array(3);
    let  rn,esq;
    let  x,y,z;
    let  xvec = new Array(3);

    geodGBL();

    flat  = Number(flati);
    flon  = Number(floni);
    altkm = Number(altkmi);

    clat = Math.cos(dtr*flat);
    slat = Math.sin(dtr*flat);
    clon = Math.cos(dtr*flon);
    slon = Math.sin(dtr*flon);
        
    rrnrm  = radcur (flat);
    rn     = rrnrm[1];
    re     = rrnrm[0];

    ecc    = EARTH_Ecc;
    esq    = ecc*ecc

    x      =  (rn + altkm) * clat * clon;
    y      =  (rn + altkm) * clat * slon;
    z      =  ( (1-esq)*rn + altkm ) * slat;

    xvec[0]  = x;
    xvec[1]  = y;
    xvec[2]  = z;

    return  xvec ;
}
function radcur(lati) {

    var rrnrm = new Array(3)

    var dtr   = Math.PI/180.0

    var  a,b,lat
    var  asq,bsq,eccsq,ecc,clat,slat
    var  dsq,d,rn,rm,rho,rsq,r,z

    geodGBL();

//        -------------------------------------

    a     = EARTH_A;
    b     = EARTH_B;

    asq   = a*a;
    bsq   = b*b;
    eccsq  =  1 - bsq/asq;
    ecc = Math.sqrt(eccsq);

    lat   =  Number(lati);

    clat  =  Math.cos(dtr*lat);
    slat  =  Math.sin(dtr*lat);

    dsq   =  1.0 - eccsq * slat * slat;
    d     =  Math.sqrt(dsq);

    rn    =  a/d;
    rm    =  rn * (1.0 - eccsq ) / dsq;

    rho   =  rn * clat;
    z     =  (1.0 - eccsq ) * rn * slat;
    rsq   =  rho*rho + z*z;
    r     =  Math.sqrt( rsq );

    rrnrm[0]  =  r;
    rrnrm[1]  =  rn;
    rrnrm[2]  =  rm;

    return ( rrnrm );

}
function wgs84() {
    let  wgs84a, wgs84b, wgs84f

    wgs84a         =  0.7//6378.137;
    wgs84f         =  1.0/0.7//298.257223563;
    wgs84b         =  wgs84a * ( 1.0 - wgs84f );

    earthcon (wgs84a, wgs84b );

}
wgs84();
function earthcon(ai,bi) {
    let  f,ecc, eccsq, a,b

    a        =  Number(ai);
    b        =  Number(bi);

    f        =  1-b/a;
    eccsq    =  1 - b*b/(a*a);
    ecc      =  Math.sqrt(eccsq);

    EARTH_A  =  a;
    EARTH_B  =  b;
    EARTH_F  =  f;
    EARTH_Ecc=  ecc;
    EARTH_Esq=  eccsq;
}
function geodGBL() {
    let  tstglobal

    tstglobal = typeof EARTH_A;
    if ( tstglobal == "undefined" )  wgs84() 
}