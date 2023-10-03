import UserAccountShared from './auxiliary/UserAccountShared.js';
import RoutesTools from "./auxiliary/RoutesTools.js";
import Point from "./model/Point.js";
import ViewModelNavigationUser from "./viewModels/ViewModelNavigationUSer.js";


export default class NavigationUser {


  map;
  driverObserver;
  viewModel = new ViewModelNavigationUser();
  actualTripObserver;
  isShowedTripStartedDialog = false;
  actualPricesObserver;
  stateDriverObserver;
  stateTripObserver;
  markerGps;
  markerGPStoAnnotation;
  routeObserverStep1;
  routeObserverStep2;
  statePricesObserver;


  constructor(){
    let lastPointSelected = UserAccountShared.getLastLocation();
    mapboxgl.accessToken = 'pk.eyJ1Ijoicm9ubnlucCIsImEiOiJjbGl4YTg3bDgwNHpwM2RucTlwdWFkOXN1In0.MlTnx-myS4E3LJUeh5CVbw';
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/ronnynp/cljbmkjqs00gt01qrb2y3bgxj',
      center: [lastPointSelected.longitude, lastPointSelected.latitude],
      zoom: 16.5, // starting zoom,
      pitch: 70.0
    });
    let context = this;


    //Observers
    this.driverObserver = (it) => {
      this.viewModel.setLatitudeDriver(it.latitude);
      this.viewModel.setLongitudeDriver(it.longitude);
      this.addAnnotationDrivers(new Point(it.longitude, it.latitude),getDriverIcon(it));
      if(RoutesTools.navigationTripUser) {
        this.fetchARoute(RoutesTools.navigationTripUser);
      }
    };

    this.actualTripObserver = (it) => {
      switch (it.state){
        case "Espera por cliente":
          this.showAwaitOptions(true);
          this.sendNotification("El vehículo ha llegado y está a la espera");
          break;
        case "En viaje":
          this.showAwaitOptions(false);
          if(!this.isShowedTripStartedDialog) {
            this.isShowedTripStartedDialog = true;
            this.showAlertDialogStartedTrip()
          }
          break;
        case "Finalizado":
          if(this.viewModel.actualTrip){
            this.liFinishedTrip(this.viewModel.actualTrip);
          }
          break;
      }
    };

    this.actualPricesObserver = (it) => {
      if(it){
        if(it.length > 0){
          const prices = it[0];
          this.showAlertDialogPrices(prices.delayTime, prices.priceDelay)
        }else{
          alert("Se ha producido un error. Compruebe su conexión e intente nuevamente");
        }
      }else{
        alert("Se ha producido un error. Compruebe su conexión e intente nuevamente");
      }
    };

    this.stateDriverObserver = (it) => {};

    this.stateTripObserver = (it) => {};

    this.routeObserverStep1 = (it) => {
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

    };

    this.routeObserverStep2 = (it) => {
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

    };

    this.statePricesObserver = (it) => {

    };


    this.getLocationRealtime();
    UserAccountShared.setIsRatingInAwait(true);
    if(RoutesTools.navigationTripUser){
      UserAccountShared.setLastDriver(RoutesTools.navigationTripUser.fk_driver);
    }
    this.addRoutePoints();
    if(RoutesTools.navigationTripUser){
      this.viewCameraInPoint(Point(RoutesTools.navigationTripUser.longOri,RoutesTools.navigationTripUser.latOri))
    }
    this.startMainRoutine();



  }



  //Init
  addRoutePoints(){
    if(RoutesTools.navigationTripUser){
      let pointOrigin = new Point(RoutesTools.navigationTripUser.longOri,RoutesTools.navigationTripUser.latOri);
      if(pointOrigin){
        this.addAnnotationsTripToMap(pointOrigin,"img/start_route.png");
      }
      let pointDestination = new Point(RoutesTools.navigationTripUser.longDest,RoutesTools.navigationTripUser.latDest);
      if(pointDestination){
        this.addAnnotationsTripToMap(pointDestination,"img/end_route.png");
      }

    }
  }

  async startMainRoutine(){
    while (true){
      if(RoutesTools.navigationTripUser) {
        this.viewModel.getDriverPosition(this.stateDriverObserver,this.driverObserver, RoutesTools.navigationTripUser.fk_driver);
        this.fetchARoute(RoutesTools.navigationTripUser);
        if(UserAccountShared.getUserEmail()){
          this.viewModel.fetchStateInTrip(this.stateTripObserver,this.actualTripObserver,UserAccountShared.getUserEmail());
        }
        await new Promise(resolve => setTimeout(resolve, 12000));
      }
    }
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

  getLocationRealtime(){
    let geolocate; // Variable para la capa de ubicación en tiempo real
    let lastLocationGps;
    let lastLocationPoint;
    let context = this;
    var isNecessaryCamera = true;

    if (this.markerGps) {
      this.markerGps.remove();
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
      context.viewModel.latitudeGPS = latitudeGps;
      context.viewModel.longitudeGPS = longitudeGps;


      lastLocationGps={latitude:latitudeGps, longitude:longitudeGps};

      if(isNecessaryCamera){
        context.viewCameraInPoint(latitudeGps, longitudeGps);
        isNecessaryCamera = false
      }

      UserAccountShared.setLastLocation(new Point(longitudeGps,latitudeGps));

      context.addAnnotationGPSToMap(new Point(longitudeGps, latitudeGps));
    });

    // Iniciar la geolocalización
    geolocate.trigger();
  }



  //Alert Dialoga
  showAlertDialogNotLocationSettings(){
    alert("Ubicación desactivada. Vaya a los ajustes y encienda la ubicación ");
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

  viewCameraInPoint(latitudeGps, longitudeGps){
    const camera = this.map.getFreeCameraOptions();

    const position = [longitudeGps, latitudeGps];
    const altitude = 3000;

    camera.position = mapboxgl.MercatorCoordinate.fromLngLat(position, altitude);
    camera.lookAtPoint([longitudeGps, latitudeGps]);

    this.map.setFreeCameraOptions(camera);
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
    const originPoint = new Point(trip.longOri, trip.latOri);
    const destPoint = new Point(trip.longDest, trip.latDest);
    const driverPoint =  new Point(this.viewModel.longitudeGPS, this.viewModel);

    if(this.viewModel.stateRoute === "STARTING" || this.viewModel.stateRoute === "NEAR_AWAITING"){
      this.setRouteOptions2Step(originPoint, destPoint, driverPoint)
    }
    if(this.viewModel.stateRoute === "PAST_AWAITING" || this.viewModel.stateRoute === "NEAR_FINISHING"){
      this.setRouteOptions1Step(destPoint, driverPoint)
    }
    document.getElementById("progress").style.visibility = "visible";
  }

  setRouteOptions1Step(destP, driverP){
    this.viewModel.getRoute(this.routeObserverStep1,driverP.latitude,driverP.longitude,destP.latitude, destP.longitude);
  }

  setRouteOptions2Step(originP, destP, driverP){
    this.viewModel.getRouteTriple(this.routeObserverStep2,driverP.latitude,driverP.longitude, originP.latitude, originP.longitude, destP.latitude, destP.longitude);
  }



  //Route await
  //TODO Reparar los id
  showAwaitOptions(open){
    if(open){
      document.getElementById("clAwait").style.visibility = "visible";
      document.getElementById("llBtnAwait").onclick = () =>{
        this.viewModel.fetchPrices(this.statePricesObserver,this.actualPricesObserver);
      }
    }else{
      document.getElementById("clAwait").style.visibility = "hidden";
    }
  }

  //TODO Reparar los id
  showAlertDialogPrices(time, price){
    alert(`Cada ${time} minutos de espera se suman ${price} CUP al precio total`);
  }

  showAlertDialogStartedTrip(){
    alert("Su viaje ha comenzado");
  }

  //TODO Nohemi work
  liFinishedTrip(trip){

  }

}
let navigationUser = new NavigationUser();
