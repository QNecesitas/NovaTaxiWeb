import UserAccountShared from './auxiliary/UserAccountShared.js';
import ViewModelMapHomeUser from './viewModels/ViewModelMapHomeUser.js';
import User from "./model/User.js";
import Point from "./model/Point.js";
import RoutesTools from "./auxiliary/RoutesTools.js";

export default class MaphomeUser {

  map;
  viewModelMapHome = new ViewModelMapHomeUser();
  listDriverObserver;
  statePricesObserver;
  listVehicleObserver;
  stateAddTripObserver;
  stateCancelTripObserver;
  stateRateObserver;
  tripResponseObserver;
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
  responsePricesObserver;
  liModalTravel;
  liModalRate;

  constructor() {
    let context = this;

    //Map
    let lastPointSelected = UserAccountShared.getLastLocation();
    mapboxgl.accessToken = 'pk.eyJ1Ijoicm9ubnlucCIsImEiOiJjbGl4YTg3bDgwNHpwM2RucTlwdWFkOXN1In0.MlTnx-myS4E3LJUeh5CVbw';
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/ronnynp/cljbmkjqs00gt01qrb2y3bgxj',
      center: [lastPointSelected.longitude,lastPointSelected.latitude],
      zoom: 16.5, // starting zoom,
      pitch: 70.0
    });

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

    this.tripResponseObserver = (it) => {
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
          document.getElementById("progress").style.visibility = "hidden";
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

    this.responsePricesObserver = (it, distance) => {
      this.viewModelMapHome.makeVehiclesList(it[0],distance,this.listVehicleObserver);
    };

    this.routeObserver = (it) => {
      const data = it.routes[0];
      const route = data.geometry.coordinates;
      const tripActualDistance = data.distance;
      const geojson = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route
        }
      };
      // if the route already exists on the map, we'll reset it using setData
      if (context.map.getSource('route')) {
        context.map.getSource('route').setData(geojson);
      }
      // otherwise, we'll make a new request
      else {
        context.map.addLayer({
          id: 'route',
          type: 'line',
          source: {
            type: 'geojson',
            data: geojson
          },
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#0061ff',
            'line-width': 5,
            'line-opacity': 1
          }
        });
      }

      //App logic
      document.getElementById("progress").style.visibility = "hidden";
      document.getElementById("container-card-taxi").style.visibility = "visible";
      this.viewCameraInPoint(this.viewModelMapHome.latitudeDestiny,this.viewModelMapHome.longitudeDestiny);
      this.viewModelMapHome.getPrices(tripActualDistance,this.statePricesObserver,this.responsePricesObserver);

    };



    //Listeners
    
    document.getElementById("settings").onclick = () => {
      window.open("SettingUser.html","_self");
    };

    document.getElementById("ubication").onclick = () => {
      if(navigator.geolocation){
        if(this.viewModelMapHome.latitudeGPS && this.viewModelMapHome.longitudeGPS){
          this.getUserOrigin();
        }else{
          alert("La aplicación no ha encontrado su ubicación aún");
        }
      }else{
        this.showAlertDialogNotLocationSettings();
      }
    };

    document.getElementById("destino").onclick = () => {
      if(navigator.geolocation){
        if(this.viewModelMapHome.latitudeGPS && this.viewModelMapHome.longitudeGPS){
          this.viewModelMapHome.getAppVersion(this.stateVersionObserver,this.versionResponseObserver);
        }else{
          alert("La aplicación no ha encontrado su ubicación aún");
        }
      }else{
        this.showAlertDialogNotLocationSettings();
      }
    };


    this.viewModelMapHome.setIsNecessaryCamera(true);
    this.getLocationRealTime();
    this.viewModelMapHome.startMainCoroutine(this.stateDriverObserver,this.listDriverObserver,this.stateTripObserver,this.tripResponseObserver);
    this.checkInitialSharedInformation();
  }


  //Recycler
  updateRecyclerInfo(json_it){
    if(json_it.length > 0){
      document.getElementById("container-card-taxi").style.visibility = "visible";

      for(let f=0;f<json_it.length;f++){

        let divCardTaxi=document.createElement("div");divCardTaxi.setAttribute("class","card-taxi");
        let driverImg = this.getDriverImg(json_it[f].type);
        let divCardTaxiImg=document.createElement("div");divCardTaxiImg.setAttribute("class","card-taxi-img");
        let imgCardTaxiImg=document.createElement("img");imgCardTaxiImg.setAttribute("src",driverImg);divCardTaxi.setAttribute("alt","imagen de taxi");
        let divIndividual = document.createElement("div");
        let divContainerP = document.createElement("div");divContainerP.setAttribute("class","container-p");
        let pTypeCar = document.createElement("p");pTypeCar.setAttribute("class","card-taxi-p");pTypeCar.innerHTML = "Veh&iacute;culo: "+ json_it[f].type;
        let pPriceCar = document.createElement("p");pPriceCar.setAttribute("class","card-taxi-p");pPriceCar.innerHTML = "Precio: "+ json_it[f].price +" CUP";
        let divContainerA = document.createElement("div");divContainerA.setAttribute("class","container-a");
        let aDetails = document.createElement("a");aDetails.setAttribute("class","card-taxi-a");aDetails.innerHTML = "M&aacute;s detalles";
        let aOrder = document.createElement("a");aOrder.setAttribute("class","card-taxi-a");aOrder.innerHTML = "Pedir Taxi";
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
    let context = this;

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

    this.map.addControl(geolocate);

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
        context.viewModelMapHome.setIsNecessaryCamera(false);
      }

      UserAccountShared.setLastLocation(new Point(longitudeGps,latitudeGps));

      context.addAnnotationGPSToMap(new Point(longitudeGps, latitudeGps));
    });

    // Iniciar la geolocalización
    geolocate.trigger();
  }

  getUserOrigin(){
    let context = this;

    const miCanal = new BroadcastChannel("putmap_channel");

    const eventInstance = function(event) {
      let resultLocation = event.data;
      if(resultLocation){
        const lastLocationGPS = JSON.parse(resultLocation);
        context.locationOriginAccept(lastLocationGPS.latitude,lastLocationGPS.longitude );
      }else{
        alert("Ha ocurrido un error");
      }

      miCanal.removeEventListener("message",eventInstance);
    };
    miCanal.addEventListener("message", eventInstance);
    window.sessionStorage.setItem("putMap_func", "putmap_origin");
    window.open("PutmapUser.html","_blank");
  }

  getUserDestination(){
    let context = this;

    const miCanal = new BroadcastChannel("putmap_channel");
    const eventInstance = function(event) {

      let resultLocation = event.data;
      if(resultLocation){
        const lastLocationGPS = JSON.parse(resultLocation);
        context.locationDestinyAccept(lastLocationGPS.latitude,lastLocationGPS.longitude );
      }else{
        alert("Ha ocurrido un error");
      }

      miCanal.removeEventListener("message",eventInstance);
    };
    miCanal.addEventListener("message", eventInstance);
    window.sessionStorage.setItem("putMap_func", "putmap_destiny");
    window.open("PutmapUser.html","_blank");
  }




  //Send location
  locationOriginAccept(putMap_originLat,putMap_originLong){

    this.addAnnotationsTripToMap(new Point(putMap_originLong,putMap_originLat),"img/start_route.png");
    this.viewModelMapHome.setLatitudeClient(putMap_originLat);
    this.viewModelMapHome.setLongitudeClient(putMap_originLong);
    if(this.viewModelMapHome.latitudeDestiny && this.viewModelMapHome.longitudeDestiny){
      this.fetchARoute();
    }
  }

  locationDestinyAccept(putMap_destinyLat,putMap_destinyLong){
    this.addAnnotationsTripToMap(new Point(putMap_destinyLong,putMap_destinyLat),"img/end_route.png");
    this.viewModelMapHome.setLatitudeDestiny(putMap_destinyLat);
    this.viewModelMapHome.setLongitudeDestiny(putMap_destinyLong);
    if(this.viewModelMapHome.latitudeOrigin && this.viewModelMapHome.longitudeOrigin){
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
    if(!this.liModalTravel) {
      this.liModalTravel =new bootstrap.Modal('#exampleModal', {
        keyboard: false
        });

      this.liModalTravel.show();

      document.getElementById("btn-acep").onclick = () =>{
      };
      document.getElementById("btn-sc").onclick = () =>{
      };
      var context=this;
      context.liModalTravel._element.addEventListener('click', function(event) {

        if (event.target.id === "btn-acep"){
          context.liModalTravel.hide();
          window.sessionStorage.setItem("emailSelected", trip.fk_driver);
          window.open("InfoDriver.html", "_self");
        }

        if (event.target.id === "btn-sc"){
          context.liModalTravel.hide();
          RoutesTools.navigationTripDriver = trip;
          context.showAlertLLAwaitSelect(0);
          window.open("NavigationUser.html", "_self");
        }

      });
    }
  }




  //Methods Maps
  addAnnotationGPSToMap(point) {
    const longitudeGps  = point.longitude;
    const latitudeGps = point.latitude;

    if (!this.markerGPStoAnnotation) {
      this.markerGPStoAnnotation = new mapboxgl.Marker({
        color: 'red', // Color del marcador
        draggable: true, // Permite arrastrar el marcador
      })
        .setLngLat([longitudeGps, latitudeGps]) // Establecer la ubicación del marcador
        .addTo(this.map); // Agregar marcador al mapa
    } else {
      // Actualizar la posición del marcador en el mapa
      this.markerGPStoAnnotation.setLngLat([longitudeGps, latitudeGps]);
    }
  }

  addAnnotationDrivers(point, imgUrl){
    let img = document.createElement('img');
    img.setAttribute("class","marker-driver");
    img.setAttribute("src",imgUrl);

    this.markerDrivers = new mapboxgl.Marker(img)
      .setLngLat([point.longitude, point.latitude])
      .addTo(this.map);
  }

  async addAnnotationAnimation(working){
    if(this.viewModelMapHome.latitudeGPS){
      if(this.viewModelMapHome.longitudeGPS){
        if(working){

          this.viewModelMapHome.activateAnimation = working;
          let images = ["img/animation_1.png","img/animation_2.png","img/animation_3.png","img/animation_4.png","img/animation_3.png","img/animation_2.png"];
          var position = 0;
          this.viewCameraInPoint(this.viewModelMapHome.latitudeGPS,this.viewModelMapHome.longitudeGPS);

          while (this.viewModelMapHome.activateAnimation){
            position++;
            if(position === 6) position =0;
            if(this.markerAnimation)this.markerAnimation.remove();

            let img = document.createElement('img');
            img.setAttribute("class","marker-animation");
            img.setAttribute("src",images[position]);

            this.markerAnimation = new mapboxgl.Marker(img)
              .setLngLat([this.viewModelMapHome.longitudeGPS, this.viewModelMapHome.latitudeGPS])
              .addTo(this.map);

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
    const camera = this.map.getFreeCameraOptions();

    const position = [longitudeGps, latitudeGps];
    const altitude = 3000;

    camera.position = mapboxgl.MercatorCoordinate.fromLngLat(position, altitude);
    camera.lookAtPoint([longitudeGps, latitudeGps]);

    this.map.setFreeCameraOptions(camera);
  }

  updateDriversPositionInMap(){
    if(this.markerDrivers){
      this.markerDrivers.remove();
    }

    if(this.viewModelMapHome.listDrivers){
      for(let f=0;f<this.viewModelMapHome.listDrivers.length;f++){
        if(this.viewModelMapHome.listDrivers[f].longitude !== 0.0 && this.viewModelMapHome.listDrivers[f].latitude !== 0.0){
          this.addAnnotationDrivers(new Point(
            this.viewModelMapHome.listDrivers[f].longitude,
            this.viewModelMapHome.listDrivers[f].latitude
          ), this.getDriverMarkerImg(this.viewModelMapHome.listDrivers[f].typeCar));
        }
      }
    }

  }

  getDriverImg(vehicleType){
    switch(vehicleType) {
      case "Auto básico" :
        return "img/baseline_drive_eta_24.png";
        break;
      case "Auto de confort" :
        return "img/vector_car.png";
        break;
      case "Auto familiar" :
        return "img/vector_familiar.png";
        break;
      case "Triciclo" :
        return "img/vector_tricycle.png";
        break;
      case "Motor" :
        return "img/baseline_directions_bike_24.png";
        break;
      case "Bicitaxi" :
        return "img/vector_bicitaxi.png";
        break;
      default :
        return "img/baseline_drive_eta_24.png";
        break;
    }
  }

  getDriverMarkerImg(vehicleType){
    switch(vehicleType) {
      case "Auto básico" :
        return "img/dirver_icon_simple.png";
        break;
      case "Auto de confort" :
        return "img/dirver_icon_confort.png";
        break;
      case "Auto familiar" :
        return "img/dirver_icon_familiar.png";
        break;
      case "Triciclo" :
        return "img/dirver_icon_triciclo.png";
        break;
      case "Motor" :
        return "img/dirver_icon_motorb.png";
        break;
      case "Bicitaxi" :
        return "img/dirver_icon_bicitaxi.png";
        break;
      default :
        return "img/dirver_icon_simple.png";
        break;
    }
  }

  addAnnotationsTripToMap(point, imgUrl){
    let img = document.createElement('img');
    img.setAttribute("class","marker-trip");
    img.setAttribute("src",imgUrl);
    const putMap_func = window.sessionStorage.getItem("putMap_func");

    if(imgUrl === "img/start_route.png"){
      if(putMap_func === "putmap_origin") {
        if (this.markerTripOrigin) this.markerTripOrigin.remove();
        this.markerTripOrigin = new mapboxgl.Marker(img)
          .setLngLat([point.longitude, point.latitude])
          .addTo(this.map);
      }
    }else{
      if(putMap_func === "putmap_destiny") {
        if (this.markerTripDestiny) this.markerTripDestiny.remove();
        this.markerTripDestiny = new mapboxgl.Marker(img)
          .setLngLat([point.longitude, point.latitude])
          .addTo(this.map);
      }
    }
  }




  //Route
  fetchARoute(){
    this.viewModelMapHome.getRoute(this.routeObserver,this.viewModelMapHome.latitudeOrigin,this.viewModelMapHome.longitudeOrigin,this.viewModelMapHome.latitudeDestiny,this.viewModelMapHome.longitudeDestiny);
    document.getElementById("progress").style.visibility = "visible";
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
    };
    await new Promise(resolve => setTimeout(resolve, time));
    this.addAnnotationAnimation(false);
    document.getElementById("btn-cancelar").style.visibility = "hidden";
    document.getElementById("ubication").style.visibility = "visible";
    document.getElementById("destino").style.visibility = "visible";
    document.getElementById("container-card-taxi").style.visibility = "visible";
    this.markerAnimation.remove();
  }

  liRateDriver(){
    if(!this.liModalRate) {
      var star1 = 0;
      var star2 = 0;
      var star3 = 0;
      var star4 = 0;
      var star5 = 0;

      this.liModalRate =new bootstrap.Modal('#exampleModal2', {
        keyboard: false
        });

      this.liModalRate.show();
      
      const context = this;
      var cont=0;
      context.liModalRate._element.addEventListener('click', function(event) {


        if (event.target.id === "liAccept"){
          context.liModalRate.hide();
          const rate = star1 + star2 + star3 + star4 + star5;
          context.viewModelMapHome.rateTaxi(context.stateRateObserver, rate);
        }

        if (event.target.id === "btnStar1"){
          if (star1 === 0) {
            document.getElementById("btnStar1").style.content= "url('img/star_light.png')";
            star1 = 1;
            cont ++;
          } else {
            document.getElementById("btnStar1").style.content = "img/star_gray.png";
            star1 = 0;
            cont --;
          }
        }

        if (event.target.id === "btnStar2"){
          if (star2 === 0) {
            document.getElementById("btnStar2").style.content= "url('img/star_light.png')";
            star2 = 1;
            cont ++;
          } else {
            document.getElementById("btnStar2").style.content = "img/star_gray.png";
            star2 = 0;
            cont --;
          }
        }

        if (event.target.id === "btnStar3"){
          if (star3 === 0) {
            document.getElementById("btnStar3").style.content= "url('img/star_light.png')";
            star3 = 1;
            cont ++;
          } else {
            document.getElementById("btnStar3").style.content = "img/star_gray.png";
            star3 = 0;
            cont --;
          }
        }

        if (event.target.id === "btnStar4"){
          if (star4 === 0) {
            document.getElementById("btnStar4").style.content= "url('img/star_light.png')";
            star4 = 1;
            cont ++;
          } else {
            document.getElementById("btnStar4").style.content = "img/star_gray.png";
            star4 = 0;
            cont --;
          }
        }

        if (event.target.id === "btnStar5"){
          if (star5 === 0) {
           document.getElementById("btnStar5").style.content= "url('img/star_light.png')";
           star5 = 1;
           cont ++;
          } else {
            document.getElementById("btnStar5").style.content = "img/star_gray.png";
            star5 = 0;
            cont --;
          }
        }

      });

    }
  }


}
let mapHomeUser = new MaphomeUser();


