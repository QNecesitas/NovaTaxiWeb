import ViewModelInfoDriver from './viewModels/ViewModelInfoDriver.js';
import DriverAccountShared from './auxiliary/DriverAccountShared.js';
import Driver from './model/Driver.js';

export default class infoDriver{

    responseObserver;
    stateObserver;
    listDriver;

    viewModel= new ViewModelInfoDriver();
    driverAccountShared= new DriverAccountShared();

    //OnCreate
  constructor(){
    const emailSelected= sessionStorage.getItem('emailSelected');

    

    //Observer
    this.responseObserver = (it)=>{
        this.listDriver = new Driver(it[0].email,it[0].password,it[0].name,it[0].phone,it[0].typeCar,it[0].maxDist,it[0].latitud,it[0].longitude,it[0].state,it[0].statePhoto,it[0].balance,it[0].cantSeat,it[0].rating,it[0].numberPlate);
        document.getElementById("nombre").innerHTML=this.listDriver.name;
        document.getElementById("phone").innerHTML=this.listDriver.phone;
        document.getElementById("typeCarp").innerHTML= this.listDriver.typeCar;
        document.getElementById("chapa").innerHTML=this.listDriver.numberPlate;
        document.getElementById("cant").innerHTML = this.listDriver.cantSeat;
        switch(this.listDriver.rating){
            case 1:
                document.getElementById("star1").src='./img/star_light.png';
                break;
            case 2:
                document.getElementById("star1").src='./img/star_light.png';
                document.getElementById("star2").src='./img/star_light.png';
                break;
            case 3:
                document.getElementById("star1").src='./img/star_light.png';
                document.getElementById("star2").src='./img/star_light.png';
                document.getElementById("star3").src='./img/star_light.png';
                break;
            case 4:
                document.getElementById("star1").src='./img/star_light.png';
                document.getElementById("star2").src='./img/star_light.png';
                document.getElementById("star3").src='./img/star_light.png';
                document.getElementById("star4").src='./img/star_light.png';
                break;
            case 5:
                document.getElementById("star1").src='./img/star_light.png';
                document.getElementById("star2").src='./img/star_light.png';
                document.getElementById("star3").src='./img/star_light.png';
                document.getElementById("star4").src='./img/star_light.png';
                document.getElementById("star5").src='./img/star_light.png';
                break;
        }
        switch(this.listDriver.typeCar){
            case "Auto básico":
                document.getElementById("typeCar").src='./img/baseline_drive_eta_24.png';
                break;
            case "Auto de confort":
                document.getElementById("typeCar").src='./img/vector_car.png';
                break;
            case "Auto familiar":
                document.getElementById("typeCar").src='./img/vector_familiar.png';
                break;
            case "Triciclo":
                document.getElementById("typeCar").src='./img/vector_tricycle.png';
                break;
            case "Motor":
                document.getElementById("typeCar").src='./img/baseline_directions_bike_24.png';
                break;
            case "Bicitaxi":
                document.getElementById("typeCar").src='./img/vector_bicitaxi.png';
                break;
        }
    }

    this.stateObserver = (it)=>{
        switch(it){
            case "LOADING":
                document.getElementById("progress").style.visibility = "visible";
                break;
            case "SUCCESS":
                document.getElementById("progress").style.visibility = "hidden";
                break;
            case "ERROR":
                alert("Se ha producido un error. Compruebe su conexión e intente nuevamente");
                document.getElementById("progress").style.visibility = "hidden";
                break;        
        }
    }

    this.viewModel.getDriver(this.stateObserver,this.responseObserver,emailSelected);

    document.getElementById("back").addEventListener('click',(event)=>{
        event.preventDefault();
        window.history.back();
      }); 
  }
}
let infoDrivers=new infoDriver();