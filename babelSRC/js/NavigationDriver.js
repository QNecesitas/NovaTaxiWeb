import DriverAccountShared from './auxiliary/DriverAccountShared.js';
import RoutesTools from "./auxiliary/RoutesTools.js";
import Point from "./model/Point.js";
import ViewModelNavigationDriver from "./viewModels/ViewModelNavigationDriver.js";
export default class NavigationDriver {
  routeObserverStep1;
  routeObserverStep2;
  map;
  markerGps;
  markerTripDestiny;
  markerGPStoAnnotation;
  markerTripOrigin;
  viewModel = new ViewModelNavigationDriver();
  stateRouteObserver;
  stateUpdateInAwaitObserver;
  stateUpdateInTravelObserver;
  responseUpdateFinishedObserver;
  stateDriverLocation;
  constructor() {
    const context = this;
    if (DriverAccountShared.getDriverEmail() == null) {
      window.open("MaphomeDriver.html", "_self");
    }
    //Map
    let lastPointSelected = DriverAccountShared.getLastLocation();
    mapboxgl.accessToken = 'pk.eyJ1Ijoicm9ubnlucCIsImEiOiJjbGl4YTg3bDgwNHpwM2RucTlwdWFkOXN1In0.MlTnx-myS4E3LJUeh5CVbw';
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/ronnynp/cljbmkjqs00gt01qrb2y3bgxj',
      center: [lastPointSelected.longitude, lastPointSelected.latitude],
      zoom: 16.5,
      // starting zoom,
      pitch: 70.0
    });
    let routeToolsAux = sessionStorage.getItem('TripDriver');
    RoutesTools.navigationTripDriver = JSON.parse(routeToolsAux);
    this.driverPositionlatitude = sessionStorage.getItem('LocationDriverlatitud');
    this.driverPositionlongitude = sessionStorage.getItem('LocationDriverlongitud');
    this.viewModel.setLatitudeGPS(this.driverPositionlatitude);
    this.viewModel.setLongitudeGPS(this.driverPositionlongitude);
    this.addAnnotationDrivers(new Point(this.viewModel.longitudeGps, this.viewModel.latitudeGps), this.getDriverMarkerImg(RoutesTools.navigationTripDriver.typeCar));
    this.stateRouteObserver = it => {
      switch (it) {
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
          break;
        case "FINISHED":
          this.showNearFinishOptions(false);
          break;
      }
    };
    this.stateUpdateInAwaitObserver = () => {
      this.viewModel.setRouteState("AWAITING");
    };
    this.stateUpdateInTravelObserver = () => {
      this.viewModel.setRouteState("PAST_AWAITING");
    };
    this.responseUpdateFinishedObserver = it => {
      this.liFinishedTrip(it);
    };
    this.routeObserverStep1 = it => {
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
    };

    this.routeObserverStep2 = it => {
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
    };

    this.stateDriverLocation = it => {};

    //Listeners
    document.getElementById("stop").onclick = () => {
      this.viewModel.setTimeInMillsStart(Date.now());
      this.showNearFinishOptions(false);
      this.viewModel.setStatusRouteToInAwait(this.stateRouteObserver);
    };
    this.viewModel.setRouteState("STARTING", this.stateRouteObserver);
    this.addRoutePoints();
    this.getLocationRealtimeFirstTime();
    if (RoutesTools.navigationTripDriver) {
      this.viewCameraInPoint(RoutesTools.navigationTripDriver.latOri, RoutesTools.navigationTripDriver.longOri);
    }
    this.startMainRoutine();
  }
  liFinishedTrip() {
    const myModal = new bootstrap.Modal('#exampleModal', {
      keyboard: false
    });
    myModal.show();
  }

  //Init
  // TODO Me falto poner un numerp
  addRoutePoints() {
    if (RoutesTools.navigationTripDriver) {
      let pointOrigin = new Point(RoutesTools.navigationTripDriver.longOri, RoutesTools.navigationTripDriver.latOri);
      this.addAnnotationsTripToMap(pointOrigin, "img/start_route.png");
    }
    if (RoutesTools.navigationTripDriver) {
      let pointDest = new Point(RoutesTools.navigationTripDriver.longDest, RoutesTools.navigationTripDriver.latDest);
      this.addAnnotationsTripToMap(pointDest, "img/end_route.png");
    }
  }
  async startMainRoutine() {
    while (true) {
      if (RoutesTools.navigationTripDriver) {
        await this.fetchARoute(RoutesTools.navigationTripDriver);
        await this.viewModel.checkIsNearFromAwaitForClient(RoutesTools.navigationTripDriver, this.stateRouteObserver);
        await this.viewModel.checkIsNearFromFinished(RoutesTools.navigationTripDriver, this.stateRouteObserver);
        await this.viewModel.updateDriverLocation(this.stateDriverLocation);
      }
      await new Promise(resolve => setTimeout(resolve, 12000));
    }
  }
  getLocationRealtimeFirstTime() {
    let geolocate; // Variable para la capa de ubicación en tiempo real
    let lastLocationGps;
    let lastLocationPoint;
    let context = this;
    var isNecessaryCamera = true;
    var isFirstTime = true;

    // Configurar la capa de ubicación en tiempo real
    geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true // Habilitar alta precisión
      },

      trackUserLocation: true,
      // Rastrear la ubicación en tiempo real
      showUserLocation: true,
      // Mostrar la ubicación del usuario en el mapa
      showAccuracyCircle: true // Mostrar círculo de precisión
    });

    this.map.addControl(geolocate);

    // Escuchar el evento 'geolocate' para manejar actualizaciones de ubicación
    geolocate.on('geolocate', function (e) {
      // Obtener las coordenadas de la ubicación
      const latitudeGps = e.coords.latitude;
      const longitudeGps = e.coords.longitude;
      context.viewModel.setLatitudeGPS(latitudeGps);
      context.viewModel.setLongitudeGPS(longitudeGps);
      lastLocationGps = {
        latitude: latitudeGps,
        longitude: longitudeGps
      };
      if (context.markerGps) {
        context.markerGps.remove();
      }
      if (context.markerDrivers) {
        context.markerDrivers.remove();
      }

      /*    if (isNecessaryCamera) {
        context.viewCameraInPoint(latitudeGps, longitudeGps);
        isNecessaryCamera = false
      } */

      DriverAccountShared.setLastLocation(new Point(longitudeGps, latitudeGps));
      if (RoutesTools.navigationTripDriver) {
        context.fetchARoute(RoutesTools.navigationTripDriver);
      }
      context.addAnnotationDrivers(new Point(longitudeGps, latitudeGps), context.getDriverMarkerImg(RoutesTools.navigationTripDriver.typeCar));
    });

    // Iniciar la geolocalización
    geolocate.trigger();
  }

  //Alert Dialogs
  showAlertDialogNotLocationSettings() {
    alert("Ubicación desactivada. Vaya a los ajustes y encienda la ubicación ");
  }

  //Methods Maps
  addAnnotationGPSToMap(point) {
    const longitudeGps = point.longitude;
    const latitudeGps = point.latitude;
    if (!this.markerGPStoAnnotation) {
      this.markerGPStoAnnotation = new mapboxgl.Marker({
        color: 'red',
        // Color del marcador
        draggable: true // Permite arrastrar el marcador
      }).setLngLat([longitudeGps, latitudeGps]) // Establecer la ubicación del marcador
      .addTo(this.map); // Agregar marcador al mapa
    } else {
      // Actualizar la posición del marcador en el mapa
      this.markerGPStoAnnotation.setLngLat([longitudeGps, latitudeGps]);
    }
  }
  addAnnotationDrivers(point, imgUrl) {
    let img = document.createElement('img');
    img.setAttribute("class", "marker-driver");
    img.setAttribute("src", imgUrl);
    this.markerDrivers = new mapboxgl.Marker(img).setLngLat([point.longitude, point.latitude]).addTo(this.map);
  }
  viewCameraInPoint(latitudeGps, longitudeGps) {
    const camera = this.map.getFreeCameraOptions();
    const position = [longitudeGps, latitudeGps];
    const altitude = 3000;
    camera.position = mapboxgl.MercatorCoordinate.fromLngLat(position, altitude);
    camera.lookAtPoint([longitudeGps, latitudeGps]);
    this.map.setFreeCameraOptions(camera);
  }
  addAnnotationsTripToMap(point, imgUrl) {
    let img = document.createElement('img');
    img.setAttribute("class", "marker-trip");
    img.setAttribute("src", imgUrl);
    if (imgUrl === "img/start_route.png") {
      if (this.markerTripOrigin) this.markerTripOrigin.remove();
      this.markerTripOrigin = new mapboxgl.Marker(img).setLngLat([point.longitude, point.latitude]).addTo(this.map);
    } else {
      if (this.markerTripDestiny) this.markerTripDestiny.remove();
      this.markerTripDestiny = new mapboxgl.Marker(img).setLngLat([point.longitude, point.latitude]).addTo(this.map);
    }
  }
  getDriverMarkerImg(vehicleType) {
    switch (vehicleType) {
      case "Auto básico":
        return "img/dirver_icon_simple.png";
        break;
      case "Auto de confort":
        return "img/dirver_icon_confort.png";
        break;
      case "Auto familiar":
        return "img/dirver_icon_familiar.png";
        break;
      case "Triciclo":
        return "img/dirver_icon_triciclo.png";
        break;
      case "Motor":
        return "img/dirver_icon_motorb.png";
        break;
      case "Bicitaxi":
        return "img/dirver_icon_bicitaxi.png";
        break;
      default:
        return "img/dirver_icon_simple.png";
        break;
    }
  }

  //Route state
  //TODO crear los cl con avisos y colocar su id en la sig func
  showNearAwaitOptions(open) {
    if (open) {
      document.getElementById("wait").style.visibility = "visible";
      document.getElementById("llBtnAwait").onclick = () => {
        this.viewModel.setTimeInMillsStart(Date.now());
        this.viewModel.setStatusRouteToInAwait(this.stateRouteObserver);
      };
    } else {
      document.getElementById("wait").style.visibility = "hidden";
    }
  }
  showInAwaitOptions(open) {
    if (open) {
      document.getElementById("continuos").style.visibility = "visible";
      document.getElementById("llBtnPastAwait").onclick = () => {
        this.viewModel.setTimeInMillsEnd(Date.now());
        this.viewModel.setStatusRouteToInTravel(this.stateRouteObserver);
      };
    } else {
      document.getElementById("continuos").style.visibility = "hidden";
    }
  }
  showNearFinishOptions(open) {
    if (open) {
      document.getElementById("endTravel").style.visibility = "visible";
      document.getElementById("llBtnFinished").onclick = () => {
        this.viewModel.setStatusRouteToFinished(this.stateRouteObserver, this.responseUpdateFinishedObserver);
      };
    } else {
      document.getElementById("endTravel").style.visibility = "hidden";
    }
  }
  liFinishedTrip(trip) {
    const myModal = new bootstrap.Modal('#liFinishedTrip', {
      keyboard: false
    });
    myModal.show();
    document.getElementById("liFinishedTripCond").innerHTML = trip.driverName;
    document.getElementById("liFinishedTripChapa").innerHTML = trip.numberPlate;
    document.getElementById("liFinishedTripClient").innerHTML = trip.clientName;
    const distance = trip.distance.toFixed(2) + " Km";
    document.getElementById("liFinishedTripDist").innerHTML = distance;
    document.getElementById("liFinishedTripFecha").innerHTML = trip.date;
    const awaitTime = trip.timeAwait + " min";
    document.getElementById("liFinishedTripTime").innerHTML = awaitTime;
    const awaitPrice = trip.priceAwait.toFixed(2) + " CUP";
    document.getElementById("liFinishedTripAwait").innerHTML = awaitPrice;
    const tripPrice = trip.travelPrice.toFixed(2) + " CUP";
    document.getElementById("liFinishedTripTPrice").innerHTML = tripPrice;
    document.getElementById("liFinishedTripVeh").innerHTML = trip.typeCar;
    const totalPrice = trip.travelPrice + trip.priceAwait + " CUP";
    document.getElementById("liFinishedTotalP").innerHTML = totalPrice;
    document.getElementById("liFinishedTripBtn").onclick = () => {
      window.open("MaphomeDriver.html", "_self");
    };
  }

  //Route
  fetchARoute(trip) {
    const originPoint = new Point(trip.longOri, trip.latOri);
    const destPoint = new Point(trip.longDest, trip.latDest);
    const driverPoint = new Point(this.viewModel.longitudeGps, this.viewModel.latitudeGps);
    if (this.viewModel.stateRoute === "STARTING" || this.viewModel.stateRoute === "NEAR_AWAITING") {
      this.setRouteOptions2Step(originPoint, destPoint, driverPoint);
    }
    if (this.viewModel.stateRoute === "PAST_AWAITING" || this.viewModel.stateRoute === "NEAR_FINISHING") {
      this.setRouteOptions1Step(destPoint, driverPoint);
    }
  }
  setRouteOptions1Step(destP, driverP) {
    this.viewModel.getRoute(this.routeObserverStep1, driverP.latitude, driverP.longitude, destP.latitude, destP.longitude);
  }
  setRouteOptions2Step(originP, destP, driverP) {
    this.viewModel.getRouteTriple(this.routeObserverStep2, driverP.latitude, driverP.longitude, originP.latitude, originP.longitude, destP.latitude, destP.longitude);
  }
}
let navigationDriver = new NavigationDriver();