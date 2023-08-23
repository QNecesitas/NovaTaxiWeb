import Constants from '../auxiliary/Constants.js';
export default class UserDataSourceNetwork {

  //URL PhpFiles
  getUserExistURL = Constants.PHP_FILES + "FetchUserExist.php";
  addUserInformationURL = Constants.PHP_FILES + "AddUserInformation.php";
  sendRecoverPetitionURL = Constants.PHP_FILES + "SendRecoverPetitionUser.php";
  getUserInformationAllURL = Constants.PHP_FILES + "FetchUserInformationAll.php";
  updateUserURL = Constants.PHP_FILES + "UpdateUserInformation.php";
  deleteUserURL = Constants.PHP_FILES + "DeleteUsers.php";




  getUserExist(stateObserver,responseObserver, email, password) {
    //Init and url base
    const hxr = new XMLHttpRequest();
    hxr.open('GET', this.getUserExistURL+"?token="+Constants.PHP_TOKEN+"&email="+email+"&password="+password);

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



  getUserInformationAll(stateObserver,responseObserver,email) {
    //Init and url base
    const hxr = new XMLHttpRequest();
    hxr.open('GET', this.getUserInformationAllURL+"?token="+Constants.PHP_TOKEN+"&email="+email);

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


  updateUser(stateObserver, email, password, phone) {
    //Init and url base
    const hxr = new XMLHttpRequest();
    hxr.open('POST', this.updateUserURL);

    //Data to send
    let data = new FormData();
    data.append('token', Constants.PHP_TOKEN);
    data.append('email', email);
    data.append('password', password);
    data.append('phone', phone);

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


  deleteUser(stateObserver, email) {
    //Init and url base
    const hxr = new XMLHttpRequest();
    hxr.open('POST', this.deleteUserURL);

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


  sendRecoverPetition(stateObserver, email) {
    //Init and url base
    const hxr = new XMLHttpRequest();
    hxr.open('GET', this.sendRecoverPetitionURL+"?token="+Constants.PHP_TOKEN+"&email="+email);

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


  addUserInformation(stateObserver, name, email, phone, password) {
    //Init and url base
    const hxr = new XMLHttpRequest();
    hxr.open('POST', this.addUserInformationURL);

    //Data to send
    let data = new FormData();
    data.append('token', Constants.PHP_TOKEN);
    data.append('name', name);
    data.append('email', email);
    data.append('phone', phone);
    data.append('password', password);

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


}
