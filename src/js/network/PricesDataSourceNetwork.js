import Constants from '../auxiliary/Constants.js';
export default class PricesDataSourceNetwork {

  //URL PhpFiles
  getPricesInformationURL = Constants.PHP_FILES + "FetchPricesInformation.php";
  updatePriceKmURL = Constants.PHP_FILES + "UpdatePriceKm.php";
  updatePriceDelayURL = Constants.PHP_FILES + "UpdatePriceDelay.php";
  updateDelayTimeURL = Constants.PHP_FILES + "UpdateDelayTime.php";
  updateDescPercentURL = Constants.PHP_FILES + "UpdateDescPercent.php";
  updatePriceComfortCarURL = Constants.PHP_FILES + "UpdatePriceComfortCar.php";
  updateFamiliarCarURL = Constants.PHP_FILES + "UpdateFamiliarCar.php";
  updatePriceTricycleURL = Constants.PHP_FILES + "UpdatePriceTricycle.php";
  updatePriceBiciTaxiURL = Constants.PHP_FILES + "UpdatePriceBiciTaxi.php";
  updatePriceMotorcycleURL = Constants.PHP_FILES + "UpdatePriceMotorcycle.php";



  getPricesInformationDriver(stateObserver, responseObserver, id, distance) {
    //Init and url base
    const hxr = new XMLHttpRequest();
    hxr.open('GET', this.getPricesInformationURL+"?token="+Constants.PHP_TOKEN+"&id="+id);

    //OnLoad
    stateObserver("LOADING");
    hxr.onload = function () {
      if (hxr.status === 200) {
        let json = JSON.parse(hxr.responseText);
        stateObserver("SUCCESS");
        responseObserver(json, distance);
      } else {
        stateObserver("ERROR");
      }
    };

    //OnError
    hxr.onerror = function () {
      stateObserver("ERROR");

    };


    //Finally send the request
    hxr.send();
  }

  getPricesInformationUser(stateObserver, responseObserver, id) {
    //Init and url base
    const hxr = new XMLHttpRequest();
    hxr.open('GET', this.getPricesInformationURL+"?token="+Constants.PHP_TOKEN+"&id="+id);

    //OnLoad
    stateObserver("LOADING");
    hxr.onload = function () {
      if (hxr.status === 200) {
        let json = JSON.parse(hxr.responseText);
        stateObserver("SUCCESS");
        responseObserver(json);
      } else {
        stateObserver("ERROR");
      }
    };

    //OnError
    hxr.onerror = function () {
      stateObserver("ERROR");

    };


    //Finally send the request
    hxr.send();
  }

  updatePriceKm(stateObserver, id, priceNormalCar) {
    //Init and url base
    const hxr = new XMLHttpRequest();
    hxr.open('POST', this.updatePriceKmURL);

    //Data to send
    let data = new FormData();
    data.append('token', Constants.PHP_TOKEN);
    data.append('id', id);
    data.append('priceNormalCar', priceNormalCar);

    //OnLoad
    stateObserver("LOADING");
    hxr.onload = function () {
      if (hxr.status === 200) {
        stateObserver("SUCCESS");
      } else {
        stateObserver("ERROR");

      }
    };

    //OnError
    hxr.onerror = function () {
      stateObserver("ERROR");

    };

    //Finally send the request
    hxr.send(data);
  }

  updatePriceDelay(stateObserver, id, priceDelay) {
    //Init and url base
    const hxr = new XMLHttpRequest();
    hxr.open('POST', this.updatePriceDelayURL);

    //Data to send
    let data = new FormData();
    data.append('token', Constants.PHP_TOKEN);
    data.append('id', id);
    data.append('priceDelay', priceDelay);

    //OnLoad
    stateObserver("LOADING");
    hxr.onload = function () {
      if (hxr.status === 200) {
        stateObserver("SUCCESS");
      } else {
        stateObserver("ERROR");

      }
    };

    //OnError
    hxr.onerror = function () {
      stateObserver("ERROR");

    };

    //Finally send the request
    hxr.send(data);
  }

  updateDelayTime(stateObserver, id, delayTime) {
    //Init and url base
    const hxr = new XMLHttpRequest();
    hxr.open('POST', this.updateDelayTimeURL);

    //Data to send
    let data = new FormData();
    data.append('token', Constants.PHP_TOKEN);
    data.append('id', id);
    data.append('delayTime', delayTime);

    //OnLoad
    stateObserver("LOADING");
    hxr.onload = function () {
      if (hxr.status === 200) {
        stateObserver("SUCCESS");
      } else {
        stateObserver("ERROR");

      }
    };

    //OnError
    hxr.onerror = function () {
      stateObserver("ERROR");

    };

    //Finally send the request
    hxr.send(data);
  }

