import Point from "../model/Point.js";

export default class UserAccountShared{


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


  static getUserEmail() {
    return this.getCookie("userEmail");
  }

  static setUserEmail(email) {
    document.cookie = "userEmail=" + email;
  }


//Last location for camera map
  static setLastLocation(point) {
    document.cookie = "lastLatitudeUser=" + point.latitude;
    document.cookie = "lastLongitudeUser=" + point.longitude;
  }

  static getLastLocation() {
    let latitude = this.getCookie("lastLatitudeUser");
    let longitude = this.getCookie("lastLongitudeUser");
    if(latitude === null || longitude === null){

      return new Point(
        "-76.2593",
        "20.886953"
      )

    }else{
      return new Point(longitude, latitude)
    }

  }


//Last petition for if is closed the app in await
  static setLastPetition(petitionTimeInMills) {
    document.cookie = "petitionInMills=" + petitionTimeInMills;
  }

  static getLastPetition() {
    return document.cookie = this.getCookie("petitionInMills");
  }


//Last petition for if is closed the app without ranking
  static setIsRatingInAwait(isRankingAwait) {
    document.cookie = "isRankingAwait=" + isRankingAwait;
  }

  static getIsRatingInAwait() {
    return this.getCookie("isRankingAwait");
  }
 

//Last driver petition
  static setLastDriver(driver) {
    document.cookie = "lastDriver=" + driver;
  }

  static getLastDriver() {
    return this.getCookie("lastDriver");
  }


}
