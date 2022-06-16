

import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap'
import * as dat from 'dat.gui'
import { Vector3 } from './vectors';
import { Matrix3, Mesh } from 'three'
import Rocket from './physics/rocket'


/**
 * Base
 */
const parameters = {
    color: 0xff0000,
    spin: () =>
    {
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
const satellitee= new THREE.Mesh();
rocket.mesh = new THREE.Mesh()

const gltfLoader=new GLTFLoader()
//  gltfLoader.load('/models/Duck/glTF/Duck.gltf',
  gltfLoader.load('/models/saturn_rocket/scene.gltf',
  async (gltf)=>
 {
 console.log('jj');
     gltf.scene.scale.set(0.05,0.05,0.05)
     gltf.scene.position.set(0,0,0) 
     rocket.mesh.add(gltf.scene)
     scene.add(rocket.mesh)
     sat_arry.push(rocket.mesh)
     //console.log(satellitee);
    
     
     //satellitee.children[0].position
    },
 ()=>{console.log('success')},
     )
const image = new Image()
const texture= new THREE.Texture(image);
image.onload=()=>{texture.needsUpdate=true}
image.src='/textures/a.jpg';
//const AxesHelper =new THREE.AxesHelper(100)
//scene.add(AxesHelper)
//
//  gltfLoader.position.x=3
var light = new THREE.AmbientLight(0xffffff);
scene.add(light);

//const geometry = new THREE.PlaneGeometry( 19, 19);
//const material = new THREE.MeshBasicMaterial( {map:texture,side: THREE.DoubleSide} );
//const mesh = new THREE.Mesh(geometry, material)
//scene.add(mesh)
//mesh.rotation.y = Math.PI / 1.9;
//mesh.rotation.x = Math.PI / 1.9;
//mesh.position.z = 0
//mesh.position.x = 0
//mesh.position.y = 0
//mesh.scale.set(2,2,2)
//
//
//const cube = new THREE.BoxBufferGeometry( 10, 10,10 );
//const materialCube = new THREE.MeshBasicMaterial( {color:'#87CEEB',side: THREE.DoubleSide} );
//const meshCube = new THREE.Mesh(cube, materialCube)
//scene.add(meshCube)
// meshCube.scale.x=100
// meshCube.scale.y=100
// meshCube.scale.z=100
//meshCube.scale.set(5,5,5);
/**
 * Sizes
 */
const SpaceTexture =new THREE.TextureLoader().load('/textures/space1.jpg');
scene.background=SpaceTexture;


const earthTexture =new THREE.TextureLoader().load('/textures/earth.jpg');


const earth =new THREE.Mesh(

new THREE.SphereGeometry(40,32,32),
new THREE.MeshBasicMaterial({
  side: THREE.DoubleSide,
map:earthTexture,opacity:0,
 
})

);
scene.add(earth);

const SkyTexture =new THREE.TextureLoader().load('/textures/ff.jpg');


const sky =new THREE.Mesh(

new THREE.SphereGeometry(19.999,32,32),
new THREE.MeshBasicMaterial({
map:SkyTexture,side: THREE.DoubleSide,
opacity:0,
 
})

);
scene.add(sky);

const Sky1Texture =new THREE.TextureLoader().load('/textures/sky2.jpg');


const sky1 =new THREE.Mesh(

new THREE.SphereGeometry(30,32,32),
new THREE.MeshBasicMaterial({
map:Sky1Texture,side: THREE.DoubleSide,opacity:0,
 
})

);
scene.add(sky1);

const Sky2Texture =new THREE.TextureLoader().load('/textures/space.jpg');


const sky2 =new THREE.Mesh(

new THREE.SphereGeometry(35,32,32),
new THREE.MeshBasicMaterial({
map:Sky2Texture,side: THREE.DoubleSide,opacity:0,
 
})

);
scene.add(sky2);

const Sky3Texture =new THREE.TextureLoader().load('/textures/a.jpg');
const land =new THREE.Mesh(

    new THREE.CircleGeometry(19.9,32,32),
    new THREE.MeshBasicMaterial({
   side: THREE.DoubleSide,opacity:0,
    map:Sky3Texture,
     
    })
    
    );
    scene.add(land);
    
    land.rotation.x = Math.PI / 1.9;
    land.position.z = 0
    land.position.x = 0
    land.position.y = 0
  

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
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
// controls.enableDamping = true

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
    .onChange(() =>
    {
        material.color.set(parameters.color)
    })
    
gui.add(parameters, 'spin')


function setupKeyControls() {
  
    document.onkeydown = function(e) {
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
      }
    };
  }
 


rocket.engineType=1
rocket.force_angle=Math.PI/2;
rocket.rocketDiameter=2;
rocket.rocket_mass=200
rocket.fuel_mass=20000;
rocket.dragCoefficient=0.75
rocket.liftCoeff=1;
rocket.burnTime=210;
rocket.exhaust_Area=2;
rocket.exhaust_Pressure=9;
rocket.numberOfEngines=1
rocket.check_engine()

/**
 * Animate
 */

const clock = new THREE.Clock()
let oldElapsedTime = 0;

const tick = async() =>
{

    setupKeyControls()

    const elapsedTime = clock.getElapsedTime()
    const delteTime = elapsedTime - oldElapsedTime;    
    oldElapsedTime = elapsedTime;

    
    rocket.new_velocity(delteTime)
    rocket.new_position(delteTime)
   
    //rocket.mesh.position.add(rocket.thrust().clone().multiplyScalar(delteTime));
    
     console.log(rocket)
     //console.log(satellitee.position)
    // Update controls
    controls.update()
    
    // Render
    renderer.render(scene, camera)
    
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)

}

tick()
export default parameters;



