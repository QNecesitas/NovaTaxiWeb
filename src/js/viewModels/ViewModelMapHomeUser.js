import AuxiliaryDataSourceNetwork from "../network/AuxiliaryDataSourceNetwork.js";
import DriverDataSourceNetwork from "../network/DriverDataSourceNetwork.js";
import PricesDataSourceNetwork from "../network/PricesDataSourceNetwork.js";
import TripsDataSourceNetwork from "../network/TripsDataSourceNetwork.js";
import Point from "../model/Point.js";
import Vehicle from "../model/Vehicle.js";
import Prices from "../model/Prices.js";
import UserAccountShared from "../auxiliary/UserAccountShared.js";

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
  driverDataSource = new DriverDataSourceNetwork();
  pricesDataSource = new PricesDataSourceNetwork();
  tripsDataSource = new TripsDataSourceNetwork();


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

  setLatitudeDestiny(lat){
    this.latitudeDestiny = lat;
  }

  setLongitudeDestiny(long){
    this.longitudeDestiny = long;
  }

  setPointOrigin(pointAnnotation){
    this.pointOrigin = pointAnnotation;
  }

  setPointDestiny(pointAnnotation){
    this.pointDestiny = pointAnnotation;
  }

  setIsNecessaryCamera(boolean){
    this.isNecessaryCamera = boolean;
  }

  setLatitudeGPS(latitude){
    this.latitudeGPS = latitude;
  }

  setLongitudeGPS(longitude){
    this.longitudeGPS = longitude;
  }


  //Coroutine
  async startMainCoroutine(stateObserverDriver, responseObserverDriver, stateObserverTrip, responseObserverTrip){
    while (true){
      await this.getDriversAll(stateObserverDriver, responseObserverDriver);
      await new Promise(resolve => setTimeout(resolve, 12000));
      await this.getTripState(stateObserverTrip, responseObserverTrip);
    }
  }




  //Choice car
  getPrices(distanceMeters, stateObserver, responseObserver){
    let distanceKilometers = distanceMeters/1000;
    this.lastDistance = distanceKilometers;
    this.pricesDataSource.getPricesInformation(stateObserver, responseObserver, 1,distanceKilometers);
  }

  makeVehiclesList(prices, distance,listVehicleObserver){
    this.listVehicles = [];

    //Simple car
    this.listVehicles.push(
      new Vehicle(
        "Auto básico",
        parseInt(prices.priceNormalCar * distance),
        4,
        "Vehículo sencillo con alrededor de 4 capacidades, ideal para obtener mejores precios"
      )
    );

    //Comfort
    this.listVehicles.push(
      new Vehicle(
        "Auto de confort",
        parseInt(prices.priceComfortCar * distance),
        4,
        "Vehículo muy cómodo con alrededor de 4 capacidades y aire acondicionado"
      )
    );

    //Familiar
    this.listVehicles.push(
      new Vehicle(
        "Auto familiar",
        parseInt(prices.priceFamiliarCar * distance),
        8,
        "Vehículo cómodo con alrededor de 8 capacidades, ideal para el viaje en familia"
      )
    );

    //Tricycle
    this.listVehicles.push(
      new Vehicle(
        "Triciclo",
        parseInt(prices.priceTricycle * distance),
        2,
        "Vehículo triciclo con alrededor de 2 capacidades, ideal para viajes cortos"
      )
    );

    //Bicitaxi
    this.listVehicles.push(
      new Vehicle(
        "Bicitaxi",
        parseInt(prices.priceBiciTaxi * distance),
        2,
        "Vehículo con solo 2 capacidades, ideal para viajes cortos y cómodos"
      )
    );

    //Motorcycle
    this.listVehicles.push(
      new Vehicle(
        "Motor",
        parseInt(prices.priceMotorcycle * distance),
        1,
        "Vehículo con solo 1 capacidad, ideal para viajes rápidos y sin mucho equipaje"
      )
    );

    listVehicleObserver(this.listVehicles);

  }

  addTrip(stateObserver, prices, phone, typeCar){
    this.tripsDataSource.addTrip(
      stateObserver,
      "no",
      UserAccountShared.getUserEmail(),
      parseInt(prices),
      this.lastDistance,
      this.makeDate(),
      this.latitudeDestiny,
      this.longitudeDestiny,
      this.latitudeOrigin,
      this.longitudeOrigin,
      phone,
      typeCar
    )
  }

  makeDate(){
    let allDate;
    const calendar = new Date();
    const options = {day: '2-digit', month: '2-digit', year: '2-digit', hour: 'numeric', minute: 'numeric', hour12: true};
    allDate = calendar.toLocaleString(undefined, options);
    return allDate;
  }

  cancelTimeAwait(stateObserver){
    if(UserAccountShared.getUserEmail() !== null){
      this.tripsDataSource.deleteTrip(stateObserver, UserAccountShared.getUserEmail());
    }
  }

  rateTaxi(stateObserver, rate){
    this.driverDataSource.rateDriver(stateObserver, rate, UserAccountShared.getLastDriver());
  }

  getTripState(stateObserver, responseObserver){
    this.tripsDataSource.fetchStateTrip(stateObserver,responseObserver, UserAccountShared.getUserEmail());
  }

  getAppVersion(stateObserver, responseObserver){
    this.auxiliaryDataSource.getVersion(stateObserver, responseObserver);
  }

  getRoute(responseObserver, latitudeOrigin, longitudeOrigin, latitudeDestiny, longitudeDestiny){
    this.tripsDataSource.fetchRoute(responseObserver, latitudeOrigin, longitudeOrigin, latitudeDestiny, longitudeDestiny);
  }

}
