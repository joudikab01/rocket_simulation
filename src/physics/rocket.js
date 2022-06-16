import Atmosphere from "./atmosphere";
//import vector from "./vector";
 import * as THREE from 'three'
import Parameters from "../script.js";
import { Vector3,Mesh } from "three";
//const {Parameters} = require('../script.js');
class Rocket {
    constructor(
        mesh,
        rocketDiameter,

        rocket_mass,
        fuel_mass,
        mass_flow_rate,

        burnTime,
        dragCoefficient,

        exhaust_Area,
        exhaust_Pressure,

        engineType,
        liftCoeff,

     
        altitude,

        thrustMagnitude,

        force_angle,
      
        numberOfEngines,
        //stability_margin
    ) {
        this.numberOfEngines=numberOfEngines
        this.force_angle=force_angle
        this.scale=0.01;
        this.mesh = mesh;
        this.liftCoeff = liftCoeff;             
        this.rocketDiameter = rocketDiameter;
       
        this.burnTime = burnTime;
        
        this.dragCoefficient = dragCoefficient;
        
        this.engineType = engineType;
        this.launch_altitude=altitude;
        this.altitude=altitude;

        this.exhaust_Velocity;
        this.exhaust_Area=exhaust_Area;
        this.exhaust_Pressure=exhaust_Pressure;

        this.velocity=new Vector3(0,0,0)
        this.acceleration= new Vector3(0,0,0);
        this.thrustMagnitude=thrustMagnitude;

        this.rocket_mass=rocket_mass;
        this.fuel_mass=fuel_mass;
        this.total_mass=this.total_mass;
        this.mass_flow_rate=mass_flow_rate;
        this.wvector=new Vector3(0,0,0);
        this.lvector=new Vector3(0,0,0);
        this.tvector=new Vector3(0,0,0);;
        this.dvector=new Vector3(0,0,0);
        this.total_force= new Vector3(0,0,0);
        this.altitude_status;
        
        this.atmosphere = new Atmosphere(this.altitude);

        //this.stability_margin = stability_margin
    
    }

    check_engine(){
       // type ==1 refrenced for engine f-1 
        if (this.engineType == 1) {
            this.p0 = 7000000;
            this.at = 0.672;
            this.ro = 5.2492;
            this.gamma = 1.1507;
            this.r4 = 8314;
            this.mw = 22.186;
            this.t0 = 3558.34;
            this.r = this.r4 / this.mw;
        }
        else{
            this.p0 = 5260700;
            this.at = 0.109;
            this.ro = 2.3693;
            this.gamma = 1.1455;
            this.r4 = 8314; 
            this.mw = 12.631;
            this.t0 = 3372.93;
            this.r = this.r4 / this.mw;
        }
        this.total_mass=this.fuel_mass+this.rocket_mass

    }
   
rocketArea(){
    return 0.25 * Math.PI * this.rocketDiameter * this.rocketDiameter;
}

    massFlowRate() {
        //console.log(this.r)
        this.mass_flow_rate=
             this.p0 *
             this.at *
             Math.sqrt( this.gamma / (this.t0 * this.r)
                 * Math.pow(2 / (this.gamma + 1),
                     ((this.gamma + 1) / (this.gamma - 1))  )) ; 
        
                     //console.log(this.massFlowRate())
        return this.mass_flow_rate
         
     }


     exhaustVelocity() { 
           this.exhaust_Velocity =Math.sqrt(
               this.t0 *
               this.r *
               2 * this.gamma *
               (1 -
                   Math.pow(
                       this.exhaust_Pressure / this.p0,
                       (this.gamma - 1) / this.gamma)
               ) / (this.mw * (this.gamma - 1))
           );
           return this.exhaust_Velocity;
       }



    weight() {
        let gravity = new Vector3(
            this.mesh.position.x,
            this.mesh.position.y + 6371000,
            this.mesh.position.z

        );
        
        let k = gravity.length(); 
        // if(k==637100)
        // {
        //     this.altitude_status=0;
        //     return this.wvector().multiplyScalar(0);
        // }
        this.altitude=k-6371000;
        //Math.sqrt(gravity.x * gravity.x + gravity.y * gravity.y + gravity.z * gravity.z)
        gravity.normalize();

        this.atmosphere.updateConditions(0);

        return this.wvector=gravity.multiplyScalar(this.scale*-1*6.673 * 5.972 * (1e13) * this.total_mass / (k * k));

    }

     

    drag() {
        this.dvector.setX(this.velocity.clone().normalize().x)
        this.dvector.setY(this.velocity.clone().normalize().y)
        this.dvector.setZ(this.velocity.clone().normalize().z)
        this.dvector.multiplyScalar(
            ((this.velocity.lengthSq() * -1) / 2) *
            this.dragCoefficient *
            this.atmosphere.density *
            this.rocketArea())
        
        return this.dvector.multiplyScalar(this.scale);
    }


    lift() {
        this.lvector.setX(this.velocity.clone().normalize().x)
        this.lvector.setY(this.velocity.clone().normalize().y)
        this.lvector.setZ(this.velocity.clone().normalize().z)
        this.lvector.multiplyScalar(
            ((this.velocity.lengthSq() * -1) / 2) *
            this.liftCoeff *
            this.atmosphere.density *
            this.rocketArea())
        this.lvector.applyAxisAngle(this.velocity,Math.PI/2)    
        return this.lvector.multiplyScalar(this.scale);
    }

    thrust() {
        if(this.fuel_mass==0) {this.tvector=new THREE.Vector3(0,0,0)
        return this.tvector}
        this.thrustMagnitude = this.massFlowRate() * this.exhaustVelocity() 
        +  (this.exhaust_Pressure - this.atmosphere.getPressure()) *-1* this.exhaust_Area;
        //Math.atan2(this.total_force.y / this.total_force.x, 0)
        this.tvector = new Vector3(
            Math.cos(this.force_angle) * this.thrustMagnitude,
            Math.sin(this.force_angle) * this.thrustMagnitude,
            0
        )
    //  if(this.altitude_status)
    //  {
    //     return this.tvector().multiplyScalar(0)
    //  }

        return this.tvector.multiplyScalar(this.scale);
    }


    total() {
        this.total_force= this.weight().clone().add(this.thrust().clone().multiplyScalar(this.numberOfEngines));
        this.total_force.add(this.lift())
          this.total_force.add(this.drag())
        return this.total_force;
    }

    // torque(){
    //     let t = this.lift().clone().multiplyScalar(this.stability_margin)
    // }

    new_acceleration(){
      return this.acceleration=this.total().multiplyScalar(this.scale/this.total_mass)
    }
     
    new_velocity(delta_time){
        this.velocity.add(this.new_acceleration().clone().multiplyScalar(delta_time))
         return this.velocity;
    }

    new_position(delta_time){
      this.mesh.position.add(this.velocity.clone().multiplyScalar(delta_time));
        // this.mesh.x+=this.velocity.clone().x*(delta_time)
        // this.mesh.y+=this.velocity.clone().y*(delta_time)
        // this.mesh.z+=this.velocity.clone().z*(delta_time)

      if(this.fuel_mass>=this.massFlowRate()*delta_time*this.numberOfEngines)
        {
        this.fuel_mass-= this.massFlowRate() * delta_time*this.numberOfEngines;
        }

       else
        {
            this.fuel_mass=0;
        }
        this.total_mass=this.fuel_mass+this.rocket_mass
        
        
    }  

}
export default Rocket;