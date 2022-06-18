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



// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
const rocket = new Rocket()
const gui = new dat.GUI();


rocket.engineType = 1
rocket.force_angle = Math.PI / 2;
rocket.rocketDiameter = 2;
rocket.rocket_mass = 200
rocket.fuel_mass = 20000;
rocket.drag_Coefficient = 0.75
rocket.lift_Coefficient = 1;
rocket.burnTime = 210;

rocket.exhaust_Area = 2;
rocket.exhaust_Pressure = 9;
rocket.numberOfEngines = 1

rocket.check_engine()


/**
 * Base
 */

const Parameters = {

  start_simulation: false,


  drag_Coefficient: -1,
  lift_Coefficient: -1,

  rocket_mass: rocket.rocket_mass,
  fuel_mass: rocket.fuel_mass,
  rocketDiameter: -1,
  numberOfEngines: 1,

  launch_altitude: -1,

  thrustMagnitude: -1,

  //general engine proprties--------------------
  exhaust_Velocity: -1,
  mass_flow_rate: -1,
  exhaust_Area: rocket.exhaust_Area,
  exhaust_Pressure: rocket.exhaust_Pressure,

  //engine properties ------------------

  p0: 7000000,
  at: 0.672,
  ro: 5.249,
  gamma: 1.1507,
  r4: 8314,
  mw: 22.186,
  t0: 3558.34,


  type: 0,
  types: {
    // f-1 engine refrenced by 1
    firstengine() {
      Parameters.type = 1;
      rocket.engineType = 1;
      rocket.check_engine()
    },

    secondengine() {
      Parameters.type = 2;
      rocket.engineType = Parameters.type;
      rocket.check_engine()
    }

  }

}


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
    gltf.scene.position.set(0.1, -0.7, 0.1)
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
const Sky3Texture = new THREE.TextureLoader().load('/textures/a.jpg');
const Base = new THREE.TextureLoader().load('/textures/base.jpg');
const SkyTexture = new THREE.TextureLoader().load('/textures/ff.jpg');
const Sky1Texture = new THREE.TextureLoader().load('/textures/sky2.jpg');
const Sky2Texture = new THREE.TextureLoader().load('/textures/space.jpg');
const earthTexture = new THREE.TextureLoader().load('/textures/earth.jpg');
const SpaceTexture = new THREE.TextureLoader().load('/textures/space1.jpg');
scene.background = SpaceTexture;



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
  map: Sky2Texture,
  transparent: true,
  side: THREE.BackSide,
  opacity: 0.55,
  shading: THREE.SmoothShading,
  // color: 0xaaaaaa,
  //  blending : THREE.AdditiveBlending,
  //depthTest: false
});

var mesh1 = new SceneUtils.createMultiMaterialObject(new THREE.SphereGeometry(40, 32, 32), [globeMaterialf, globeMaterialb]);
//log.console('aaaaa');
scene.add(mesh1)

//Atmosphere
var AtmosphereF = new THREE.MeshBasicMaterial({
  map: Sky2Texture,
  shininess: 40,
  transparent: true,
  side: THREE.FrontSide,
  opacity: 0.3,
  shading: THREE.SmoothShading,
  color: 0xaaaaaa,
  blending: THREE.AdditiveBlending
});
var AtmosphereB = new THREE.MeshBasicMaterial({
  map: Sky2Texture,
  transparent: true,
  side: THREE.BackSide,
  opacity: 0.55,
  shading: THREE.SmoothShading,
  // color: 0xaaaaaa,
  //blending : THREE.AdditiveBlending,
  //depthTest: false
});

var Atmosphere1 = new SceneUtils.createMultiMaterialObject(new THREE.SphereGeometry(35, 32, 32), [AtmosphereF, AtmosphereB]);
//log.console('aaaaa');
scene.add(Atmosphere1)


// Cloud
var CloudF = new THREE.MeshBasicMaterial({
  map: Sky1Texture,
  shininess: 40,
  transparent: true,
  side: THREE.FrontSide,
  opacity: 0.3,
  shading: THREE.SmoothShading,
  color: 0xaaaaaa,
  blending: THREE.AdditiveBlending
});
var CloudB = new THREE.MeshBasicMaterial({
  map: Sky1Texture,
  transparent: true,
  side: THREE.BackSide,
  opacity: 0.55,
  shading: THREE.SmoothShading,
  //color: 0xaaaaaa,
  //blending : THREE.AdditiveBlending,
  //depthTest: false
});

var Cloud1 = new SceneUtils.createMultiMaterialObject(new THREE.SphereGeometry(30, 32, 32), [CloudF, CloudB]);
//log.console('aaaaa');
scene.add(Cloud1)


//sky
var SkyF = new THREE.MeshBasicMaterial({
  map: SkyTexture,
  shininess: 40,
  transparent: true,
  side: THREE.FrontSide,
  opacity: 0.3,
  shading: THREE.SmoothShading,
  color: 0xaaaaaa,
  blending: THREE.AdditiveBlending
});
var SkyB = new THREE.MeshBasicMaterial({
  map: SkyTexture,
  transparent: true,
  side: THREE.BackSide,
  opacity: 0.55,
  shading: THREE.SmoothShading,
  // color: 0xaaaaaa,
  // blending : THREE.AdditiveBlending,
  //depthTest: false
});

var Sky1 = new SceneUtils.createMultiMaterialObject(new THREE.SphereGeometry(19.999, 32, 32), [SkyF, SkyB]);
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

const Base11 = new THREE.Mesh(
  new THREE.CircleGeometry(5, 32, 32),
  new THREE.MeshBasicMaterial({
    side: THREE.BackSide,
    map: Base,
  })
);
// scene.add(Base11);

