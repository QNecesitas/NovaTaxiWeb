import DriverAccountShared from './auxiliary/DriverAccountShared.js';
import RoutesTools from "./auxiliary/RoutesTools.js";
import Point from "./model/Point.js";
import ViewModelNavigationDriver from "./viewModels/ViewModelNavigationDriver.js";


export default class NavigationDriver {


  routeObserver;
  map;
  markerGps;
  markerTripDestiny
  markerGPStoAnnotation;
  markerTripOrigin;
  viewModel = new ViewModelNavigationDriver();
  stateRouteObserver;
  stateUpdateInAwaitObserver;
  stateUpdateInTravelObserver;
  stateUpdateFinishedObserver;



  constructor(){

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


    this.stateRouteObserver = (it) =>{
      switch (it){
        case "STARTING":
          break;
        case "NEAR_AWAITING":
          this.showNearAwaitOptions(true);
          break;
        case "AWAITING":
          this.showNearAwaitOptions(false);
          this.showInAwaitOptions(true);
          break;
        case "PAST_AWAITING":
          this.showInAwaitOptions(false);
          break;
        case "NEAR_FINISHING":
          this.showNearFinishOptions(true);
          break;;
        case "FINISHED":
          this.showNearFinishOptions(false);
          if(this.viewModel.actualTrip){
            this.liFinishedTrip(this.viewModel.actualTrip);
          }
          break;
      }
    };

    this.stateUpdateInAwaitObserver = () =>{
      this.viewModel.setRouteState("AWAITING");
    };

    this.stateUpdateInTravelObserver = () =>{
      this.viewModel.setRouteState("PAST_AWAITING");
    };

    this.stateUpdateFinishedObserver = (it) => {
      switch (it){
        case "SUCCESS":
          this.viewModel.setRouteState("FINISHED");
          break;
        case "LOADING":
          break;
        case "ERROR":
          alert("Se ha producido un error. Compruebe su conexión e intente nuevamente");
          break;
      }
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
    //TODO Real time listener, is only for code
    document.getElementById("stop").onclick = () => {
      this.viewModel.setTimeInMillsStart(Date.now());
      this.showNearFinishOptions(false);
      this.viewModel.setStatusRouteToInAwait(this.stateRouteObserver);
    };


    this.viewModel.setRouteState("STARTING");
    this.addRoutePoints();
    this.getLocationRealtimeFirstTime();
    if(RoutesTools.navigationTripDriver){
      this.viewCameraInPoint(Point(
        RoutesTools.navigationTripDriver.longitude,
        RoutesTools.navigationTripDriver.latitude
      ))
    }
    this.startMainRoutine();

  }


  //Init
  addRoutePoints(){
    if(RoutesTools.navigationTripDriver) {
      let pointOrigin = Point(RoutesTools.navigationTripDriver.longOri,RoutesTools.navigationTripDriver.latOri);
      this.addAnnotationsTripToMap(pointOrigin, "img/start_route.png")
    }

    if(RoutesTools.navigationTripDriver) {
      let pointDest = Point(RoutesTools.navigationTripDriver.longDest,RoutesTools.navigationTripDriver.latDest);
      this.addAnnotationsTripToMap(pointDest, "img/end_route.png")
    }


  }

  async startMainRoutine(){
    while (true){
      if(RoutesTools.navigationTripDriver) {
        await this.fetchARoute(RoutesTools.navigationTripDriver);
        await this.viewModel.checkIsNearFromAwaitForClient(RoutesTools.navigationTripDriver);
        await this.viewModel.checkIsNearFromFinished(RoutesTools.navigationTripDriver);
        await new Promise(resolve => setTimeout(resolve, 12000));
      }
    }
  }



  //Location
  getLocationRealTime(){
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

      DriverAccountShared.setLastLocation(new Point(longitudeGps,latitudeGps));

      context.addAnnotationGPSToMap(new Point(longitudeGps, latitudeGps));
    });

    // Iniciar la geolocalización
    geolocate.trigger();
  }

  getLocationRealtimeFirstTime(){
    let geolocate; // Variable para la capa de ubicación en tiempo real
    let lastLocationGps;
    let lastLocationPoint;
    let context = this;
    var isNecessaryCamera = true;
    var isFirstTime = true;

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

      if(isFirstTime) {
        lastLocationGps = {latitude: latitudeGps, longitude: longitudeGps};

        if (isNecessaryCamera) {
          context.viewCameraInPoint(latitudeGps, longitudeGps);
          isNecessaryCamera = false
        }

        DriverAccountShared.setLastLocation(new Point(longitudeGps, latitudeGps));
        if(RoutesTools.navigationTripDriver){
          this.fetchARoute(RoutesTools.navigationTripDriver);
        }

        context.addAnnotationGPSToMap(new Point(longitudeGps, latitudeGps));
        isFirstTime = false;
      }
    });

    // Iniciar la geolocalización
    geolocate.trigger();
  }



  //Alert Dialogs
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

  viewCameraInPoint(latitudeGps, longitudeGps){
    const camera = this.map.getFreeCameraOptions();

    const position = [longitudeGps, latitudeGps];
    const altitude = 3000;

    camera.position = mapboxgl.MercatorCoordinate.fromLngLat(position, altitude);
    camera.lookAtPoint([longitudeGps, latitudeGps]);

    this.map.setFreeCameraOptions(camera);
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



  //Route state
  //TODO crear los cl con avisos
  showNearAwaitOptions(open){

  }


  //Route
  //TODO por terminar y el observer tambien
  fetchARoute(trip){
    this.viewModel.getRoute(this.routeObserver,trip.latOri,trip.longOri,trip.latDest, trip.longDest);
    document.getElementById("progress").style.visibility = "visible";
  }


}
let navigationDriver = new NavigationDriver();
