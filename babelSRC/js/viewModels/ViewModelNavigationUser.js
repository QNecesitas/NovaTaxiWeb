import DriverDataSourceNetwork from "../network/DriverDataSourceNetwork.js";
import TripsDataSourceNetwork from "../network/TripsDataSourceNetwork.js";
import UserAccountShared from "../auxiliary/UserAccountShared.js";
import RoutesTools from "../auxiliary/RoutesTools.js";
import PricesDataSourceNetwork from "../network/PricesDataSourceNetwork.js";
export default class ViewModelNavigationUser {
  driverDataSource = new DriverDataSourceNetwork();
  tripsDataSource = new TripsDataSourceNetwork();
  pricesDataSourceNetwork = new PricesDataSourceNetwork();
  latitudeDriver;
  longitudeDriver;
  driver;
  actualTrip;
  actualPrices;

  //Setters
  setLatitudeDriver(latitude) {
    this.latitudeDriver = latitude;
  }
  setLongitudeDriver(longitude) {
    this.longitudeDriver = longitude;
  }

  //Driver position
  getDriverPosition(stateObserver, responseObserver, email) {
    this.driverDataSource.getDriverForNavigation(stateObserver, responseObserver, email);
  }

  //Fetch state in the trip
  fetchStateInTrip(stateObserver, responseObserver, email) {
    this.tripsDataSource.fetchStateTrip(stateObserver, responseObserver, email);
  }
  fetchPrices(stateObserver, responseObserver) {
    this.pricesDataSourceNetwork.getPricesInformationUser(stateObserver, responseObserver, 1);
  }
  getRoute(responseObserver, latitudeOrigin, longitudeOrigin, latitudeDestiny, longitudeDestiny) {
    this.tripsDataSource.fetchRoute(responseObserver, latitudeOrigin, longitudeOrigin, latitudeDestiny, longitudeDestiny);
  }
  getRouteTriple(responseObserver, latitudeDriver, longitudeDriver, latitudeOrigin, longitudeOrigin, latitudeDestiny, longitudeDestiny) {
    this.tripsDataSource.fetchRouteTriple(responseObserver, latitudeDriver, longitudeDriver, latitudeOrigin, longitudeOrigin, latitudeDestiny, longitudeDestiny);
  }
}