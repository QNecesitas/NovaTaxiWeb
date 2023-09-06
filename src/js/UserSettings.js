import ViewModelUserSetting from './viewModels/ViewModelUserSetting.js';
import UserAccountShared from './auxiliary/UserAccountShared.js';
import User from './model/User.js'

export default class UserSettings{

    responseObserver;
    stateObserver;
    stateOperationObserver;
    listUser;

    viewModel= new ViewModelUserSetting();
    userAccountShared= new UserAccountShared();

    //OnCreate
  constructor(){

    //Observer
    this.responseObserver = (it) =>{
        this.listUser = new User(it[0].email,it[0].phone,it[0].name,it[0].state,it[0].password);
        document.getElementById("password").setAttribute('value',this.listUser.password);
        document.getElementById("confirm-password").setAttribute('value',this.listUser.password);
        document.getElementById("phone").setAttribute('value',this.listUser.phone);
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

    //get User Information
    if(UserAccountShared.getUserEmail()==null){
        window.open("loginUser.html","_self");
    }else{
        this.viewModel.getUserInformationAll(this.stateObserver,this.responseObserver,UserAccountShared.getUserEmail());
    }
    

    //Accept Edit Account
    //Listener for btn submit in a form
    document.getElementById("formEditAccount").addEventListener('submit', (event) => {
        event.preventDefault(); //Its for default
        this.editAccount();
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
        this.deleteUsers(this.stateOperationObserver);
      });

      document.getElementById("back").addEventListener('click',(event)=>{
        event.preventDefault();
        window.open("MapHomeUser.html","_self")
      });  
    
  }

  editAccount(){
    if(document.getElementById("phone").value.trim().length >0 && document.getElementById("password").value.trim().length > 0 && document.getElementById("confirm-password").value.trim().length > 0 && document.getElementById("password").value == document.getElementById("confirm-password").value){
        let email =UserAccountShared.getUserEmail();
        this.showAlertConfirm(this.stateOperationObserver,email,document.getElementById("phone").value,document.getElementById("password").value);
    }else{
        alert("Existe algún dato incorrecto. Por favor revise.");
    }
  }

  showAlertConfirm(stateObserve,email,phone,password){
    let result=confirm("¿Estás seguro de actualizar los datos de tu cuenta?");
    if(result){
        this.viewModel.updateUser(stateObserve,email,phone,password);
    }
  }

  signOf(){
    let result= confirm("¿Estás seguro de cerrar su sesión?");
    if(result){
        window.open("loginUser.html","_self");
        UserAccountShared.setUserEmail(null);
    }
  }

  deleteUsers(stateObserve){
    let result= confirm("¿Estás seguro de eliminar la cuenta?");
    if(result){
        this.viewModel.deleteUsers(stateObserve,this.listUser.email);
        window.open("loginUser.html","_self");
        UserAccountShared.setUserEmail(null);
    }
  }
}
let userSetting= new UserSettings();