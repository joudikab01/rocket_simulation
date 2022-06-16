class Vector3{
    // normal =0
    constructor(x,y,z){
        this.x =x
        this.y =y
        this.z =z
        this.magnitude=this.calcMagnitude()
        this.magnitudeSq =this.calcMagnitudeSq()    
    }

    inverse() {
        return new Vector3(-this.x, -this.y, -this.z);
    }

    equals(vec) {
        if ((this.x == vec.x) && (this.y == vec.y) && (this.z == vec.z))
        {
            return true;
        }
        return false;
    }

    //جمع شعاعين
    add(vec) {
        return new Vector3(this.x + vec.x, this.y + vec.y, this.z + vec.z);
    }

    //طرح شعاعين
    sub(vec) {
        return new Vector3(this.x - vec.x, this.y - vec.y, this.z - vec.z);
    }

     //ضرب شعاع بعدد
     scalarProduct(n) {
        return new Vector3(n * this.x, n * this.y, n * this.z);
    }

    //اذا الناتج موجب فالشعاعين بنفس الجهة
    //اذا الناتج سالب فالشعاعين بعكس الجهة
    //اذا الناتج صفر فالشعاعين متعامدين 
    dotProduct(vec) {
        return     (this.x * vec.x) + (this.y * vec.y) + (this.z * vec.z)  ;
    }
    
    crossProduct(vec) {
        var result = new Vector3();
        result.x = (this.y * vec.z) - (this.z * vec.y);
        result.y = (this.x * vec.z) - (this.z * vec.x);
        result.z = (this.x * vec.y) - (this.y * vec.x);
        return result;
    }

    //طويلة الشعاع
    calcMagnitude() {
        return Math.sqrt(this.dotProduct(this));

        // this.magnitude = sqrt(this.dotProduct(this));
        ///////////////instead of////////////////
        //this.magnitude = sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z)); 
    }
       //مربع الطويلة
       calcMagnitudeSq() {
        return this.dotProduct(this);
    }
       //الشعاع الواحدي او جهة الشعاع
       calcNormalizedVector() {
        // (this.x * vec.x) + (this.y * vec.y) + (this.z * vec.z)
        return this.scalarProduct((1 / this.magnitude));
        // return this.scalarProduct((1 / this.magnitude));
        // return new Vector3 (     this.x.scalarProduct( (1 / this.magnitude) ), this.y.scalarProduct( (1 / this.magnitude) ) ,this.y.scalarProduct( (1 / this.magnitude) ) )        ;
    }
    
    RadAngleWith(vec) {
        let m = this.dotProduct(vec);
        let n = this.magnitude * vec.magnitude;
        return Math.acos (m/n );  // حطيت round  مشان يظبط وما يرجع  nan واكيد غلط 
    }

    DegAngleWith(vec) {
        var m = this.dotProduct(vec);
        var n = this.magnitude * vec.magnitude;
        var temp = Math.acos ((m / n));
        return temp * (180 / Math.PI);    
    }

    //مسقط شعاع
    projectOnto(vec) {
        //اسقاط اي على بي
        //project_b(A) = ((A dot B)/B^2) scalar B
        //الناتج شعاع
        var dot = this.dotProduct(vec);
        return  vec.scalarProduct(dot / vec.magnitudeSq);
    }

    //العامود على شعاع
    peripendicular(vec) {
        return this.sub(this.projectOnto(vec));
    }

    //بتوقع نستعملو بالتصادم
    reflection(normal) {
        var p = this.projectOnto(normal);
        return this.sub(-2 * p);
    }

       
// }
//  let v = new Vector3 (2,2,2);
// // console.log(v);
//  let v2 = new Vector3(2.23,4,5);
//  v.normal = v.calcNormalizedVector()
//  console.log(v.normal);
}
export {Vector3}