import DriverAccountShared from './auxiliary/DriverAccountShared.js';
import RoutesTools from "./auxiliary/RoutesTools.js";
import Point from "./model/Point.js";
import ViewModelNavigationDriver from "./viewModels/ViewModelNavigationDriver.js";


export default class NavigationDriver {


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




}
let navigationDriver = new NavigationDriver();