  updateDescPercent(stateObserver, id, descPercent) {
    //Init and url base
    const hxr = new XMLHttpRequest();
    hxr.open('POST', this.updateDescPercentURL);

    //Data to send
    let data = new FormData();
    data.append('token', Constants.PHP_TOKEN);
    data.append('id', id);
    data.append('descPercent', descPercent);

    //OnLoad
    stateObserver("LOADING");
    hxr.onload = function () {
      if (hxr.status === 200) {
        stateObserver("SUCCESS");
      } else {
        stateObserver("ERROR");

      }
    };

    //OnError
    hxr.onerror = function () {
      stateObserver("ERROR");

    };

    //Finally send the request
    hxr.send(data);
  }

  updateComfortCar(stateObserver, id, priceComfortCar) {
    //Init and url base
    const hxr = new XMLHttpRequest();
    hxr.open('POST', this.updatePriceComfortCarURL);

    //Data to send
    let data = new FormData();
    data.append('token', Constants.PHP_TOKEN);
    data.append('id', id);
    data.append('priceComfortCar', priceComfortCar);

    //OnLoad
    stateObserver("LOADING");
    hxr.onload = function () {
      if (hxr.status === 200) {
        stateObserver("SUCCESS");
      } else {
        stateObserver("ERROR");

      }
    };

    //OnError
    hxr.onerror = function () {
      stateObserver("ERROR");

    };

    //Finally send the request
    hxr.send(data);
  }

  updateFamiliarCar(stateObserver, id, priceFamiliarCar) {
    //Init and url base
    const hxr = new XMLHttpRequest();
    hxr.open('POST', this.updateFamiliarCarURL);

    //Data to send
    let data = new FormData();
    data.append('token', Constants.PHP_TOKEN);
    data.append('id', id);
    data.append('priceFamiliarCar', priceFamiliarCar);

    //OnLoad
    stateObserver("LOADING");
    hxr.onload = function () {
      if (hxr.status === 200) {
        stateObserver("SUCCESS");
      } else {
        stateObserver("ERROR");

      }
    };

    //OnError
    hxr.onerror = function () {
      stateObserver("ERROR");

    };

    //Finally send the request
    hxr.send(data);
  }

  updatePriceTricycle(stateObserver, id, priceTricycle) {
    //Init and url base
    const hxr = new XMLHttpRequest();
    hxr.open('POST', this.updatePriceTricycleURL);

    //Data to send
    let data = new FormData();
    data.append('token', Constants.PHP_TOKEN);
    data.append('id', id);
    data.append('priceTricycle', priceTricycle);

    //OnLoad
    stateObserver("LOADING");
    hxr.onload = function () {
      if (hxr.status === 200) {
        stateObserver("SUCCESS");
      } else {
        stateObserver("ERROR");

      }
    };

    //OnError
    hxr.onerror = function () {
      stateObserver("ERROR");

    };

    //Finally send the request
    hxr.send(data);
  }

  updatePriceBiciTaxi(stateObserver, id, priceBiciTaxi) {
    //Init and url base
    const hxr = new XMLHttpRequest();
    hxr.open('POST', this.updatePriceBiciTaxiURL);

    //Data to send
    let data = new FormData();
    data.append('token', Constants.PHP_TOKEN);
    data.append('id', id);
    data.append('priceBiciTaxi', priceBiciTaxi);

    //OnLoad
    stateObserver("LOADING");
    hxr.onload = function () {
      if (hxr.status === 200) {
        stateObserver("SUCCESS");
      } else {
        stateObserver("ERROR");

      }
    };

    //OnError
    hxr.onerror = function () {
      stateObserver("ERROR");

    };

    //Finally send the request
    hxr.send(data);
  }

  updatePriceMotorcycle(stateObserver, id, priceMotorcycle) {
    //Init and url base
    const hxr = new XMLHttpRequest();
    hxr.open('POST', this.updatePriceMotorcycleURL);

    //Data to send
    let data = new FormData();
    data.append('token', Constants.PHP_TOKEN);
    data.append('id', id);
    data.append('priceMotorcycle', priceMotorcycle);

    //OnLoad
    stateObserver("LOADING");
    hxr.onload = function () {
      if (hxr.status === 200) {
        stateObserver("SUCCESS");
      } else {
        stateObserver("ERROR");

      }
    };

    //OnError
    hxr.onerror = function () {
      stateObserver("ERROR");

    };

    //Finally send the request
    hxr.send(data);
  }

}
