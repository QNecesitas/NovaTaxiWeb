export default class Trip {
  fk_driver;
  fk_user;
  driverName;
  clientName;
  travelPrice;
  distance;
  date;
  latDest;
  longDest;
  latOri;
  longOri;
  state;
  timeAwait;
  priceAwait;
  typeCar;
  numberPlate;
  constructor(fk_driver, fk_user, driverName, clientName, travelPrice, distance, date, latDest, longDest, latOri, longOri, state, timeAwait, priceAwait, typeCar, numberPlate) {
    this.fk_driver = fk_driver;
    this.fk_user = fk_user;
    this.driverName = driverName;
    this.clientName = clientName;
    this.travelPrice = travelPrice;
    this.distance = distance;
    this.date = date;
    this.latDest = latDest;
    this.longDest = longDest;
    this.latOri = latOri;
    this.longOri = longOri;
    this.state = state;
    this.timeAwait = timeAwait;
    this.priceAwait = priceAwait;
    this.typeCar = typeCar;
    this.numberPlate = numberPlate;
  }
}