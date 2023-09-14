import ViewModelDriverSetting from './viewModels/ViewModelDriverSetting.js';
import DriverAccountShared from './auxiliary/DriverAccountShared.js';
import Driver from './model/Driver.js';

export default class DriverSetting{
    responseObserver;
    stateObserver;
    stateOperationObserver;
    listDriver;

    viewModel= new ViewModelDriverSetting();
    userAccountShared= new DriverAccountShared();

    imageFile= 'no'; 

    //OnCreate
     constructor(){

     //Observer
     this.responseObserver= (it)=>{
        this.listDriver=new Driver(it[0].email,it[0].password,it[0].name,it[0].phone,it[0].typeCar,it[0].maxDist,it[0].latitud,it[0].longitude,it[0].state,it[0].statePhoto,it[0].balance,it[0].cantSeat,it[0].rating,it[0].numberPlate); 
        document.getElementById('email').setAttribute('value',this.listDriver.email);
        document.getElementById('password').setAttribute('value',this.listDriver.password);
        document.getElementById('name').setAttribute('value',this.listDriver.name);
        document.getElementById('phone').setAttribute('value',this.listDriver.phone);
        document.getElementById('typeCar').setAttribute('value',this.listDriver.typeCar);
        document.getElementById('distMax').setAttribute('value',this.listDriver.maxDist);
        document.getElementById('cantSeat').setAttribute('value',this.listDriver.cantSeat);
        document.getElementById('numberPlate').setAttribute('value',this.listDriver.numberPlate);
        document.getElementById("confirm-password").setAttribute('value',this.listUser.password);

        //revisar
         let format = new Intl.NumberFormat('en', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
         let money = (`${format.format(this.listDriver.balance)} + 'CUP'`);
        document.getElementById("balance").innerHTML=money;
        // end revisar
        getPhoto();
       }; 
       this.stateObserver = (it) =>{
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
        };

       this.stateOperationObserver = (it) =>{
        switch(it){
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

      //get Driver Information
      if(DriverAccountShared.getDriverEmail==null){
        window.open("loginDriver.html","_self");
        }else{
         this.viewModel.getDriverInformationAll(this.stateObserver,this.responseObserver,DriverAccountShared.getDriverEmail());
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
      document.getElementById("flexSwitchCheckDefault").addEventListener("change",()=>{
        if(document.getElementById("flexSwitchCheckDefault").checked){
            document.getElementById("distMax").style.display = "none";
            document.getElementById("distMax").setAttribute('value','0')
          }else{
            document.getElementById("dist-max").style.display = "flex";
          }
      });

      //About Us
    document.getElementById("aboutUs").addEventListener('click', (event) => {
        event.preventDefault(); //Its for default
        window.open("about_us.html","_self");
      });
    
    //About Dev
    document.getElementById("aboutDev").addEventListener('click', (event) => {
        event.preventDefault(); //Its for default
        window.open("about_dev.html","_self");
      });

      //Sign Of  
    document.getElementById("signOf").addEventListener('click', (event) => {
        event.preventDefault(); //Its for default
        this.signOf();
      });

    //Delete Account
    document.getElementById("delete").addEventListener('click', (event) => {
        event.preventDefault(); //Its for default
        this.deleteDrivers(this.stateOperationObserver);
      });
    }
  

    getPhoto() {
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
  editAccount(){
    let input= document.getElementById("name").value.trim();
    let word = input.split(" ");
    if(document.getElementById("email").value.trim().length>0 && word.length>=3 && document.getElementById("password").value.trim().length>0 && document.getElementById("name").value.trim().length>0 && document.getElementById("phone").value.trim().length>0 && document.getElementById("typeCar").value.trim().length>0 && document.getElementById("distMax").value.trim().length>0 && document.getElementById("cantSeat").value.trim().length>0 && document.getElementById("numberPlate").value.trim().length>0 && document.getElementById("confirm-password").value.trim().length > 0 && document.getElementById("password").value == document.getElementById("confirm-password").value){
        let email =DriverAccountShared.getDriverEmail();
        this.showAlertConfirm(this.stateOperationObserver,email,document.getElementById("password").value, document.getElementById("name").value, document.getElementById("phone").value,document.getElementById("typeCar").value,document.getElementById("distMax").value, document.getElementById("cantSeat").value,document.getElementById("numberPlate").value);
    }
    else{
        alert("Existe algún dato incorrecto. Por favor revise.");
    }
  }
  showAlertConfirm(stateObserve,email,password,name, phone, typeCar, maxDist, cantSeat, numberPlate){
    let result=confirm("¿Estás seguro de actualizar los datos de tu cuenta?");
    if(result){
        this.viewModel.updateDriver(stateObserve,email,password, name, phone, typeCar, maxDist,0, cantSeat, numberPlate,'no');
    }
  }
  signOf(){
    let result= confirm("¿Estás seguro de cerrar su sesión?");
    if(result){
        window.open("loginDriver.html","_self");
        DriverAccountShared.setDriverEmail(null);
    }
  }

  deleteDrivers(stateObserve){
    let result= confirm("¿Estás seguro de eliminar la cuenta?");
    if(result){
        this.viewModel.deleteDrivers(stateObserve,DriverAccountShared.getDriverEmail());
        window.open("loginDriver.html","_self");
        DriverAccountShared.setDriverEmail(null);
    }
  }

   /*var condition=document.querySelector('#condition');
   var termCond=document.querySelector('#termcond');
   var btnCloseTC=document.querySelector('#btn-close-TC');

  condition.addEventListener('click', function(){
    termCond.style.visibility = 'visible'; 
  });
  btnCloseTC.addEventListener('click',function(){
    termCond.style.visibility = 'hidden';
  });*/
  
}



let driverSetting= new DriverSetting();