import ViewModelDriverSetting from './viewModels/ViewModelDriverSetting.js';
import DriverAccountShared from './auxiliary/DriverAccountShared.js';
import Driver from './model/Driver.js';

export default class DriverSetting {
  responseObserver;
  stateObserver;
  stateOperationObserver;
  stateDeleteObserver;
  listDriver;

  viewModel = new ViewModelDriverSetting();
  userAccountShared = new DriverAccountShared();

  imageFile = 'no';

  //OnCreate
  constructor() {

    //Observer
    this.responseObserver = (it) => {
      this.listDriver = new Driver(it[0].email, it[0].password, it[0].name, it[0].phone, it[0].typeCar, it[0].maxDist, it[0].latitud, it[0].longitude, it[0].state, it[0].statePhoto, it[0].balance, it[0].cantSeat, it[0].rating, it[0].numberPlate);
      document.getElementById('email').setAttribute('value', this.listDriver.email);
      document.getElementById('password').setAttribute('value', this.listDriver.password);
      document.getElementById('name').setAttribute('value', this.listDriver.name);
      document.getElementById('phone').setAttribute('value', this.listDriver.phone);
      document.getElementById('typeCar').setAttribute('value', this.listDriver.typeCar);
      document.getElementById('distMax').setAttribute('value', this.listDriver.maxDist);
      document.getElementById('cantSeat').setAttribute('value', this.listDriver.cantSeat);
      document.getElementById('numberPlate').setAttribute('value', this.listDriver.numberPlate);
      document.getElementById("confirm-password").setAttribute('value', this.listDriver.password);


      let balance = this.listDriver.balance;
      let decimal = balance.toFixed(1);
      document.getElementById("balance").innerHTML = decimal;
      this.getPhoto(this.listDriver.typeCar);
    };
    this.stateObserver = (it) => {
      switch (it) {
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
    };

    this.stateOperationObserver = (it) => {
      switch (it) {
        case "LOADING":
          document.getElementById("progress").style.visibility = "visible";
          break;
        case "SUCCESS":
          document.getElementById("progress").style.visibility = "hidden";
          alert("Operación realizada con éxito");
          break;
        case "ERROR":
          alert("Se ha producido un error. Compruebe su conexión e intente nuevamente");
          document.getElementById("progress").style.visibility = "hidden";
          break;
      }
    };

    this.stateDeleteObserver = (it) => {
      switch (it) {
        case "LOADING":
          document.getElementById("progress").style.visibility = "visible";
          break;
        case "SUCCESS":
          document.getElementById("progress").style.visibility = "hidden";
          alert("Operación realizada con éxito");
          window.open("loginDriver.html", "_self");
          break;
        case "ERROR":
          alert("Se ha producido un error. Compruebe su conexión e intente nuevamente");
          document.getElementById("progress").style.visibility = "hidden";
          break;
      }
    };

    //get Driver Information
    if (DriverAccountShared.getDriverEmail() == null) {
      window.open("loginDriver.html", "_self");
    } else {
      this.viewModel.getDriverInformationAll(this.stateObserver, this.responseObserver, DriverAccountShared.getDriverEmail());
    }

    var email = document.getElementById("email");
    email.disabled = true;

    //Accept Edit Account
    //Listener for btn submit in a form
    document.getElementById("formEditAccount").addEventListener('submit', (event) => {
      event.preventDefault(); //Its for default
      this.editAccount();
    });

    //BTN max Dist
    //Listener
    document.getElementById("flexSwitchCheckDefault").addEventListener("change", () => {
      if (document.getElementById("flexSwitchCheckDefault").checked) {
        document.getElementById("distMax").style.display = "none";
      } else {
        document.getElementById("distMax").style.display = "flex";
      }
    });

    //About Us
    document.getElementById("aboutUs").addEventListener('click', (event) => {
      event.preventDefault(); //Its for default
      window.open("about_us.html", "_self");
    });

    //About Dev
    document.getElementById("aboutDev").addEventListener('click', (event) => {
      event.preventDefault(); //Its for default
      window.open("about_dev.html", "_self");
    });

    //Sign Of
    document.getElementById("signOf").addEventListener('click', (event) => {
      event.preventDefault(); //Its for default
      this.signOf();
    });

    //Delete Account
    document.getElementById("delete").addEventListener('click', (event) => {
      event.preventDefault(); //Its for default
      this.deleteDrivers(this.stateDeleteObserver);
    });

    document.getElementById("condition").addEventListener('click', () => {
      document.getElementById("staticBackdrop").style.visibility = "visible";
    });

    document.getElementById("btn-close-TC").addEventListener('click', () => {
      document.getElementById("staticBackdrop").style.visibility = "hidden";
    });

    document.getElementById("recargar").addEventListener('click', () => {
      alert("En próximas versiones...");
    });

    document.getElementById("back").addEventListener('click', () => {
      window.open("MaphomeDriver.html", "_self");
    });
    var context=this;
    document.getElementById("typeCar").addEventListener('click',()=>{
      context.rvTypeCar(context.viewModel.getVehiclesList());
    });


  }



  rvTypeCar(lista){
    document.getElementById("container-recycler").innerHTML="";

    if(lista.length > 0){
        document.getElementById("container-recycler").style.visibility = "visible";

        for(let f=0;f<lista.length;f++){
            let driverImg = this. getPhoto(lista[f].type);
            let cvTypeCar= document.createElement("div");cvTypeCar.setAttribute("class","cv-typeCar");
            let containerTypeCar= document.createElement("div");containerTypeCar.setAttribute("class","container-typeCar");
            let imgCar=document.createElement("img");imgCar.setAttribute("class","img-car");imgCar.setAttribute("src",driverImg);
            let infoTypeCar=document.createElement("div");infoTypeCar.setAttribute("class","info-typeCar");
            let pTypeCar= document.createElement("p");pTypeCar.setAttribute("id","typeCar");pTypeCar.innerHTML=lista[f].type;
            let cantSeat=document.createElement("div");cantSeat.setAttribute("class","cantSeat");
            let pCantSeatS=document.createElement("p");pCantSeatS.setAttribute("id","cantSeatS");pCantSeatS.innerHTML="Cantidad de asientos:";
            let pCantSeat=document.createElement("p");pCantSeat.setAttribute("id","typeCar");pCantSeat.innerHTML=lista[f].seats;
            let buttonSelect=document.createElement("div");buttonSelect.setAttribute("class","button-select");
            let p1ButtonSelect=document.createElement("p");p1ButtonSelect.innerHTML="Más detalles";p1ButtonSelect.setAttribute("id","details");
            let p2ButtonSelect=document.createElement("p");p2ButtonSelect.innerHTML="|";
            let p3ButtonSelect=document.createElement("p");p3ButtonSelect.innerHTML="Seleccionar";p3ButtonSelect.setAttribute("id","select");

            cantSeat.appendChild(pCantSeatS);
            cantSeat.appendChild(pCantSeat);
            infoTypeCar.appendChild(pTypeCar);
            infoTypeCar.appendChild(cantSeat);
            containerTypeCar.appendChild(imgCar);
            containerTypeCar.appendChild(infoTypeCar);
            buttonSelect.appendChild(p1ButtonSelect);
            buttonSelect.appendChild(p2ButtonSelect);
            buttonSelect.appendChild(p3ButtonSelect);
            cvTypeCar.appendChild(containerTypeCar);
            cvTypeCar.appendChild(buttonSelect);


            p1ButtonSelect.addEventListener("click",()=>this.click_details(lista[f]));
            p3ButtonSelect.addEventListener("click",()=>this.selectTypeCar(lista[f]));
            document.getElementById("container-recycler").appendChild(cvTypeCar);

        }
    }
}

getPhoto(typeCar) {
  switch(typeCar) {
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

  click_details(vehicle){
    this.showAlertDialogCarDetails(vehicle.type,vehicle.details);
  }
  showAlertDialogCarDetails(vehicleType, vehicleDetails) {
    alert("Vehículo: "+vehicleType + "\n" + vehicleDetails);
  }
  selectTypeCar(vehicle){
    document.getElementById("typeCar").setAttribute('value',vehicle.type);
    document.querySelector(".img-car").src=this.getPhoto(vehicle.type);
    document.getElementById("container-recycler").style.visibility="hidden";
  }


  editAccount(){
    let email = DriverAccountShared.getDriverEmail();
    if (this.isInformationGood()) {
      if (!document.getElementById("flexSwitchCheckDefault").checked) {
        if (document.getElementById("distMax").value.trim().length > 0) {
          this.showAlertConfirm(this.stateOperationObserver, email, document.getElementById("password").value, document.getElementById("name").value, document.getElementById("phone").value, document.getElementById("typeCar").value, document.getElementById("cantSeat").value, document.getElementById("numberPlate").value);
        } else {
          alert("La distancia máxima no debe estar vacía");
        }
      }else {
        this.showAlertConfirm(this.stateOperationObserver, email, document.getElementById("password").value, document.getElementById("name").value, document.getElementById("phone").value, document.getElementById("typeCar").value, document.getElementById("cantSeat").value, document.getElementById("numberPlate").value);
      }
    }
  }

  isInformationGood(){

    var result = true;
    let input= document.getElementById("name").value.trim();
    let word = input.split(" ");

    if(document.getElementById("email").value.trim().length <= 0){
      result = false;
    }

    if(word.length < 3){
      result = false;
      alert("Debe colocar nombre y dos apellidos");
    }

    if(document.getElementById("password").value.trim().length <= 0){
      result = false
    }

    if(document.getElementById("name").value.trim().length <= 0){
      result = false;
    }

    if(document.getElementById("phone").value.trim().length <= 0){
      result = false;
    }

    if(document.getElementById("typeCar").value.trim().length <= 0){
      result = false;
    }

    if(document.getElementById("cantSeat").value.trim().length <= 0){
      result = false;
    }

    if(document.getElementById("numberPlate").value.trim().length <= 0){
      result = false;
    }

    if(document.getElementById("confirm-password").value.trim().length <= 0){
      result = false;
    }

    if(document.getElementById("password").value !== document.getElementById("confirm-password").value){
      result = false
      alert("Las contraseñas no coinciden");
    }

    return result;

  }



  showAlertConfirm(stateObserve, email, password, name, phone, typeCar, cantSeat, numberPlate) {
    let maxDist = 0;
    if (!document.getElementById("flexSwitchCheckDefault").checked) {
      maxDist = document.getElementById("distMax").value;
    }
    let result = confirm("¿Estás seguro de actualizar los datos de tu cuenta?");
    if (result) {
      this.viewModel.updateDriver(stateObserve, email, password, name, phone, typeCar, maxDist, '0', cantSeat, numberPlate, 'no');
    }
  }

  signOf() {
    let result = confirm("¿Estás seguro de cerrar su sesión?");
    if (result) {
      window.open("loginDriver.html", "_self");
      DriverAccountShared.setDriverEmail(null);
    }
  }

  deleteDrivers(stateObserve) {
    let result = confirm("¿Estás seguro de eliminar la cuenta?");
    if (result) {
      this.viewModel.deleteDriver(stateObserve, DriverAccountShared.getDriverEmail());
      DriverAccountShared.setDriverEmail(null);
    }
  }


}


let driverSetting = new DriverSetting();