land.rotation.x = Math.PI / 1.9;
land.position.z = 0
land.position.x = 0
land.position.y = -1.0

Base11.rotation.x = Math.PI / 1.9;
Base11.position.z = 0
Base11.position.x = 0
Base11.position.y = 0.1


const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}


function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffff })
  const star = new THREE.Mesh(geometry, material);
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  let a = Math.abs(x);
  let b = Math.abs(y);
  if ((a && b) > 40)
    star.position.set(x, y, z);
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


const rocket_specs = gui.addFolder("rocket_specs");
const engine_attributes = gui.addFolder("engine_attributes");
const more_engine_specific = engine_attributes.addFolder("more_engine_specific");
const coefficients = gui.addFolder("coefficeients")
const engine_types = gui.addFolder("engine_types")

gui.add(Parameters, 'start_simulation')


engine_attributes.open();


rocket_specs
  .add(Parameters, "rocket_mass")
  .onChange(() => {
    rocket.rocket_mass = Parameters.rocket_mass;
  });

rocket_specs
  .add(Parameters, "fuel_mass")
  .onChange(() => {
    rocket.fuel_mass = Parameters.fuel_mass;
  });

rocket_specs
  .add(Parameters, "rocketDiameter")
  .onChange(() => {
    rocket.rocketDiameter = Parameters.rocketDiameter;
  });

rocket_specs
  .add(Parameters, "numberOfEngines").min(0)
  .onChange(() => {
    rocket.numberOfEngines = Parameters.numberOfEngines;
  });




//general engine proprties--------------------

engine_attributes
  .add(Parameters, "mass_flow_rate").min(0)

engine_attributes
  .add(Parameters, "exhaust_Velocity").min(0)

engine_attributes
  .add(Parameters, "exhaust_Area")
  .onChange(() => {
    rocket.exhaust_Area = Parameters.exhaust_Area;
  });

engine_attributes
  .add(Parameters, "exhaust_Pressure")
  .onChange(() => {
    rocket.exhaust_Pressure = Parameters.exhaust_Pressure;
  });
//engine_attributes.add(Parameters,"thrustMagnitude")


more_engine_specific
  .add(Parameters, "p0").min(4000000).max(10000000)
  .onChange(() => {
    rocket.p0 = Parameters.p0;
  });

more_engine_specific
  .add(Parameters, "at").min(0.1).max(0.9).step(0.50)
  .onChange(() => {
    rocket.at = Parameters.at;
  });

more_engine_specific
  .add(Parameters, "ro").min(2).max(6).step(0.75)
  .onChange(() => {
    rocket.ro = Parameters.ro;
  });

more_engine_specific
  .add(Parameters, "gamma").min(1.100).max(1.5).step(0.09)
  .onChange(() => {
    rocket.gamma = Parameters.gamma;
  });

more_engine_specific
  .add(Parameters, "mw").min(10).max(25).step(2)
  .onChange(() => {
    rocket.mw = Parameters.mw;
  });

more_engine_specific
  .add(Parameters, "t0").min(3000).max(4000).step(100)
  .onChange(() => {
    rocket.t0 = Parameters.t0;
  });


//coefficients-----------
coefficients
  .add(Parameters, "drag_Coefficient").min(0).max(2).step(0.25)
  .onChange(() => {
    rocket.drag_Coefficient = Parameters.drag_Coefficient;
  });

coefficients
  .add(Parameters, "lift_Coefficient").min(0).max(2).step(0.25)
  .onChange(() => {
    rocket.lift_Coefficient = Parameters.lift_Coefficient;
  });

//engine_types -----------------

engine_types.add(Parameters.types, "firstengine")
engine_types.add(Parameters.types, "secondengine")

export default Parameters;

function setupKeyControls() {

  document.onkeydown = function (e) {
    switch (e.keyCode) {
      case 37: {
        rocket.thrust_angle += 0.1;
        rocket.mesh.rotation.z+=0.01
        break;
      }

      case 38:
        //   thrustMagnitude.v += 0.01;
        break;
      case 39:
        {
          rocket.thrust_angle -= 0.1;
          rocket.mesh.rotation.z-=0.01

          break;
        }


      case 40:
        //thrustMagnitude.v -= 0.01;
        break;
      case 83:
        gltfLoader.load('/models/spacex/scene.gltf',
          async (gltf) => {
            console.log('ahmad');
            gltf.scene.scale.set(0.0019, 0.0019, 0.0019)
            gltf.scene.position.set(0, 0, 0)

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
            gltf.scene.position.set(0, 0, 0)

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


/**
 * Animate
 */

const clock = new THREE.Clock()
let oldElapsedTime = 0;

const tick = async () => {

  setupKeyControls()

  const elapsedTime = clock.getElapsedTime()
  // const delteTime = elapsedTime - oldElapsedTime;
  // oldElapsedTime = elapsedTime;
  const delteTime = 0.01


  if (Parameters.start_simulation) {
    rocket.new_velocity(delteTime)
    rocket.new_position(delteTime)
    console.log(rocket)
  }
  //console.log(rocket.lvector.angleTo(rocket.velocity))  


  document.getElementById("rocket-speed").innerText =
    rocket.velocity.length().toFixed(0) * 36 + " Km/h";
  document.getElementById("rocket-total-force").innerText =
    rocket.total_force.length().toFixed(3) + " N";
  document.getElementById("rocket-total-mass").innerText =
    rocket.total_mass.toFixed(3) + " kg";
  document.getElementById("rocket-force_angle").innerText =
    rocket.thrust_angle.toFixed(3) + " Radian ";
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

  camera.position.y = rocket.mesh.position.y + 4
  camera.position.x = rocket.mesh.position.x
  //camera.position.z = rocket.mesh.position.z
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



