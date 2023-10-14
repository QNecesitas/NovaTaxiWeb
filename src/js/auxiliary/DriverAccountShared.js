import Point from "../model/Point.js";
export default class DriverAccountShared{


  static getCookie(name) {
    let cookieArr = document.cookie.split(";");
    for (let i = 0; i < cookieArr.length; i++) {
      let cookiePair = cookieArr[i].split("=");
      if (name === cookiePair[0].trim()) {
        return decodeURIComponent(cookiePair[1]);
      }
    }
    return null;
  } 
 

  static getDriverEmail() {
    return this.getCookie("driverEmail");
  }

  static setDriverEmail(email) {
    document.cookie = "driverEmail=" + email;
  }


//Last location for camera map
  static setLastLocation(latitude, longitude) {
    document.cookie = "lastLatitudeDriver=" + latitude;
    document.cookie = "lastLongitudeDriver=" + longitude;
  }

  static getLastLocation() {
    let latitude = this.getCookie("lastLatitudeDriver");
    let longitude = this.getCookie("lastLongitudDriver");
    if(latitude === null || longitude === null){

      return new Point(
        "-76.2593",
        "20.886953"
      )

    }else{
      return new Point(longitude, latitude)
    }

  }





}
