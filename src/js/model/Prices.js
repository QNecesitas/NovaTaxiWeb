export default class Prices{
  id;
  priceNormalCar;
  priceComfortCar;
  priceFamiliarCar;
  priceTricycle;
  priceBiciTaxi;
  priceMotorcycle;
  priceDelay;
  delayTime;
  descPercent;


  constructor(id, priceNormalCar, priceComfortCar, priceFamiliarCar, priceTricycle, priceBiciTaxi, priceMotorcycle, priceDelay, delayTime, descPercent) {
    this.id = id;
    this.priceNormalCar = priceNormalCar;
    this.priceComfortCar = priceComfortCar;
    this.priceFamiliarCar = priceFamiliarCar;
    this.priceTricycle = priceTricycle;
    this.priceBiciTaxi = priceBiciTaxi;
    this.priceMotorcycle = priceMotorcycle;
    this.priceDelay = priceDelay;
    this.delayTime = delayTime;
    this.descPercent = descPercent;
  }
}
