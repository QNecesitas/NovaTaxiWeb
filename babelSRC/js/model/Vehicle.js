export default class Vehicle {
  type;
  price;
  seats;
  details;
  constructor(type, price, seats, details) {
    this.type = type;
    this.price = price;
    this.seats = seats;
    this.details = details;
  }
}