import { normalize } from "gsap/gsap-core";
import { Vector3 } from 'three'

class Vector extends Vector3 {
    constructor(x, y, z) {
        super(x, y, z);
    }

    /*
   get angles 
   */
    getAngleXY() {
        return Math.atan2(this.y / this.x, 0);

    }
    getAngleXZ() {
        return Math.atan2(this.z / this.x, 0);


    }
    getAngleYZ() {
        return Math.atan(this.z / this.y, 0);

    }

    /*
    vector magnitude or length
    */
    getMagnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
   
    /*
    square the magnitude
    */
    squareMagnitude() {
        this.x * this.x + this.y * this.y + this.z * this.z
    }

} 
//export default Vector;