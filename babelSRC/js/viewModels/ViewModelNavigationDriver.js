import DriverDataSourceNetwork from "../network/DriverDataSourceNetwork.js";
import TripsDataSourceNetwork from "../network/TripsDataSourceNetwork.js";
import DriverAccountShared from "../auxiliary/DriverAccountShared.js";
import RoutesTools from "../auxiliary/RoutesTools.js";
export default class ViewModelNavigationDriver {
  driverDataSource = new DriverDataSourceNetwork();
  tripsDataSource = new TripsDataSourceNetwork();
  latitudeGps;
  longitudeGps;
  driver;
  route;
  actualTrip;
  timeInMillsStart;
  timeInMillsEnd;
  stateRoute;

  //Setters
  setTimeInMillsStart(time) {
    this.timeInMillsStart = time;
  }
  setTimeInMillsEnd(time) {
    this.timeInMillsEnd = time;
  }
  setLatitudeGPS(latitude) {
    this.latitudeGps = latitude;
  }
  setLongitudeGPS(longitude) {
    this.longitudeGps = longitude;
  }
  setRoute(route) {
    this.route = route;
  }
  setRouteState(routeState, stateObserver) {
    this.stateRoute = routeState;
    stateObserver(this.stateRoute);
  }

  //Near from await for client
  checkIsNearFromAwaitForClient(trip, stateRouteObserver) {
    if (this.stateRoute === "STARTING") {
      if (this.latitudeGps && this.longitudeGps) {
        let distance = this.calculateDist(this.latitudeGps, this.longitudeGps, trip.latOri, trip.longOri);
        if (distance <= 1) {
          this.stateRoute = "NEAR_AWAITING";
          stateRouteObserver(this.stateRoute);
        }
      }
    }
  }
  setStatusRouteToInAwait(stateObserver) {
    if (DriverAccountShared.getDriverEmail()) {
      this.tripsDataSource.updateStateTrip(stateObserver, DriverAccountShared.getDriverEmail(), "Espera por cliente", 0, "AWAITING");
    }
  }
  setStatusRouteToInTravel(stateObserver) {
    if (this.timeInMillsStart && this.timeInMillsEnd) {
      let timeDelayMills = this.timeInMillsEnd - this.timeInMillsStart;
      let timeDelay = parseInt(timeDelayMills / 1000 / 60);
      if (RoutesTools.navigationTripDriver !== null) {
        RoutesTools.navigationTripDriver.timeAwait = timeDelay;
      }

      //Call
      if (DriverAccountShared.getDriverEmail()) {
        this.tripsDataSource.updateStateTrip(stateObserver, DriverAccountShared.getDriverEmail(), "En viaje", timeDelay, "PAST_AWAITING");
        this.stateRoute = "PAST_AWAITING";
      }
    }
  }

  //Near from a destiny
  checkIsNearFromFinished(trip, stateRouteObserver) {
    if (this.stateRoute === "PAST_AWAITING") {
      if (this.latitudeGps && this.longitudeGps) {
        let distance = this.calculateDist(this.latitudeGps, this.longitudeGps, trip.latDest, trip.longDest);
        if (distance <= 1) {
          this.stateRoute = "NEAR_FINISHING";
          stateRouteObserver(this.stateRoute);
        }
      }
    }
  }
  setStatusRouteToFinished(stateObserver, responseObserver) {
    //Call
    if (DriverAccountShared.getDriverEmail()) {
      this.tripsDataSource.updateFinishedTrip(stateObserver, responseObserver, DriverAccountShared.getDriverEmail());
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
  getRoute(responseObserver, latitudeOrigin, longitudeOrigin, latitudeDestiny, longitudeDestiny) {
    this.tripsDataSource.fetchRoute(responseObserver, latitudeOrigin, longitudeOrigin, latitudeDestiny, longitudeDestiny);
  }
  getRouteTriple(responseObserver, latitudeDriver, longitudeDriver, latitudeOrigin, longitudeOrigin, latitudeDestiny, longitudeDestiny) {
    this.tripsDataSource.fetchRouteTriple(responseObserver, latitudeDriver, longitudeDriver, latitudeOrigin, longitudeOrigin, latitudeDestiny, longitudeDestiny);
  }
  updateDriverLocation(stateObserver) {
    if (this.latitudeGps && this.longitudeGps) {
      if (DriverAccountShared.getDriverEmail()) {
        this.driverDataSource.updateDriverLocation(stateObserver, DriverAccountShared.getDriverEmail(), this.latitudeGps, this.longitudeGps);
        document.getElementById("alertInfo").style.visibility = "hidden";
      }
    } else {
      document.getElementById("alertInfo").style.visibility = "visible";
    }
  }
}