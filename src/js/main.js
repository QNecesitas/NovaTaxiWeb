import UserAccountShared from './auxiliary/UserAccountShared.js';
import DriverAccountShared from './auxiliary/DriverAccountShared.js';

class MainActivity {
  constructor() {
    const btnClient = document.getElementById("btnClient");
    const btnDriver = document.getElementById("btnDriver");

    if (btnClient) {
      btnClient.addEventListener("click", function () {
        if (
          UserAccountShared.getUserEmail() === null ||
          UserAccountShared.getUserEmail() === ""
        ) {
          openPage("loginUser.html");
        } else {
          openPage("MaphomeUser.html");
        }
      });
    }

    if (btnDriver) {
      btnDriver.addEventListener("click", function () {
        if (
          DriverAccountShared.getDriverEmail() === null ||
          DriverAccountShared.getDriverEmail() === ""
        ) {
          openPage("loginDriver.html");
        } else {
          openPage("MaphomeDriver.html");
        }
      });
    }

    function openPage(page) {
      if (window && window.open) {
        window.open(page, "_self");
      } else {
        window.location.href = page;
      }
    }
  }
}

const mainActivity = new MainActivity();
