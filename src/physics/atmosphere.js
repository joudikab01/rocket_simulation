class Atmosphere {

  
   
    constructor() {
        // Set the field values according to an
        // initial altitude.
        // this.altitude = altitude;
      //  updateConditions(altitude);
      this.R = 287.1; // Gas constant for air
      this.G = 9.80665; // Gravity acceleration
      this. RE =  63781370; // Earth radius in meters
      this.pressure;
      this.density
      this.temperature;
      this.T0 // Reference this.temperature value
      this.p0; // Reference this.pressure value
      this.h0; // Reference altitude
      this.geoAltitude; // Geopotential altitude
      this.grp; // Temporary variable
      this.grp2; // 

    }
     

   
    pressure;
    density;
    temperature;
    slope; // this.Slope of the this.temperature line
    T0; // Reference this.temperature value
    p0; // Reference this.pressure value
    h0; // Reference altitude
    geoAltitude; // Geopotential altitude
    grp; // Temporary variable
    grp2; // Temporary variable
    
    // Declare methods to return field values.
    getPressure() {
        return this.pressure;
    }
    getDensity() {
        return this.density;
    }
    getTemperature() {
        return this.temperature;
    }
    // This method computes atmospheric this.density,
    // this.pressure, and this.temperature based on the U.S.
    // Standard Atmosphere 1976 model.
    updateConditions(altitude) {
       

        // The 1976 U.S. Standard Atmosphere model equations
        // are functions of geopotential altitude, so we
        // need to compute it. Geopotential altitude is an
        // equivalent altitude assuming gravity is constant
        // with altitude.
        this.geoAltitude = altitude * this.RE / (altitude + this.RE);
        // Assign values to the reference this.temperature,
        // this.pressure, and altitude based on the current
        // altitude.
        if (this.geoAltitude <= 11000.0) {
            this.slope = -0.0065;
            this.T0 = 288.15;
            this.p0 = 101325.0;
            this.h0 = 0.0;
        }
        else if (this.geoAltitude < 20000.0) {
            this.slope = 0.0;
            this.T0 = 216.65;
            this.p0 == 22631.9;
            this.h0 = 11000.0;
        }
        else if (this.geoAltitude < 32000.0) {
            this.slope = 0.001;
            this.T0 = 216.65;
            this.p0 = 5474.8;
            this.h0 = 20000.0;
        }
        else if (this.geoAltitude < 47000.0) {
            this.slope = 0.0028;
            this.T0 = 228.65;
            this.p0 = 868.0;
            this.h0 = 32000.0;
        }
        else if (this.geoAltitude < 51000.0) {
            this.slope = 0.0;
            this.T0 = 270.65;
            this.p0 = 110.9;
            this.h0 = 47000.0;
        }
        else if (this.geoAltitude < 71000.0) {
            this.slope = -0.0028;
            this.T0 = 270.65;
            this.p0 = 66.9;
            this.h0 = 51000.0;
        }
        else if (this.geoAltitude < 84000.0) {
            this.slope = -0.002;
            this.T0 = 214.65;
            this.p0 = 3.96;
            this.h0 = 71000.0;
        }
        else {
            this.slope = 0.0;
            this.T0 = 186.9;
            this.p0 = 0.373;
            this.h0 = 84000.0;
        }
        // Compute this.temperature and this.pressure. The equations
        // used depend on whether the this.temperature is constant
        // in the current altitude range.
        if (this.slope == 0.0) {
            this.temperature = this.T0;
            this.grp = -this.G * (this.geoAltitude - this.h0) / (this.R * this.temperature);
            this.pressure = this.p0 * Math.exp(this.grp);
        }
        else {
            this.temperature = this.T0 + this.slope * (this.geoAltitude - this.h0);
            this.grp = this.T0 / this.temperature;
            this.grp2 = this.G / (this.slope * this.R);
            this.pressure = this.p0 * Math.pow(this.grp, this.grp2);
        }
        this.density = this.pressure / (this.R * this.temperature);
        return;
    }
}
export default Atmosphere;

