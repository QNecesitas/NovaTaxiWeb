import UserAccountShared from './auxiliary/UserAccountShared.js';
import ViewModelMapHomeUser from './viewModels/ViewModelMapHomeUser.js';

export default class MaphomeUser {

  viewModelMapHome = new ViewModelMapHomeUser();
  listDriverObserver;
  statePricesObserver;
  listVehicleObserver;
  stateAddTripObserver;
  stateCancelTripObserver;
  stateRateObserver;
  tripStateObserver;
  stateVersionObserver;
  versionResponseObserver;


  constructor() {

    //Map
    let lastPointSelected = UserAccountShared.getLastLocation();
    mapboxgl.accessToken = 'pk.eyJ1Ijoicm9ubnlucCIsImEiOiJjbGl4YTg3bDgwNHpwM2RucTlwdWFkOXN1In0.MlTnx-myS4E3LJUeh5CVbw';
    map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/ronnynp/cljbmkjqs00gt01qrb2y3bgxj',
      center: [lastPointSelected.longitude,lastPointSelected.longitude],
      zoom: 16.5, // starting zoom,
      pitch: 70.0
    });

    //Results launchers
    let putMap_originLat=window.sessionStorage.getItem("putMap_originLat");
    let putMap_originLong=window.sessionStorage.getItem("putMap_originLong");
    let putMap_destinyLat=window.sessionStorage.getItem("putMap_destinyLat");
    let putMap_destinyLong=window.sessionStorage.getItem("putMap_destinyLong");
    if(putMap_originLat !== null && putMap_originLong !==null){
      this.locationOriginAccept(putMap_originLat, putMap_originLong)
    }
    if(putMap_destinyLat !== null && putMap_destinyLong !==null){
      this.locationDestinyAccept(putMap_destinyLat, putMap_destinyLong)
    }

    //Observers
    this.listDriverObserver = (it) => {
      this.viewModelMapHome.listDrivers = it;
      this.updateDriversPositionInMap();
    };

    this.statePricesObserver = (it) => {
      switch (it){
        case "LOADING":
          document.getElementById("progress").style.visibility = "visible";
          break;
        case "SUCCESS":
          document.getElementById("progress").style.visibility = "hidden";
          break;
        case "ERROR":
          document.getElementById("progress").style.visibility = "hidden";
          alert("Se ha producido un error. Compruebe su conexión e intente nuevamente");
          break;
      }
    };

    this.listVehicleObserver = (it) => {
      this.viewModelMapHome.listVehicles = it;
      this.updateRecyclerInfo(it);
    };

    this.stateAddTripObserver = (it) => {

      switch (it){
        case "LOADING":
          document.getElementById("progress").style.visibility = "visible";
          document.getElementById("container-card-taxi").style.visibility = "hidden";
          break;
        case "SUCCESS":
          document.getElementById("progress").style.visibility = "hidden";
          this.showAlertLLAwaitSelect(600000); //10 minutes
          break;
        case "ERROR":
          document.getElementById("progress").style.visibility = "hidden";
          alert("Se ha producido un error. Compruebe su conexión e intente nuevamente");
          break;
      }

    };

    this.stateCancelTripObserver = (it) => {
      switch (it){
        case "LOADING":
          document.getElementById("progress").style.visibility = "visible";
          document.getElementById("btn-cancelar").style.visibility = "hidden";
          break;
        case "SUCCESS":
          document.getElementById("progress").style.visibility = "hidden";
          UserAccountShared.setLastPetition(0);
          document.getElementById("btn-cancelar").style.visibility = "hidden";
          this.addAnnotationAnimation(false);
          document.getElementById("ubication").style.visibility = "visible";
          document.getElementById("destino").style.visibility = "visible";
          document.getElementById("container-card-taxi").style.visibility = "visible";
          break;
        case "ERROR":
          document.getElementById("btn-cancelar").style.visibility = "visible";
          document.getElementById("progress").style.visibility = "hidden";
          alert("Se ha producido un error. Compruebe su conexión e intente nuevamente");
          break;
      }
    };

    this.stateRateObserver = (it) => {
      switch (it){
        case "LOADING":
          document.getElementById("progress").style.visibility = "visible";
          break;
        case "SUCCESS":
          document.getElementById("progress").style.visibility = "hidden";
          alert("Valorado con éxito");
          break;
        case "ERROR":
          document.getElementById("progress").style.visibility = "hidden";
          alert("Se ha producido un error. Compruebe su conexión e intente nuevamente");
          break;
      }
    };

    this.tripStateObserver = (it) => {
      if(it.state === "Aceptado"){
        this.liDriverAccept(it);
      }
    };

    this.stateVersionObserver = (it) => {
      switch (it){
        case "LOADING":
          document.getElementById("progress").style.visibility = "visible";
          break;
        case "SUCCESS":
          this.getUserDestination();
          break;
        case "ERROR":
          document.getElementById("progress").style.visibility = "hidden";
          alert("Se ha producido un error. Compruebe su conexión e intente nuevamente");
          break;
      }
    };

    this.versionResponseObserver = (it) => {
      this.showAlertDialogNotVersion(it);
    };



    //Listeners
    document.getElementById("realTimeBtn").onclick= () =>{
      this.viewModelMapHome.isNecessaryCamera(true);
      this.getLocationRealTime();
    };
  }


  //Recycler
  updateRecyclerInfo(json_it){
    if(json_it.length > 0){
      document.getElementById("container-card-taxi").style.visibility = "visible";

      for(let f=0;f<json_it.length;f++){

        let divCardTaxi=document.createElement("div");divCardTaxi.setAttribute("class","card-taxi");
        let driverImg = this.getDriverImg(json_it[0].type);
        let divCardTaxiImg=document.createElement("div");divCardTaxiImg.setAttribute("class","card-taxi-img");
        let imgCardTaxiImg=document.createElement("img");imgCardTaxiImg.setAttribute("src",driverImg);divCardTaxi.setAttribute("alt","imagen de taxi");
        let divIndividual = document.createElement("div");
        let divContainerP = document.createElement("div");divContainerP.setAttribute("class","container-p");
        let pTypeCar = document.createElement("p");pTypeCar.setAttribute("class","card-taxi-p");pTypeCar.innerHTML = "Veh&iacute;culo: "+ json_it[0].type;
        let pPriceCar = document.createElement("p");pPriceCar.setAttribute("class","card-taxi-p");pPriceCar.innerHTML = "Precio: "+ json_it[0].price;
        let divContainerA = document.createElement("div");divContainerA.setAttribute("class","container-a");
        let aDetails = document.createElement("a");aDetails.setAttribute("class","card-taxi-a");aDetails.setAttribute("href","");
        let aOrder = document.createElement("a");aOrder.setAttribute("class","card-taxi-a");aOrder.setAttribute("href","");

        divCardTaxiImg.appendChild(imgCardTaxiImg);
        divContainerP.appendChild(pTypeCar);
        divContainerP.appendChild(pPriceCar);
        divContainerA.appendChild(aDetails);
        divContainerA.appendChild(aOrder);

        divIndividual.appendChild(divContainerP);
        divIndividual.appendChild(divContainerA);

        divCardTaxi.appendChild(divCardTaxiImg);
        divCardTaxi.appendChild(divIndividual);


        divCardTaxi.appendChild(divCardTaxiImg);
        aDetails.addEventListener("click",()=>this.click_details(json_it[f]));
        aOrder.addEventListener("click",()=>this.click_order(json_it[f]));


        document.getElementById("container-card-taxi").appendChild(divCardTaxi);

      }
    }
  }

  getDriverImg(vehicleType){
    switch(vehicleType) {
      case "Auto básico" :
        return "./img/baseline_drive_eta_24.png";
        break;
      case "Auto de confort" :
        return "./img/vector_car.png";
        break;
      case "Auto familiar" :
        return "./img/vector_familiar.png";
        break;
      case "Triciclo" :
        return "./img/vector_tricycle.png";
        break;
      case "Motor" :
        return "./img/baseline_directions_bike_24.png";
        break;
      case "Bicitaxi" :
        return "./img/vector_bicitaxi.png";
        break;
      default :
        return "./img/baseline_drive_eta_24.png";
        break;
    }
  }

  click_details(vehicle){
    this.showAlertDialogCarDetails(vehicle.type,vehicle.details);
  }

  click_order(vehicle){
    this.showAlertDialogConfirmCar(vehicle);
  }




  locationOriginAccept(putMap_originLat,putMap_originLong){

  }

  locationDestinyAccept(putMap_destinyLat,putMap_destinyLong){

  }

  updateDriversPositionInMap(){

  }




  //AlertDialogs
  showAlertDialogCarDetails(vehicleType, vehicleDetails) {
    alert("Vehículo: "+vehicleType + "\n" + vehicleDetails);
  }

  showAlertDialogConfirmCar(vehicle){
    let result = confirm("¿Está seguro de pedir este taxi?");
    if(result){
      this.viewModelMapHome.addTrip(this.stateAddTripObserver,vehicle.price,"no",vehicle.type);
    }
  }






  //Await car
  showAlertLLAwaitSelect(time){
    UserAccountShared.setLastPetition(Date.now());
    this.addAnnotationAnimation(true);
    document.getElementById("btn-cancelar").style.visibility = "visible";
    document.getElementById("ubication").style.visibility = "hidden";
    document.getElementById("destino").style.visibility = "hidden";
    document.getElementById("container-card-taxi").style.visibility = "hidden";
    //TODO
  }


}
let mapHomeUser = new MaphomeUser();
