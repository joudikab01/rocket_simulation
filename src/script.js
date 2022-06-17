import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap'
import * as dat from 'dat.gui'
import { Vector3 } from './vectors';
import { Matrix3, Mesh } from 'three'
import Rocket from './physics/rocket'
import { SceneUtils } from 'three/examples/jsm/utils/SceneUtils.js';
import { Vector } from './physics/vector'


/**
 * Base
 */
const parameters = {
  color: 0xff0000,
  spin: () => {
    gsap.to(sphere.rotation, 1, { y: mesh.rotation.y + Math.PI * 2 })
  }
}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
const rocket = new Rocket()


/**
 * Object
 */
const sat_arry = []
const satellitee = new THREE.Mesh();
rocket.mesh = new THREE.Mesh()

const gltfLoader = new GLTFLoader()

const launch = new THREE.Mesh();
const pad = new THREE.Mesh();

gltfLoader.load('/models/pad/scene.gltf',
  async (gltf) => {
    console.log('pad');
    gltf.scene.scale.set(1, 1, 1)
    gltf.scene.position.set(0.1, 0.1, 0.1)
    pad.add(gltf.scene)
    scene.add(pad)
    sat_arry.push(pad),
      console.log(pad);
  },
  () => { console.log('paaaad') },
)

const image = new Image()
const texture = new THREE.Texture(image);
image.onload = () => { texture.needsUpdate = true }
image.src = '/textures/a.jpg';

var light = new THREE.AmbientLight(0xffffff);
scene.add(light);


// Textures:
const Sky3Texture =new THREE.TextureLoader().load('/textures/a.jpg');
const Base =new THREE.TextureLoader().load('/textures/base.jpg');
const SkyTexture =new THREE.TextureLoader().load('/textures/ff.jpg');
const Sky1Texture =new THREE.TextureLoader().load('/textures/sky2.jpg');
const Sky2Texture =new THREE.TextureLoader().load('/textures/space.jpg');
const earthTexture =new THREE.TextureLoader().load('/textures/earth.jpg');
const SpaceTexture =new THREE.TextureLoader().load('/textures/space1.jpg');
scene.background=SpaceTexture;



// Earth
var globeMaterialf = new THREE.MeshBasicMaterial({
  map: earthTexture,
 // shininess: 40,
 // transparent: true,
  side: THREE.FrontSide,
  opacity: 0.9,
 // shading: THREE.SmoothShading,
//  color: 0xaaaaaa,
  //blending : THREE.AdditiveBlending
});
var globeMaterialb = new THREE.MeshBasicMaterial({
  map:Sky2Texture,
  transparent: true,
  side: THREE.BackSide,
opacity: 1,
  shading: THREE.SmoothShading,
// color: 0xaaaaaa,
//  blending : THREE.AdditiveBlending,
 //depthTest: false
});

var mesh1 = new SceneUtils.createMultiMaterialObject( new THREE.SphereGeometry(40,32,32),[globeMaterialf, globeMaterialb]);
//log.console('aaaaa');
scene.add(mesh1)

//Atmosphere
var AtmosphereF = new THREE.MeshBasicMaterial({
map:Sky2Texture,
shininess: 40,
transparent: true,
side: THREE.FrontSide,
opacity: 0.5,
shading: THREE.SmoothShading,
color: 0xaaaaaa,
blending : THREE.AdditiveBlending
});
var AtmosphereB= new THREE.MeshBasicMaterial({
map:Sky2Texture,
transparent: true,
side: THREE.BackSide,
opacity: 1,
shading: THREE.SmoothShading,
// color: 0xaaaaaa,
//blending : THREE.AdditiveBlending,
//depthTest: false
});

var Atmosphere1 = new SceneUtils.createMultiMaterialObject( new THREE.SphereGeometry(35,32,32),[AtmosphereF, AtmosphereB]);
//log.console('aaaaa');
scene.add(Atmosphere1)


// Cloud
var CloudF = new THREE.MeshBasicMaterial({
map:Sky1Texture,
shininess: 40,
transparent: true,
side: THREE.FrontSide,
opacity: 0.5,
shading: THREE.SmoothShading,
color: 0xaaaaaa,
blending : THREE.AdditiveBlending
});
var CloudB= new THREE.MeshBasicMaterial({
map:Sky1Texture,
transparent: true,
side: THREE.BackSide,
opacity: 1,
shading: THREE.SmoothShading,
//color: 0xaaaaaa,
//blending : THREE.AdditiveBlending,
//depthTest: false
});

var Cloud1 = new SceneUtils.createMultiMaterialObject( new THREE.SphereGeometry(30,32,32),[CloudF, CloudB]);
//log.console('aaaaa');
scene.add(Cloud1)


//sky
var SkyF = new THREE.MeshBasicMaterial({
map:SkyTexture,
shininess: 40,
transparent: true,
side: THREE.FrontSide,
opacity: 0.5,
shading: THREE.SmoothShading,
color: 0xaaaaaa,
blending : THREE.AdditiveBlending
});
var SkyB= new THREE.MeshBasicMaterial({
map:SkyTexture,
transparent: true,
side: THREE.BackSide,
opacity: 1,
shading: THREE.SmoothShading,
// color: 0xaaaaaa,
// blending : THREE.AdditiveBlending,
//depthTest: false
});

var Sky1 = new SceneUtils.createMultiMaterialObject( new THREE.SphereGeometry(19.999,32,32),[SkyF, SkyB]);
//log.console('aaaaa');
scene.add(Sky1)

