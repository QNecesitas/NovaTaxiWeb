import UserAccountShared from './auxiliary/UserAccountShared.js';
import ViewModelMapHomeUser from './viewModels/ViewModelMapHomeUser.js';
import User from "./model/User";
import Point from "./model/Point";

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
  stateDriverObserver;
  stateTripObserver;
  markerGPStoAnnotation;
  markerAnimation;
  markerDrivers;
  markerTripOrigin;
  markerTripDestiny;
  routeObserver;


  constructor() {

    //Map
    let lastPointSelected = UserAccountShared.getLastLocation();
    mapboxgl.accessToken = 'pk.eyJ1Ijoicm9ubnlucCIsImEiOiJjbGl4YTg3bDgwNHpwM2RucTlwdWFkOXN1In0.MlTnx-myS4E3LJUeh5CVbw';
    map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/ronnynp/cljbmkjqs00gt01qrb2y3bgxj',
      center: [lastPointSelected.longitude,lastPointSelected.latitude],
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

    this.stateDriverObserver = (it) => {
      switch (it){
        case "LOADING":

          break;
        case "SUCCESS":

          break;
        case "ERROR":

          break;
      }
    };

    this.stateTripObserver = (it) => {
      switch (it){
        case "LOADING":

          break;
        case "SUCCESS":

          break;
        case "ERROR":

          break;
      }
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
          this.showToast("Valorado con éxito");
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
      if(navigator.geolocation) {
        this.viewModelMapHome.isNecessaryCamera(true);
        this.getLocationRealTime();
      }else{
        this.showAlertDialogNotLocationSettings();
      }
    };

    document.getElementById("settings").onclick = () => {
      window.open("SettingUser.html","_self");
    };

    document.getElementById("ubication").onclick = () => {
      if(navigator.geolocation){
        if(this.viewModelMapHome.latitudeGPS !== null && this.viewModelMapHome.longitudeGPS !== null){
          this.viewModelMapHome.getAppVersion(this.stateVersionObserver,this.versionResponseObserver);
        }else{
          this.showToast("La aplicaci&oacute;n no ha encontrado su ubicaci&oacute;n a&uacute;n");
        }
      }else{
        this.showAlertDialogNotLocationSettings();
      }
    };

    document.getElementById("destino").onclick = () => {
      if(navigator.geolocation){
        if(this.viewModelMapHome.latitudeGPS !== null && this.viewModelMapHome.longitudeGPS !== null){
          this.viewModelMapHome.getAppVersion(this.stateVersionObserver,this.versionResponseObserver);
        }else{
          this.showToast("La aplicaci&oacute;n no ha encontrado su ubicaci&oacute;n a&uacute;n");
        }
      }else{
        this.showAlertDialogNotLocationSettings();
      }
    };


    this.viewModelMapHome.setIsNecessaryCamera(true);
    this.getLocationRealtime();
    this.viewModelMapHome.startMainCoroutine(this.stateDriverObserver,this.listDriverObserver,this.stateTripObserver,this.tripStateObserver)
    this.checkInitialSharedInformation();
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

  click_details(vehicle){
    this.showAlertDialogCarDetails(vehicle.type,vehicle.details);
  }

  click_order(vehicle){
    this.showAlertDialogConfirmCar(vehicle);
  }




  //Init
  checkInitialSharedInformation(){
    if(UserAccountShared.getIsRatingInAwait()){
      this.rateTheDriver();
      UserAccountShared.setIsRatingInAwait(false);
    }

    let lastTimeInMills = UserAccountShared.getLastPetition();
    let actualTimeInMills = Date.now();

    if(lastTimeInMills > 0){
      if((actualTimeInMills - lastTimeInMills) < 600000){
        this.showAlertLLAwaitSelect(600000 - (actualTimeInMills - lastTimeInMills));
      }
    }

  }

  rateTheDriver(){
    this.liRateDriver();
  }

  showAlertDialogNotVersion(url){
    alert("Versión desactualizada. Descargue la versión android disponible en: "+url);
  }




  //Location
  getLocationRealTime(){
    let marker; // Variable para el marcador
    let geolocate; // Variable para la capa de ubicación en tiempo real
    let lastLocationGps;
    let lastLocationPoint;

    if (marker) {
      marker.remove();
    }

    // Configurar la capa de ubicación en tiempo real
    geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true // Habilitar alta precisión
      },
      trackUserLocation: true, // Rastrear la ubicación en tiempo real
      showUserLocation: true, // Mostrar la ubicación del usuario en el mapa
      showAccuracyCircle: true // Mostrar círculo de precisión
    });
    let context = this;

    map.addControl(geolocate);

    // Escuchar el evento 'geolocate' para manejar actualizaciones de ubicación
    geolocate.on('geolocate', function(e) {
      // Obtener las coordenadas de la ubicación
      const latitudeGps = e.coords.latitude;
      const longitudeGps = e.coords.longitude;
      context.viewModelMapHome.latitudeGPS = latitudeGps;
      context.viewModelMapHome.longitudeGPS = longitudeGps;

      lastLocationGps={latitude:latitudeGps, longitude:longitudeGps};

      if(context.viewModelMapHome.isNecessaryCamera === true){
        context.viewCameraInPoint(latitudeGps, longitudeGps);
        context.setIsNecessaryCamera(false);
      }

      UserAccountShared.setLastLocation(new Point(longitudeGps,latitudeGps));

      // Crear un marcador personalizado (puedes cambiar el icono y estilo según tus necesidades)
      if (!marker) {
        marker = new mapboxgl.Marker({
          color: 'blue', // Color del marcador
          draggable: true, // Permite arrastrar el marcador
        })
          .setLngLat([longitudeGps, latitudeGps]) // Establecer la ubicación del marcador
          .addTo(map); // Agregar marcador al mapa
      } else {
        // Actualizar la posición del marcador en el mapa
        marker.setLngLat([longitudeGps, latitudeGps]);
      }
    });

    // Iniciar la geolocalización
    geolocate.trigger();
  }

  getUserOrigin(){
    let context = this;
    window.addEventListener("message",(event) => {
      if(event.origin !== "Putmap.html"){
        return;
      }

      let resultLocation = event.data.resultLocation;
      if(resultLocation){
        const lastLocationGPS = JSON.parse(resultLocation);
        context.locationOriginAccept(lastLocationGPS.latitude,lastLocationGPS.longitude );
      }else{
        alert("Ha ocurrido un error");
      }
    });
    window.open("PutmapUser.html","_blank");
  }

  getUserDestination(){
    let context = this;
    window.addEventListener("message",(event) => {
      if(event.origin !== "Putmap.html"){
        return;
      }

      let resultLocation = event.data.resultLocation;
      if(resultLocation){
        const lastLocationGPS = JSON.parse(resultLocation);
        context.locationDestinyAccept(lastLocationGPS.latitude,lastLocationGPS.longitude );
      }else{
        alert("Ha ocurrido un error");
      }
    });
    window.open("PutmapUser.html","_blank");
  }




  //Send location
  locationOriginAccept(putMap_originLat,putMap_originLong){

    this.addAnnotationsTripToMap(new Point(putMap_originLong,putMap_originLat),"../img/start_route.png");
    this.viewModelMapHome.setLatitudeClient(putMap_originLat);
    this.viewModelMapHome.setLongitudeClient(putMap_originLong);
    if(this.viewModelMapHome.latitudeDestiny !== null && this.viewModelMapHome.longitudeDestiny !== null){
      this.fetchARoute();
    }
  }

  locationDestinyAccept(putMap_destinyLat,putMap_destinyLong){
    this.addAnnotationsTripToMap(new Point(putMap_destinyLong,putMap_destinyLat),"../img/end_route.png");
    this.viewModelMapHome.setLatitudeDestiny(putMap_destinyLat);
    this.viewModelMapHome.setLongitudeDestiny(putMap_destinyLong);
    if(this.viewModelMapHome.latitudeOrigin !== null && this.viewModelMapHome.longitudeOrigin !== null){
      this.fetchARoute();
    }
  }




  //AlertDialogs
  showAlertDialogNotLocationSettings(){
    alert("Ubicación desactivada. Vaya a los ajustes y encienda la ubicación ");
  }

  showAlertDialogCarDetails(vehicleType, vehicleDetails) {
    alert("Vehículo: "+vehicleType + "\n" + vehicleDetails);
  }

  showAlertDialogConfirmCar(vehicle){
    let result = confirm("¿Está seguro de pedir este taxi?");
    if(result){
      this.viewModelMapHome.addTrip(this.stateAddTripObserver,vehicle.price,"no",vehicle.type);
    }
  }

  liDriverAccept(trip){
    //TODO
  }

  showToast(string){
    const toastEl=document.getElementById("toast");
    let toast=new bootstrap.Toast(toastEl);
    let p=document.getElementById("toast_text");
    p.innerHTML=string;
    toast.show();
  }




  //Methods Maps
  addAnnotationGPSToMap(point, imgUrl){
    if(this.markerGPStoAnnotation){
      this.markerGPStoAnnotation.remove();
    }

    let img = document.createElement('img');
    img.setAttribute("class","marker-gps");
    img.setAttribute("src",imgUrl);

    this.markerGPStoAnnotation = new mapboxgl.Marker(img)
      .setLngLat([point.longitude, point.latitude])
      .addTo(map);
  }

  addAnnotationDrivers(point, imgUrl){
    let img = document.createElement('img');
    img.setAttribute("class","marker-driver");
    img.setAttribute("src",imgUrl);

    this.markerDrivers = new mapboxgl.Marker(img)
      .setLngLat([point.longitude, point.latitude])
      .addTo(map);
  }

  async addAnnotationAnimation(working){
    if(this.viewModelMapHome.latitudeGPS !== null){
      if(this.viewModelMapHome.longitudeGPS !== null){
        if(working){

          this.viewModelMapHome.activateAnimation = working;
          let images = ["../img/animation_1","../img/animation_2","../img/animation_3","../img/animation_4","../img/animation_3","../img/animation_2"];
          var position = 0;
          this.viewCameraInPoint(this.viewModelMapHome.latitudeGPS,this.viewModelMapHome.longitudeGPS);

          while (this.viewModelMapHome.activateAnimation){
            position++;
            if(position === 6) position =0;
            if(this.markerAnimation)this.markerAnimation.remove();

            let img = document.createElement('img');
            img.setAttribute("class","marker-driver");
            img.setAttribute("src",images[position]);

            this.markerGPStoAnnotation = new mapboxgl.Marker(img)
              .setLngLat([this.viewModelMapHome.longitudeGPS, this.viewModelMapHome.latitudeGPS])
              .addTo(map);

            await new Promise(resolve => setTimeout(resolve, 500));
          }

        }else{
          this.viewModelMapHome.activateAnimation = false;
          if(this.markerAnimation)this.markerAnimation.remove();
        }
      }
    }
  }

  viewCameraInPoint(latitudeGps, longitudeGps){
    const camera = map.getFreeCameraOptions();

    const position = [longitudeGps, latitudeGps];
    const altitude = 3000;

    camera.position = mapboxgl.MercatorCoordinate.fromLngLat(position, altitude);
    camera.lookAtPoint([longitudeGps, latitudeGps]);

    map.setFreeCameraOptions(camera);
  }

  updateDriversPositionInMap(){
    if(this.markerDrivers){
      this.markerDrivers.remove();
    }

    if(this.viewModelMapHome.listDrivers !== null){
      for(let f=0;f<this.viewModelMapHome.listDrivers.length;f++){
        if(this.viewModelMapHome.listDrivers[f].longitude !== 0.0 && this.viewModelMapHome.listDrivers[f].latitude !== 0.0){
          this.addAnnotationDrivers(new Point(
            this.viewModelMapHome.listDrivers[f].longitude,
            this.viewModelMapHome.listDrivers[f].latitude
          ), this.getDriverImg(this.viewModelMapHome.listDrivers[f].typeCar));
        }
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

  addAnnotationsTripToMap(point, imgUrl){
    let img = document.createElement('img');
    img.setAttribute("class","marker-driver");
    img.setAttribute("src",imgUrl);

    if(imgUrl === "../img/start_route.png"){
      if(this.markerTripOrigin) this.markerTripOrigin.remove();
      this.markerTripOrigin = new mapboxgl.Marker(img)
        .setLngLat([point.longitude, point.latitude])
        .addTo(map);
    }else{
      if(this.markerTripDestiny) this.markerTripDestiny.remove();
      this.markerTripDestiny = new mapboxgl.Marker(img)
        .setLngLat([point.longitude, point.latitude])
        .addTo(map);
    }
  }




  //Route
  fetchARoute(){
    this.viewModelMapHome.getRoute(this.routeObserver,)
  }



  //Await car
  async showAlertLLAwaitSelect(time){
    UserAccountShared.setLastPetition(Date.now());
    this.addAnnotationAnimation(true);
    document.getElementById("btn-cancelar").style.visibility = "visible";
    document.getElementById("ubication").style.visibility = "hidden";
    document.getElementById("destino").style.visibility = "hidden";
    document.getElementById("container-card-taxi").style.visibility = "hidden";
    document.getElementById("btn-cancelar").onclick = () => {
      this.viewModelMapHome.cancelTimeAwait(this.stateCancelTripObserver)
    }
    await new Promise(resolve => setTimeout(resolve, time));
    this.addAnnotationAnimation(false);
    document.getElementById("btn-cancelar").style.visibility = "hidden";
    document.getElementById("ubication").style.visibility = "visible";
    document.getElementById("destino").style.visibility = "visible";
    document.getElementById("container-card-taxi").style.visibility = "visible";
  }

  liRateDriver(){
    //TODO
  }


}
let mapHomeUser = new MaphomeUser();
