import ViewModelNewDriver from './viewModels/ViewModelNewDriver.js';
export default class newDriver {
  viewModel = new ViewModelNewDriver();
  stateObserver;

  //On Create
  constructor() {
    //Observes
    this.stateObserver = it => {
      switch (it) {
        case "LOADING":
          document.getElementById("progress").style.visibility = "visible";
          break;
        case "SUCCESS":
          document.getElementById("progress").style.visibility = "hidden";
          this.showAlertDialogSuccess(document.getElementById("email").value);
          window.open("loginDriver.html", "_self");
          break;
        case "ERROR":
          document.getElementById("progress").style.visibility = "hidden";
          alert("Se ha producido un error. Compruebe su conexión e intente nuevamente");
          break;
        case "DUPLICATED":
          document.getElementById("progress").style.visibility = "hidden";
          alert("Ya existe una cuenta creada con ese correo.");
          break;
      }
    };

    //Listener
    document.getElementById("flexSwitchCheckDefault").addEventListener("change", () => {
      if (document.getElementById("flexSwitchCheckDefault").checked) {
        document.getElementById("dist-max").style.display = "none";
      } else {
        document.getElementById("dist-max").style.display = "flex";
      }
    });
    document.getElementById("cancel").addEventListener('click', () => {
      this.showAlertCancel();
    });
    document.getElementById("createAccount").addEventListener('submit', event => {
      event.preventDefault();
      this.createAccount();
    });
    document.getElementById("tipo-carro").addEventListener('click', () => {
      this.rvTypeCar(this.viewModel.getVehiclesList());
    });
    document.getElementById("back").addEventListener('click', () => {
      window.open("loginDriver.html", "_self");
    });
  }
  //Recycler
  rvTypeCar(lista) {
    document.getElementById("container-recycler").innerHTML = "";
    if (lista.length > 0) {
      document.getElementById("container-recycler").style.visibility = "visible";
      for (let f = 0; f < lista.length; f++) {
        let driverImg = this.getDriverImg(lista[f].type);
        let cvTypeCar = document.createElement("div");
        cvTypeCar.setAttribute("class", "cv-typeCar");
        let containerTypeCar = document.createElement("div");
        containerTypeCar.setAttribute("class", "container-typeCar");
        let imgCar = document.createElement("img");
        imgCar.setAttribute("class", "img-car");
        imgCar.setAttribute("src", driverImg);
        let infoTypeCar = document.createElement("div");
        infoTypeCar.setAttribute("class", "info-typeCar");
        let pTypeCar = document.createElement("p");
        pTypeCar.setAttribute("id", "typeCar");
        pTypeCar.innerHTML = lista[f].type;
        let cantSeat = document.createElement("div");
        cantSeat.setAttribute("class", "cantSeat");
        let pCantSeatS = document.createElement("p");
        pCantSeatS.setAttribute("id", "cantSeatS");
        pCantSeatS.innerHTML = "Cantidad de asientos:";
        let pCantSeat = document.createElement("p");
        pCantSeat.setAttribute("id", "typeCar");
        pCantSeat.innerHTML = lista[f].seats;
        let buttonSelect = document.createElement("div");
        buttonSelect.setAttribute("class", "button-select");
        let p1ButtonSelect = document.createElement("p");
        p1ButtonSelect.innerHTML = "Más detalles";
        p1ButtonSelect.setAttribute("id", "details");
        let p2ButtonSelect = document.createElement("p");
        p2ButtonSelect.innerHTML = "|";
        let p3ButtonSelect = document.createElement("p");
        p3ButtonSelect.innerHTML = "Seleccionar";
        p3ButtonSelect.setAttribute("id", "select");
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
        p1ButtonSelect.addEventListener("click", () => this.click_details(lista[f]));
        p3ButtonSelect.addEventListener("click", () => this.selectTypeCar(lista[f]));
        document.getElementById("container-recycler").appendChild(cvTypeCar);
      }
    }
  }
  getDriverImg(vehicleType) {
    switch (vehicleType) {
      case "Auto básico":
        return "img/baseline_drive_eta_24.png";
        break;
      case "Auto de confort":
        return "img/vector_car.png";
        break;
      case "Auto familiar":
        return "img/vector_familiar.png";
        break;
      case "Triciclo":
        return "img/vector_tricycle.png";
        break;
      case "Motor":
        return "img/baseline_directions_bike_24.png";
        break;
      case "Bicitaxi":
        return "img/vector_bicitaxi.png";
        break;
      default:
        return "img/baseline_drive_eta_24.png";
        break;
    }
  }
  click_details(vehicle) {
    this.showAlertDialogCarDetails(vehicle.type, vehicle.details);
  }
  showAlertDialogCarDetails(vehicleType, vehicleDetails) {
    alert("Vehículo: " + vehicleType + "\n" + vehicleDetails);
  }
  selectTypeCar(vehicle) {
    document.getElementById("tipo-carro").setAttribute('value', vehicle.type);
    document.getElementById("img-car").src = this.getDriverImg(vehicle.type);
    document.getElementById("container-recycler").style.visibility = "hidden";
  }
  createAccount() {
    if (this.isInformationGood()) {
      let result = confirm("¿Estás seguro de guardar estos datos?");
      if (result) {
        this.sendInformation();
      }
    }
  }
  isInformationGood() {
    let result = true;
    let input = document.getElementById("name").value.trim();
    let word = input.split(" ");
    if (document.getElementById("name").value.trim().length <= 0 || word.length < 3) {
      alert("Debe introducir su nombre y sus dos apellidos");
      result = false;
    }
    if (document.getElementById("email").value.trim().length <= 0) {
      result = false;
    }
    if (document.getElementById("number").value.trim().length <= 0) {
      result = false;
    }
    if (document.getElementById("tipo-carro").value.trim().length <= 0) {
      result = false;
    }
    if (document.getElementById("cant-asientos").value.trim().length <= 0) {
      result = false;
    }
    if (document.getElementById("num-chapa").value.trim().length <= 0) {
      result = false;
    }
    if (document.getElementById("password").value.trim().length <= 0) {
      result = false;
    }
    if (document.getElementById("confirm-password").value.trim().length <= 0) {
      result = false;
    }
    if (document.getElementById("password").value !== document.getElementById("confirm-password").value) {
      alert("No coinciden las contraseñas");
      result = false;
    }
    if (!document.getElementById("flexSwitchCheckDefault").checked) {
      if (document.getElementById("dist-max").value.trim().length <= 0) {
        result = false;
      }
    }
    return result;
  }
  showAlertConfirm() {
    let result = confirm("¿Desea guardar estos datos?");
    if (result) {
      this.sendInformation(this.stateObserver);
    }
  }
  sendInformation() {
    let maxDist = 0;
    if (!document.getElementById("flexSwitchCheckDefault").checked) {
      maxDist = document.getElementById("dist-max").value;
    }
    this.viewModel.addNewAccountUser(this.stateObserver, document.getElementById("name").value, document.getElementById("email").value, document.getElementById("number").value, document.getElementById("tipo-carro").value, document.getElementById("cant-asientos").value, maxDist, document.getElementById("password").value, document.getElementById("num-chapa").value, 0, "no");
  }
  showAlertDialogSuccess(email) {
    alert("Le hemos enviado un correo a " + email + " .Por favor confirme su cuenta.");
  }
  showAlertCancel() {
    let result = confirm("¿Desea cancelar estos datos?");
    if (result) {
      window.open("loginDriver.html", "_self");
    }
  }
}
let newDrivers = new newDriver();