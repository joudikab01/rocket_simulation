import Atmosphere from "./atmosphere";
//import vector from "./vector";
import * as THREE from 'three'
import Parameters from "../script.js";
import { Vector3, Mesh } from "three";
//const {Parameters} = require('../script.js');
class Rocket {
    constructor(
        mesh,
        rocketDiameter,

        rocket_mass,
        fuel_mass,
        mass_flow_rate,


        drag_Coefficient,
        lift_Coefficient,

        exhaust_Area,
        exhaust_Pressure,

        engineType,


        altitude,

        thrustMagnitude,

        force_angle,

        numberOfEngines,
        //stability_margin
    ) {
        this.numberOfEngines = 1
        this.force_angle = force_angle
        this.scale = 1;
        this.mesh = mesh;
        this.rocketDiameter = rocketDiameter;

        this.engineType = engineType;


        this.lift_Coefficient = lift_Coefficient;
        this.drag_Coefficient = drag_Coefficient;

        this.altitude = altitude;
        this.launch_altitude = 0;
        this.total_altitude;
        this.sea_level_altitude = 6371001;

        this.exhaust_Velocity;
        this.exhaust_Area = exhaust_Area;
        this.exhaust_Pressure = exhaust_Pressure;

        this.velocity = new Vector3(0, 0, 0)
        this.acceleration = new Vector3(0, 0, 0);
        this.thrustMagnitude = thrustMagnitude;

        this.rocket_mass = rocket_mass;
        this.fuel_mass = fuel_mass;
        this.total_mass = this.total_mass;
        this.mass_flow_rate = mass_flow_rate;
        this.wvector = new Vector3(0, 0, 0);
        this.lvector = new Vector3(0, 0, 0);
        this.tvector = new Vector3(0, 0, 0);;
        this.dvector = new Vector3(0, 0, 0);
        this.total_force = new Vector3(0, 0, 0);
        this.altitude_status;

        this.thrust_angle = Math.PI / 2;

        this.atmosphere = new Atmosphere(this.altitude);

        //this.stability_margin = stability_margin

    }
    check_engine() {
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
            this.fuel_mass = 200000
            this.rocket_mass = 100
            this.exhaust_Pressure = 96526.6
            this.rocketDiameter

        }
        else if (this.engineType == 2) {
            this.p0 = 5260700;
            this.at = 0.109;
            this.ro = 2.3693;
            this.gamma = 1.1455;
            this.r4 = 8314;
            this.mw = 12.631;
            this.t0 = 3372.93;
            this.r = this.r4 / this.mw;
            this.exhaust_Pressure = 96526.6
            this.fuel_mass = 30000000
            this.rocket_mass = 300
            this.rocketDiameter

        }

