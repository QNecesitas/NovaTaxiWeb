import DriverAccountShared from './auxiliary/DriverAccountShared.js';
import RoutesTools from "./auxiliary/RoutesTools.js";
import ViewModelMapHomeDriver from "./viewModels/ViewModelMapHomeDriver.js";
import Point from "./model/Point.js";


export default class MaphomeDriver {

  viewModel = new ViewModelMapHomeDriver();
  listDriverObserver;
  listTripObserver;
  stateAcceptTripsObserver;
  stateDriverSearch;
  stateDriverUpdateLocation;
  stateListTripObserver;
  map;
  markerGPStoAnnotation;
  markerDrivers;
  routeObserver;

  constructor() {

    //Map
    let lastPointSelected = DriverAccountShared.getLastLocation();
    mapboxgl.accessToken = 'pk.eyJ1Ijoicm9ubnlucCIsImEiOiJjbGl4YTg3bDgwNHpwM2RucTlwdWFkOXN1In0.MlTnx-myS4E3LJUeh5CVbw';
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/ronnynp/cljbmkjqs00gt01qrb2y3bgxj',
      center: [lastPointSelected.longitude, lastPointSelected.latitude],
      zoom: 16.5, // starting zoom,
      pitch: 70.0
    });


    //Observer
    this.listDriverObserver = (it) => {
      this.updateDriversPositionInMap();
    };

    this.listTripObserver = (it) => {
      if (it.length > 0) {
        this.updateRecyclerInfo(it);
        document.getElementById("container-card-viaje").style.visibility = "visible"
      }
    };

    this.stateAcceptTripsObserver = (it) => {
            switch (it) {
        case "SUCCESS":
          RoutesTools.navigationTripDriver = this.viewModel.lastTripSelected;
          window.open("NavigationDriver.html", "_self");
          break;
        case "Aceptado":
          this.showAlertDialogAlreadyAccepted();
          break;
        case "Money":
          this.showAlertDialogEnoughtMoney();
          break;
      }
    };

    this.stateDriverSearch = (it) =>{

    };

    this.stateDriverUpdateLocation = (it) => {

    };

    this.stateListTripObserver = (it) =>{

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
      if (this.map.getSource('route')) {
        this.map.getSource('route').setData(geojson);
      }
      // otherwise, we'll make a new request
      else {
        this.map.addLayer({
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
      this.viewCameraInPoint(this.viewModel.latitudeDestiny,this.viewModel.longitudeDestiny);
    document.getElementById("progress").style.visibility = "hidden";
    };



    //Listeners
     
    document.getElementById("ubication").onclick = ()=> {
      if(this.viewModel.latitudeGps && this.viewModel.longitudeGps){
        if(this.viewModel.isSharedLocation){
          this.sendNotification("La aplicación está dejando de compartir su ubicación en tiempo real");
          document.querySelector("#iconBtnShare").style.content = "url('img/play_arrow_black_24dp.svg')";
          document.getElementById("txt-ubication").innerHTML = "Compartir ubicaci&oacute;n";
          this.viewModel.setIsShare(false);
          document.getElementById("container-card-viaje").style.visibility = "hidden";
          this.viewModel.updateDriverLocationStop(this.stateDriverUpdateLocation);
        }else{
          this.sendNotification("La aplicación está compartiendo su ubicación en tiempo real");
          this.viewModel.getAllTrips(this.stateDriverUpdateLocation,this.listTripObserver);
          document.getElementById("iconBtnShare").style.content = "url('img/stop_circle_FILL0_wght400_GRAD0_opsz24.svg')";
          document.getElementById("txt-ubication").innerHTML = "No compartir ubicaci&oacute;n";
          this.viewModel.setIsShare(true);
        } 
      }else{
        alert("Su posición es aún desconocida");
      }
    };

    document.getElementById("settings").onclick = () => {
      window.open("settingDriver.html", "_self");
    };


    //Start search
    this.viewModel.setIsNecessaryCamera(true);
    this.getLocationRealTime();
    this.viewModel.startMainCoroutine(this.stateDriverSearch,this.listDriverObserver,this.stateDriverUpdateLocation,this.stateDriverUpdateLocation,this.listTripObserver);
  }

//Init
  addRoutePoints(trip){
    if(trip){
      let pointOrigin = new Point(trip.longOri,trip.latOri);
     
      if(pointOrigin){
        this.addAnnotationsTripToMap(pointOrigin,"img/start_route.png");
      }
      let pointDestination = new Point(trip.longDest,trip.latDest);
      if(pointDestination){
        this.addAnnotationsTripToMap(pointDestination,"img/end_route.png");
      }

    }
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
      context.viewModel.latitudeGps = latitudeGps;
      context.viewModel.longitudeGps = longitudeGps;

      lastLocationGps={latitude:latitudeGps, longitude:longitudeGps};

      if(context.viewModel.isNecessaryCamera === true){
        context.viewCameraInPoint(latitudeGps, longitudeGps);
        context.viewModel.setIsNecessaryCamera(false);
      }

      DriverAccountShared.setLastLocation(new Point(longitudeGps,latitudeGps));
      // Crear un marcador personalizado (puedes cambiar el icono y estilo según tus necesidades)
      context.addAnnotationGPSToMap(new Point(longitudeGps, latitudeGps));
    });

    // Iniciar la geolocalización
    geolocate.trigger();
  }




  //Map functions
  viewCameraInPoint(latitudeGps, longitudeGps){
    const camera = this.map.getFreeCameraOptions();

    const position = [longitudeGps, latitudeGps];
    const altitude = 3000;

    camera.position = mapboxgl.MercatorCoordinate.fromLngLat(position, altitude);
    camera.lookAtPoint([longitudeGps, latitudeGps]);

    this.map.setFreeCameraOptions(camera);
  }

  addAnnotationGPSToMap(point) {
    const longitudeGps  = point.longitude;
    const latitudeGps = point.latitude;

    if (!this.markerGPStoAnnotation) {
      this.markerGPStoAnnotation = new mapboxgl.Marker({
        color: 'red', // Color del marcador
        draggable: true, // Permite arrastrar el marcador
      })
        .setLngLat([this.viewModel.longitudeGps, this.viewModel.latitudeGps]) // Establecer la ubicación del marcador
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

  updateDriversPositionInMap(){
    if(this.markerDrivers){
      this.markerDrivers.remove();
    }

    if(this.viewModel.listDrivers){
      for(let f=0;f<this.viewModel.listDrivers.length;f++){
        if(this.viewModel.listDrivers[f].longitude !== 0.0 && this.viewModelMapHome.listDrivers[f].latitude !== 0.0){
          this.addAnnotationDrivers(new Point(
            this.viewModel.listDrivers[f].longitude,
            this.sviewModel.listDrivers[f].latitude
          ), this.getDriverMarkerImg(this.viewModel.listDrivers[f].typeCar));
        }
      }
    }

  }


addAnnotationsTripToMap(point, imgUrl){
    let img = document.createElement('img');
    img.setAttribute("class","marker-trip");
    img.setAttribute("src",imgUrl);

    if(imgUrl === "img/start_route.png"){
      if (this.markerTripOrigin) this.markerTripOrigin.remove();
      this.markerTripOrigin = new mapboxgl.Marker(img)
        .setLngLat([point.longitude, point.latitude])
        .addTo(this.map);
    }else{
      if (this.markerTripDestiny) this.markerTripDestiny.remove();
      this.markerTripDestiny = new mapboxgl.Marker(img)
        .setLngLat([point.longitude, point.latitude])
        .addTo(this.map);
    }
  }

  //Route
  fetchARoute(trip){
    this.addRoutePoints(trip);
    this.viewModel.getRoute(this.routeObserver,trip.latOri,trip.longOri,trip.latDest,trip.longDest);
        document.getElementById("progress").style.visibility = "visible";
  }



  //Auxiliary
  sendNotification(message){
    if(!("Notification" in window)){
      alert(message);
    }else if(Notification.permission === "granted"){
      const notification = new Notification(message);
    }else if(Notification.permission !== "denied"){
      Notification.requestPermission().then(function (permission) {
        if(permission === "granted"){
          const notification = new Notification(message);
        }
      });
    }
  }


  updateRecyclerInfo(json_it) {
    if (json_it.length > 0) {
      document.getElementById("container-card-viaje").style.visibility = "visible";
      document.getElementById("container-card-viaje").innerHTML="";
      for (let f = 0; f < json_it.length; f++) {
       
        let divCardTaxi = document.createElement("div");
        divCardTaxi.setAttribute("class", "card-taxi");

        let divCardRouteImg = document.createElement("div");
        divCardRouteImg.setAttribute("class", "card-taxi-img");
        let imgRouteTaxiImg = document.createElement("img");
        imgRouteTaxiImg.setAttribute("src", "./img/route_FILL1_wght400_GRAD0_opsz24.svg");
        divCardTaxi.setAttribute("alt", "imagen de taxi");

        let divIndividual= document.createElement("div");

        let divContainerP = document.createElement("div");
        divContainerP.setAttribute("class", "container-p");
        let pPrice = document.createElement("p");
        pPrice.setAttribute("class", "card-taxi-p");
        pPrice.innerHTML = "Precio del viaje: " + json_it[0].travelPrice;
        
        let pDistCar = document.createElement("p");
        pDistCar.setAttribute("class", "card-taxi-p");
        pDistCar.innerHTML = "Distancia: " + json_it[0].distance;

        let divContainerA = document.createElement("div");
        divContainerA.setAttribute("class", "container-a");

        let aRoute = document.createElement("p");
        aRoute.setAttribute("class", "card-taxi-a");
        aRoute.innerHTML = "Ver ruta";

        let aDoRoute = document.createElement("p");
        aDoRoute.setAttribute("class", "card-taxi-a");
        aDoRoute.innerHTML= "Hacer ruta";


        divCardRouteImg.appendChild(imgRouteTaxiImg);
        divContainerP.appendChild(pPrice);
        divContainerP.appendChild(pDistCar);
        divContainerA.appendChild(aRoute);
        divContainerA.appendChild(aDoRoute);

        divIndividual.appendChild(divContainerP);
        divIndividual.appendChild(divContainerA);

        divCardTaxi.appendChild(divCardRouteImg);
        divCardTaxi.appendChild(divIndividual);


        aDoRoute.addEventListener("click", () =>{
          this.showAlertDialogAcceptRoute(json_it[f]);
        });
        aRoute.addEventListener("click", () => {
          this.fetchARoute(json_it[f])
        });


        document.getElementById("container-card-viaje").appendChild(divCardTaxi);

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




  //AlertDialogs
  showAlertDialogNotLocationSettings(){
    alert("Ubicación desactivada. Vaya a los ajustes y encienda la ubicación ");
  }

  showAlertDialogAcceptRoute(trip){
    const result = confirm("¿Desea realizar esta ruta?");
    if(result){
      RoutesTools.navigationTripDriver = trip;
      this.viewModel.setLastTripSelected(trip);
           this.viewModel.acceptTrips(this.stateAcceptTripsObserver, trip);
    }
  }
 
  showAlertDialogAlreadyAccepted(){
    alert("Acaba de ser aceptado este recorrido por otro conductor");
  }

  showAlertDialogEnoughtMoney(){
    alert("Su cuenta no posee el saldo suficiente para realizar este viaje. Póngase en contacto con los administradores de la aplicación");
  }




}
let maphomeDriver = new MaphomeDriver();