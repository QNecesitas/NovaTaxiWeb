import AuxiliaryDataSourceNetwork from "../network/AuxiliaryDataSourceNetwork";
import DriverDataSourceNetwork from "../network/DriverDataSourceNetwork";
import PricesDataSourceNetwork from "../network/PricesDataSourceNetwork";
import TripsDataSourceNetwork from "../network/TripsDataSourceNetwork";

export default class ViewModelMapHomeUser {

  listDrivers;
  latitudeGPS;
  longitudeGPS;
  listVehicles;
  lastDistance = 0.0;
  latitudeOrigin;
  longitudeOrigin;
  latitudeDestiny;
  longitudeDestiny;
  pointOrigin;
  pointDestiny;
  activateAnimation = false;
  isNecessaryCamera;

  auxiliaryDataSource = new AuxiliaryDataSourceNetwork();
  driverDataSource = DriverDataSourceNetwork();
  pricesDataSource = PricesDataSourceNetwork();
  tripsDataSource = TripsDataSourceNetwork();


  //Get drivers
  getDriversAll(stateObserver, responseObserver){
    this.driverDataSource.getDriver(stateObserver, responseObserver);
  }

  filterDriver(responseObserver,alDriver) {
    if (this.latitudeGPS !== null && this.longitudeGPS !== null) {
      let alResult = alDriver.filter(function (it) {
        return it.maxDist > this.calculateDist(
          this.latitudeGPS,
          this.longitudeGPS,
          it.latitude,
          it.longitude
        ) || it.maxDist === 0;
      });
      this.listDrivers = alResult;
      responseObserver(alResult);
    }
  }

  calculateDist(latUser, longUser, latCar, longCar) {
    const radiusEarth = 6371; // Earth's radius in km
    const lat1Rad = this.toRadians(latUser);
    const lon1Rad = this.toRadians(longUser);
    const lat2Rad = this.toRadians(latCar);
    const lon2Rad = this.toRadians(longCar);
    const distanceLat = lat2Rad - lat1Rad;
    const distanceLon = lon2Rad - lon1Rad;
    const a = Math.pow(Math.sin(distanceLat / 2), 2) + Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.pow(Math.sin(distanceLon / 2), 2);
    const c = 2 * Math.asin(Math.sqrt(a));
    return radiusEarth * c;
  }

  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }



  //Setters
  setLatitudeClient(lat){
    this.latitudeOrigin = lat;
  }

  setLongitudeClient(long){
    this.longitudeOrigin = long;
  }


}
