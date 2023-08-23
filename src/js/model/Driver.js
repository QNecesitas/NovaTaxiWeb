export default class Driver{
  email;
  password;
  name;
  phone;
  typeCar;
  maxDist;
  latitud;
  longitude;
  state;
  statePhoto;
  balance;
  cantSeat;
  rating;
  numberPlate;


  constructor(email, password, name, phone, typeCar, maxDist, latitud, longitude, state, statePhoto, balance, cantSeat, rating, numberPlate) {
    this.email = email;
    this.password = password;
    this.name = name;
    this.phone = phone;
    this.typeCar = typeCar;
    this.maxDist = maxDist;
    this.latitud = latitud;
    this.longitude = longitude;
    this.state = state;
    this.statePhoto = statePhoto;
    this.balance = balance;
    this.cantSeat = cantSeat;
    this.rating = rating;
    this.numberPlate = numberPlate;
  }
}
