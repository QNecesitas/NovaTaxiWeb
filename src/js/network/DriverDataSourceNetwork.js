import Constants from '../auxiliary/Constants.js';
export default class DriverDataSourceNetwork {

  //URL PhpFiles
  getDriverInformationURL = Constants.PHP_FILES + "FetchDriverInformation.php";
  getDriverSmallInformationURL = Constants.PHP_FILES + "FetchDriverSmallInformation.php";
  rateDriverURL = Constants.PHP_FILES + "RateDriver.php";
  getDriverURL = Constants.PHP_FILES + "FetchDriver.php";
  getDriverExistURL = Constants.PHP_FILES + "FetchDriverExist.php";
  getDriverAllInformationURL = Constants.PHP_FILES + "FetchDriverAllInformation.php";
  sendRecoverPetitionDriverURL = Constants.PHP_FILES + "SendRecoverPetitionDriver.php";
  addDriverInformationURL = Constants.PHP_FILES + "AddDriverInformation.php";
  updateDriverLocationURL = Constants.PHP_FILES + "UpdateDriverLocation.php";
  updateDriverBalanceURL = Constants.PHP_FILES + "UpdateDriverBalance.php";
  updateStateURL = Constants.PHP_FILES + "UpdateState.php";
  deleteDriverURL = Constants.PHP_FILES + "DeleteDriver.php";
  updateDriverInformationURL = Constants.PHP_FILES + "UpdateDriverInformation.php";



  getDriverInformation(stateObserver,responseObserver, email) {
    //Init and url base
    const hxr = new XMLHttpRequest();
    hxr.open('GET', this.getDriverInformationURL+"?token="+Constants.PHP_TOKEN+"&email="+email);

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

  getDriver(stateObserver,responseObserver) {
    //Init and url base
    const hxr = new XMLHttpRequest();
    hxr.open('GET', this.getDriverSmallInformationURL+"?token="+Constants.PHP_TOKEN);

    //OnLoad
    stateObserver("LOADING");
    hxr.onload = function () {
      if (hxr.status === 200) {
        let json = JSON.parse(hxr.responseText);
        stateObserver("SUCCESS");
        responseObserver(json);
        //TODO filterDriver
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

  rateDriver(stateObserver, rate, driver) {
    //Init and url base
    const hxr = new XMLHttpRequest();
    hxr.open('POST', this.rateDriverURL);

    //Data to send
    let data = new FormData();
    data.append('token', Constants.PHP_TOKEN);
    data.append('rate', rate);
    data.append('driver', driver);

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

  getDriverForNavigation(stateObserver,responseObserver, email) {
    //Init and url base
    const hxr = new XMLHttpRequest();
    hxr.open('GET', this.getDriverURL+"?token="+Constants.PHP_TOKEN + "&email="+email);

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

  getAllDriver(stateObserver,responseObserver) {
    //Init and url base
    const hxr = new XMLHttpRequest();
    hxr.open('GET', this.getDriverAllInformationURL+"?token="+Constants.PHP_TOKEN);

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

  getDriverExist(stateObserver,responseObserver, email, password) {
    //Init and url base
    const hxr = new XMLHttpRequest();
    hxr.open('GET', this.getDriverExistURL+"?token="+Constants.PHP_TOKEN+"&email="+email+"&password="+password);

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

  sendRecoverPetition(stateObserver, email) {
    //Init and url base
    const hxr = new XMLHttpRequest();
    hxr.open('GET', this.sendRecoverPetitionDriverURL+"?token="+Constants.PHP_TOKEN+"&email="+email);

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
    hxr.send();
  }

  addDriverInformation(stateObserver, name, email, phone, typeCar,cantSeat,maxDist,password,numberPlate,statePhoto,imageFile) {
    //Init and url base
    const hxr = new XMLHttpRequest();
    hxr.open('POST', this.addDriverInformationURL);

    //Data to send
    let data = new FormData();
    data.append('token', Constants.PHP_TOKEN);
    data.append('name', name);
    data.append('email', email);
    data.append('phone', phone);
    data.append('typeCar', typeCar);
    data.append('cantSeat', cantSeat);
    data.append('maxDist', maxDist);
    data.append('password', password);
    data.append('numberPlate', numberPlate);
    data.append('statePhoto', statePhoto);
    data.append('imageFile', imageFile);

    //OnLoad
    stateObserver("LOADING");
    hxr.onload = function () {
      if (hxr.status === 200) {
        let json = JSON.parse(hxr.responseText);
        switch (json.toString()){
          case "Exist":
            stateObserver("DUPLICATED");
            break;
          case "Success":
            stateObserver("SUCCESS");
            break;
          default:
            stateObserver("ERROR");
            break;
        }
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

  updateDriverLocation(stateObserver, email, latitude, longitude) {
    //Init and url base
    const hxr = new XMLHttpRequest();
    hxr.open('POST', this.updateDriverLocationURL);

    //Data to send
    let data = new FormData();
    data.append('token', Constants.PHP_TOKEN);
    data.append('email', email);
    data.append('latitude', latitude);
    data.append('longitude', longitude);

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

  updateDriverBalance(stateObserver, email, balance) {
    //Init and url base
    const hxr = new XMLHttpRequest();
    hxr.open('POST', this.updateDriverBalanceURL);

    //Data to send
    let data = new FormData();
    data.append('token', Constants.PHP_TOKEN);
    data.append('email', email);
    data.append('balance', balance);

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

  updateState(stateObserver, state, email) {
    //Init and url base
    const hxr = new XMLHttpRequest();
    hxr.open('POST', this.updateStateURL);

    //Data to send
    let data = new FormData();
    data.append('token', Constants.PHP_TOKEN);
    data.append('state', state);
    data.append('email', email);

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

  deleteDriver(stateObserver, email) {
    //Init and url base
    const hxr = new XMLHttpRequest();
    hxr.open('POST', this.deleteDriverURL);

    //Data to send
    let data = new FormData();
    data.append('token', Constants.PHP_TOKEN);
    data.append('email', email);

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

  updateDriver(stateObserver, email, name, phone, typeCar,cantSeat,maxDist,password,numberPlate,statePhoto,imageFile) {
    //Init and url base
    const hxr = new XMLHttpRequest();
    hxr.open('POST', this.updateDriverInformationURL);

    //Data to send
    let data = new FormData();
    data.append('token', Constants.PHP_TOKEN);
    data.append('email', email);
    data.append('name', name);
    data.append('phone', phone);
    data.append('typeCar', typeCar);
    data.append('cantSeat', cantSeat);
    data.append('maxDist', maxDist);
    data.append('password', password);
    data.append('numberPlate', numberPlate);
    data.append('statePhoto', statePhoto);
    data.append('imageFile', imageFile);

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
