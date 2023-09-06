import UserAccountShared from './auxiliary/UserAccountShared.js';
import DriverAccountShared from './auxiliary/DriverAccountShared.js';

export default class MainActivity{


  constructor(){
    document.getElementById("btnClient").onclick = () =>{
      if(UserAccountShared.getUserEmail() === null || UserAccountShared.getUserEmail() === ""){
        window.open("loginUser.html","_self");
      }else{
        window.open("MaphomeUser.html","_self");
      }
    };

    document.getElementById("btnDriver").onclick = () =>{
      if(DriverAccountShared.getDriverEmail() === null || DriverAccountShared.getDriverEmail() === ""){
        window.open("loginDriver.html","_self");
      }else{
        window.open("MaphomeDriver.html","_self");
      }
    };

  }


}
let mainActivity = new MainActivity();