        this.total_mass = this.fuel_mass + this.rocket_mass

    }
    rocketArea() {
        return 0.25 * Math.PI * this.rocketDiameter * this.rocketDiameter;
    }
    massFlowRate() {
        //console.log(this.r)
        if (Parameters.mass_flow_rate == -1) {
            this.mass_flow_rate =
                this.p0 *
                this.at *
                Math.sqrt(this.gamma / (this.t0 * this.r)
                    * Math.pow(2 / (this.gamma + 1),
                        ((this.gamma + 1) / (this.gamma - 1))));

            //console.log(this.massFlowRate())
            return this.mass_flow_rate
        }

        return this.mass_flow_rate = Parameters.mass_flow_rate

    }
    exhaustVelocity() {
        if (Parameters.exhaust_Velocity == -1) {
            this.exhaust_Velocity = Math.sqrt(
                this.t0 *
                this.r4 *
                2 * this.gamma *
                (1 -
                    (Math.pow(
                        this.exhaust_Pressure / this.p0,
                        (this.gamma - 1) / this.gamma))
                ) / (this.mw * (this.gamma - 1))
            );
            return this.exhaust_Velocity;
        }

        return this.exhaust_Velocity = Parameters.exhaust_Velocity;
    }
    get_total_force_angle() {

        return this.velocity.angleTo(new Vector3(1, 0, 0))

        //  if(this.total_force.y==0&& this.total_force.x==0) return 0 ;

        //  return Math.atan2(this.total_force.y / this.total_force.x, 0)
    }
    weight() {
        let gravity = new Vector3(
            this.mesh.position.x,
            this.mesh.position.y + this.sea_level_altitude + this.launch_altitude,
            this.mesh.position.z

        );

        let k = gravity.length();
        // if(k<=this.sea_level_altitude+this.launch_altitude)
        //            this.altitude_status=0;


        // else  this.altitude_status=1;
        this.altitude = k - this.sea_level_altitude;

        gravity.normalize();

        this.atmosphere.updateConditions(this.altitude);

        return this.wvector = gravity.multiplyScalar(this.scale * -1 * 6.673 * 5.972 * (1e13) * this.total_mass / (k * k));

    }
    drag() {
        let test_vector = this.mesh.position.clone()
        test_vector.y += this.sea_level_altitude + this.launch_altitude
        let k = test_vector.length();
        if (k < this.sea_level_altitude + this.launch_altitude + 10) {
            return this.dvector.multiplyScalar(0);
        }
        this.dvector.setX(this.velocity.clone().normalize().x)
        this.dvector.setY(this.velocity.clone().normalize().y)
        this.dvector.setZ(this.velocity.clone().normalize().z)
        this.dvector.multiplyScalar(
            ((this.velocity.lengthSq() * -1) / 2) *
            this.drag_Coefficient *
            this.atmosphere.density *
            this.rocketArea())
        return this.dvector.multiplyScalar(this.scale);
    }
    lift() {
        let test_vector = this.mesh.position.clone()
        test_vector.y += this.sea_level_altitude + this.launch_altitude
        let k = test_vector.length();
        if (k < this.sea_level_altitude + this.launch_altitude + 10) {
            return this.lvector.multiplyScalar(0);
        }
        this.lvector.setX(this.velocity.clone().normalize().x)
        this.lvector.setY(this.velocity.clone().normalize().y)
        this.lvector.setZ(this.velocity.clone().normalize().z)
        this.lvector.multiplyScalar(
            ((this.velocity.lengthSq() * -1) / 2) *
            this.lift_Coefficient *
            this.atmosphere.density *
            this.rocketArea())
        this.lvector.applyAxisAngle(this.velocity.clone().normalize(), Math.PI / 2)
        // console.log(this.lvector.angleTo(this.velocity))   
        return this.lvector.multiplyScalar(this.scale);
    }
    thrust() {
        if (this.fuel_mass == 0) {
            this.tvector = new THREE.Vector3(0, 0, 0)
            return this.tvector
        }
        if (Parameters.thrustMagnitude == -1) {
            this.thrustMagnitude = this.massFlowRate() * this.exhaustVelocity()
                + (this.exhaust_Pressure - this.atmosphere.getPressure()) * this.exhaust_Area;
        }
        else this.thrustMagnitude = Parameters.thrustMagnitude;
        //Math.atan2(this.total_force.y / this.total_force.x, 0)
        this.tvector = new Vector3(
            Math.cos(this.thrust_angle) * this.thrustMagnitude,
            Math.sin(this.thrust_angle) * this.thrustMagnitude,
            0
        )

        //number(Math.cos(this.force_angle).toFixed(10))
        //  if(this.altitude_status)
        //  {
        //     return this.tvector().multiplyScalar(0)
        //  }

        return this.tvector.multiplyScalar(this.scale);
    }
    total() {
        this.total_force = this.weight().clone().add(this.thrust().clone().multiplyScalar(this.numberOfEngines));
        //this.total_force.add(this.lift())
        this.total_force.add(this.drag())
        return this.total_force;
    }
    new_acceleration() {
        return this.acceleration = this.total().clone().multiplyScalar(this.scale / this.total_mass)
    }
    new_velocity(delta_time) {
        this.velocity.add(this.new_acceleration().clone().multiplyScalar(delta_time))
        return this.velocity;
    }
    new_position(delta_time) {
        let test_vector = this.mesh.position.clone().add(this.velocity.clone().multiplyScalar(delta_time))

        test_vector.y += this.sea_level_altitude + this.launch_altitude


        let k = test_vector.length();
        if (k < this.sea_level_altitude + this.launch_altitude) { this.altitude_status = 0; }


        else {
            this.altitude_status = 1;

            this.mesh.position.add(this.velocity.clone().multiplyScalar(delta_time))


        }
        if (this.fuel_mass >= this.massFlowRate() * delta_time * this.numberOfEngines) {
            this.fuel_mass -= this.massFlowRate() * delta_time * this.numberOfEngines;
        }

        else {
            this.fuel_mass = 0;
        }
        this.total_mass = this.fuel_mass + this.rocket_mass


    }

}
export default Rocket;