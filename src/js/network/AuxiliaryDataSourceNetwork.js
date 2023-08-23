import Constants from '../auxiliary/Constants.js';

//URL PhpFiles
export default class AuxiliaryDataSourceNetwork {

  getVersionURL = Constants.PHP_FILES + "FetchVersion.php";

  getVersion(observerState, observerResponse) {
    //Init and url base
    const hxr = new XMLHttpRequest();
    hxr.open('GET', this.getVersionURL + "?version="+Constants.APP_VERSION);

    //OnLoad
    observerState("LOADING");
    hxr.onload = function () {
      if (hxr.status === 200) {
        let json = JSON.parse(hxr.responseText);
        if (json === "Success") {
          observerState("SUCCESS");
        } else {
          observerState("ERROR");
          observerResponse(json);
        }
      } else {
        observerState("ERROR");
      }
    };

    //OnError
    hxr.onerror = function () {
      alert(hxr.status);
    };

    //Finally send the request
    hxr.send();
  }
}
