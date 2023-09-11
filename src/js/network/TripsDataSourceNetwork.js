import Constants from '../auxiliary/Constants.js';
export default class TripsDataSourceNetwork {

  //URL PhpFiles
  getTripsSmallInformationURL = Constants.PHP_FILES + "FetchTripsSmallInformation.php";
  getFinishedTripsURL = Constants.PHP_FILES + "FetchFinishedTrips.php";
  updateAcceptTripURL = Constants.PHP_FILES + "UpdateAcceptTrip.php";
  updateStateTripURL = Constants.PHP_FILES + "UpdateStateTrip.php";
  updateFinishedTripURL = Constants.PHP_FILES + "UpdateFinishedTrip.php";
  addTripURL = Constants.PHP_FILES + "AddTrip.php";
  deleteTripURL = Constants.PHP_FILES + "DeleteTrip.php";
  getStateTripURL = Constants.PHP_FILES + "FetchStateTrip.php";


  addTrip(stateObserver,fk_driver,fk_user,price,distance,date,latDest,longDest,latOri,longOri,userPhone,typeCar) {
    //Init and url base
    const hxr = new XMLHttpRequest();
    hxr.open('POST', this.addTripURL);

    //Data to send
    let data = new FormData();
    data.append('token', Constants.PHP_TOKEN);
    data.append('fk_driver', fk_driver);
    data.append('fk_user', fk_user);
    data.append('travelPrice', price);
    data.append('distance', distance);
    data.append('date', date);
    data.append('latDest', latDest);
    data.append('longDest', longDest);
    data.append('latOri', latOri);
    data.append('longOri', longOri);
    data.append('userPhone', userPhone);
    data.append('typeCar', typeCar);

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

  getTrips(stateObserver, responseObserver, state, email) {
    //Init and url base
    const hxr = new XMLHttpRequest();
    hxr.open('GET', this.getTripsSmallInformationURL+"?token="+Constants.PHP_TOKEN+"&state="+state+"&email="+email);

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

  getFinishedTrips(stateObserver, responseObserver) {
    //Init and url base
    const hxr = new XMLHttpRequest();
    hxr.open('GET', this.getFinishedTripsURL+"?token="+Constants.PHP_TOKEN);

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

  acceptTrip(stateObserver, email, fk_user ) {
    //Init and url base
    const hxr = new XMLHttpRequest();
    hxr.open('POST', this.updateAcceptTripURL);

    //Data to send
    let data = new FormData();
    data.append('token', Constants.PHP_TOKEN);
    data.append('email', email);
    data.append('fk_user', fk_user);

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

  updateStateTrip(stateObserver, email, state, delay) {
    //Init and url base
    const hxr = new XMLHttpRequest();
    hxr.open('POST', this.updateStateTripURL);

    //Data to send
    let data = new FormData();
    data.append('token', Constants.PHP_TOKEN);
    data.append('email', email);
    data.append('state', state);
    data.append('delay', delay);

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

  updateFinishedTrip(stateObserver, responseObserver, email) {
    //Init and url base
    const hxr = new XMLHttpRequest();
    hxr.open('POST', this.updateFinishedTripURL);

    //Data to send
    let data = new FormData();
    data.append('token', Constants.PHP_TOKEN);
    data.append('email', email);

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
    hxr.send(data);
  }

  deleteTrip(stateObserver, fk_user) {
    //Init and url base
    const hxr = new XMLHttpRequest();
    hxr.open('POST', this.deleteTripURL);

    //Data to send
    let data = new FormData();
    data.append('token', Constants.PHP_TOKEN);
    data.append('fk_user', fk_user);

    //OnLoad
    stateObserver("LOADING");
    hxr.onload = function () {
      if (hxr.status === 200) {
        let json = JSON.parse(hxr.responseText);
        switch (json.toString()){
          case "Aceptado":
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

  fetchStateTrip(stateObserver, responseObserver, fk_user) {
    //Init and url base
    const hxr = new XMLHttpRequest();
    hxr.open('GET', this.getStateTripURL+"?token="+Constants.PHP_TOKEN+"&fk_user="+fk_user);

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

  fetchRoute(responseObserver, latitudeOrigin, longitudeOrigin,latitudeDestiny, longitudeDestiny){
    //Init and url base
    const hxr = new XMLHttpRequest();
    hxr.open('GET', "https:api.mapbox.com/directions/v5/mapbox/driving/"+longitudeOrigin+","+latitudeOrigin+";"+longitudeDestiny+","+latitudeDestiny+"?geometries=geojson&access_token=pk.eyJ1Ijoicm9ubnlucCIsImEiOiJjbGl4YTg3bDgwNHpwM2RucTlwdWFkOXN1In0.MlTnx-myS4E3LJUeh5CVbw");

    //OnLoad
    hxr.onload = function () {
      if (hxr.status === 200) {
        let json = JSON.parse(hxr.responseText);
        responseObserver(json);
      } else {

      }
    };

    //OnError
    hxr.onerror = function () {
    };


    //Finally send the request
    hxr.send();
  }

}