//land
const land = new THREE.Mesh(
  new THREE.CircleGeometry(19.9, 32, 32),
  new THREE.MeshBasicMaterial({
    side: THREE.BackSide, 
    map: Sky3Texture,
  })
);
scene.add(land);

const Base11 =new THREE.Mesh(
  new THREE.CircleGeometry(5,32,32),
  new THREE.MeshBasicMaterial({
 side: THREE.BackSide,
  map:Base,
  })
  );
 // scene.add(Base11);

land.rotation.x = Math.PI / 1.9;
land.position.z = 0
land.position.x = 0
land.position.y = 0.0

Base11.rotation.x = Math.PI / 1.9;
    Base11.position.z = 0
    Base11.position.x = 0
    Base11.position.y = 0.1
   

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}


function addStar ( ) 
{ const geometry = new THREE.SphereGeometry ( 0.25 , 24 , 24 ) ; 
  const material= new THREE.MeshStandardMaterial({color:0xffff})
  const star = new THREE.Mesh ( geometry , material ) ;
  const [x,y,z]=Array(3).fill().map(()=>THREE.MathUtils.randFloatSpread(100));
 let a=Math.abs(x);
 let b=Math.abs(y);
 if ((a&&b)>40)
star.position.set(x,y,z);
   scene.add(star)
}
Array(400).fill().forEach(addStar)


window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 10
scene.add(camera)
// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Debug
 */
const gui = new dat.GUI({
  // closed: true,
  width: 400
})
// gui.hide()
//gui.add(mesh.position, 'y').min(- 3).max(3).step(0.01).name('elevation')
//gui.add(mesh, 'visible')
//gui.add(material, 'wireframe')

gui
  .addColor(parameters, 'color')
  .onChange(() => {
    material.color.set(parameters.color)
  })
gui.add(parameters, 'spin')


function setupKeyControls() {

  document.onkeydown = function (e) {
    switch (e.keyCode) {
      case 37:
        rocket.force_angle += 1;

        break;
      case 38:
        //   thrustMagnitude.v += 0.01;
        break;
      case 39:
        rocket.force_angle -= 1;
        break;
      case 40:
        //thrustMagnitude.v -= 0.01;
        break;
      case 83:
        gltfLoader.load('/models/spacex/scene.gltf',
          async (gltf) => {
            console.log('ahmad');
            gltf.scene.scale.set(0.0019, 0.0019, 0.0019)
            gltf.scene.position.set(0, 1, 0)

            rocket.mesh.add(gltf.scene)
            scene.add(rocket.mesh)

            Rocket.add(gltf.scene)
            scene.add(Rocket)
            sat_arry.push(Rocket)
            console.log(Rocket);
          },
          () => { console.log('success') },
        )

        break;
      case 82:
        gltfLoader.load('/models/saturn_rocket/scene.gltf',
          async (gltf) => {
            console.log('ahmad');
            gltf.scene.scale.set(0.05, 0.05, 0.05)
            gltf.scene.position.set(0, 1, 0)

            rocket.mesh.add(gltf.scene)
            scene.add(rocket.mesh)

            Rocket.add(gltf.scene)
            scene.add(Rocket)
            sat_arry.push(Rocket)
            console.log(Rocket);
          },
          () => { console.log('success') },
        )
        break;
    }
  };
}



rocket.engineType = 1
rocket.force_angle = Math.PI / 2;
rocket.rocketDiameter = 2;
rocket.rocket_mass = 2000
rocket.fuel_mass = 200000;
rocket.dragCoefficient = 0.75
rocket.liftCoeff = 1;
rocket.burnTime = 210;
rocket.exhaust_Area = 2;
rocket.exhaust_Pressure = 9;
rocket.numberOfEngines = 10
//rocket.stability_margin=10
rocket.check_engine()

/**
 * Animate
 */

const clock = new THREE.Clock()
let oldElapsedTime = 0;

const tick = async () => {

  setupKeyControls()

  const elapsedTime = clock.getElapsedTime()
  const delteTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;


  rocket.new_velocity(delteTime)
  rocket.new_position(delteTime)
  //rocket.stabilityVector()
  //rocket.new_angular_velocity(delteTime)

  //rocket.mesh.position.add(rocket.thrust().clone().multiplyScalar(delteTime));
  console.log(rocket)
  document.getElementById("rocket-speed").innerText =
    rocket.velocity.getMagnitude().toFixed(3) + " ms";
  document.getElementById("rocket-total-force").innerText =
    rocket.total_force.getMagnitude().toFixed(3) + " N";
  document.getElementById("rocket-total-mass").innerText =
    rocket.total_mass.toFixed(3) + " kg";
  document.getElementById("rocket-force_angle").innerText =
    rocket.force_angle.toFixed(3) + " Radian ";
  document.getElementById("rocket-fuel-mass").innerText =
    rocket.fuel_mass.toFixed(3) + " kg ";
  document.getElementById("rocket-mass").innerText =
    rocket.rocket_mass.toFixed(3) + " kg ";
  document.getElementById("rocket-engines").innerText =
    rocket.numberOfEngines.toFixed(3);
  if (rocket.engineType == 1) {
    document.getElementById("rocket-engine-type").innerText = "F-1";
  } else {
    document.getElementById("rocket-engine-type").innerText = "J-1";
  }

  //console.log(satellitee.position)

  camera.position.y = rocket.mesh.position.y
  controls.target.y = rocket.mesh.position.y
  controls.target.x = rocket.mesh.position.x
  controls.target.z = rocket.mesh.position.z

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)

}

tick()
export default parameters;



