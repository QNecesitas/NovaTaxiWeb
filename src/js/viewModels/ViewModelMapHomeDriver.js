import AuxiliaryDataSourceNetwork from "../network/AuxiliaryDataSourceNetwork.js";
import DriverDataSourceNetwork from "../network/DriverDataSourceNetwork.js";
import PricesDataSourceNetwork from "../network/PricesDataSourceNetwork.js";
import TripsDataSourceNetwork from "../network/TripsDataSourceNetwork.js";
import Point from "../model/Point.js";
import Vehicle from "../model/Vehicle.js";
import Prices from "../model/Prices.js";
import DriverAccountShared from "../auxiliary/DriverAccountShared.js";

export default class ViewModelMapHomeDriver {

  driverDataSource = new DriverDataSourceNetwork();
  tripsDataSource = new TripsDataSourceNetwork();

  isNecessaryCamera;
  listDriver;
  latitudeGps;
  longitudeGps;
  isSharedLocation;
  listTrip;
  lastTripSelected;


  //Setters
  setIsNecessaryCamera(isNecessary){
    this.isNecessaryCamera = isNecessary;
  }

  setIsShare(isShare){
    this.isSharedLocation = isShare;
  }

  setLatitudeGPS(latitude){
    this.latitudeGps = latitude;
  }

  setLongitudeGPS(longitude){
    this.longitudeGps = longitude;
  }

  setLastTripSelected(lastTripSelected){
    this.lastTripSelected = lastTripSelected;
  }




  //Main routine
  async startMainCoroutine(stateDriver, responseDriver, stateDriverLocation, stateAllTripObserver, responseAllTripObserver){
    while(true){
      this.getNearDrivers(stateDriver, responseDriver);
      if(this.isSharedLocation){
        this.getAllTrips(stateAllTripObserver,responseAllTripObserver);
        this.updateDriverLocation(stateDriverLocation);
      }
      await new Promise(resolve => setTimeout(resolve, 15000));
    }
  }

  getNearDrivers(stateDriver, responseDriver){
    this.driverDataSource.getDriver(stateDriver, responseDriver);
  }

  filterDriver(listDriverObserver,alDriver){
    if(this.latitudeGps && this.longitudeGps){
      let alResult = alDriver.filter(it =>
        20 > this.calculateDist(
          this.latitudeGps,
          this.longitudeGps,
          it.latitude,
          it.longitude
        ));
      listDriverObserver(alResult);
    }
  }




  //Routing
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

  updateDriverLocation(stateObserver){
    if(this.latitudeGps && this.longitudeGps){
      if(DriverAccountShared.getDriverEmail()){
        this.driverDataSource.updateDriverLocation(
          stateObserver,
          DriverAccountShared.getDriverEmail(),
          this.latitudeGps,
          this.longitudeGps
        );
      }
    }
  }

  updateDriverLocationStop(stateDriverLocationStop){
    if(DriverAccountShared.getDriverEmail()){
      this.driverDataSource.updateDriverLocation(
        stateDriverLocationStop,
        DriverAccountShared.getDriverEmail(),
        0.0,
        0.0
      );
    }
  }




  //Trips
  getAllTrips(stateAllTripsObserver,responseAllTripObserver){
    if(DriverAccountShared.getDriverEmail()){
      this.tripsDataSource.getTrips(
        stateAllTripsObserver, responseAllTripObserver,"En espera",DriverAccountShared.getDriverEmail()
      );
    }
  }

  acceptTrips(stateObserver, trip){
    if(DriverAccountShared.getDriverEmail()){
      this.tripsDataSource.acceptTrip(stateObserver, trip);
    }
  }

  getRoute(responseObserver, latitudeOrigin, longitudeOrigin, latitudeDestiny, longitudeDestiny){
    this.tripsDataSource.fetchRoute(responseObserver, latitudeOrigin, longitudeOrigin, latitudeDestiny, longitudeDestiny);
    alert(latitudeOrigin);
  }

}
