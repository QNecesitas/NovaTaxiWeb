import ViewModelNewUser from './viewModels/ViewModelNewUser.js';

export default class NewUser{

    stateObserver;

    viewModelNewUser= new ViewModelNewUser();


    //OnCreate
  constructor(){

    //Listener for btn submit in a form
    document.getElementById("createAccount").addEventListener('submit', (event) => {
      event.preventDefault(); //Its for default
        this.createAccount();
    });

    document.getElementById("buttonCancel").addEventListener('click',(event)=>{
      event.preventDefault();
      this.showAlertCancel();
    });
    document.getElementById("back").addEventListener('click',(event)=>{
      event.preventDefault();
      this.showAlertCancel();
    });



    //Observes
    this.stateObserver = (it) =>{
      switch(it){
        case "LOADING":
          document.getElementById("progress").style.visibility = "visible";
          break;
        case "SUCCESS":
          document.getElementById("progress").style.visibility = "hidden";
          this.showAlertDialogSuccess(document.getElementById("email").value);
          window.open("loginUser.html","_self");
          break;
        case "ERROR":
          document.getElementById("progress").style.visibility= "hidden";
          alert("Se ha producido un error. Compruebe su conexión e intente nuevamente");
          break;
        case "DUPLICATED":
          document.getElementById("progress").style.visibility = "hidden";
          alert("Ya existe una cuenta creada con ese correo.");
          break;

      }
    };
  }

  createAccount(){
    let input= document.getElementById("name").value.trim();
    let word = input.split(" ");
    if(document.getElementById("name").value.trim().length >0 && word.length>=3 && document.getElementById("email").value.trim().length>0 && document.getElementById("number").value.trim().length>0 && document.getElementById("password").value.trim().length>0 && document.getElementById("confirm-password").value.trim().length>0 && document.getElementById("password").value == document.getElementById("confirm-password").value){
      let result = confirm("¿Estás seguro de guardar estos datos?");
      if(result){
        this.sendInformation();
      }
    }else{
      alert("Existe algún dato incorrecto. Por favor revise.");
    }
  }

  sendInformation(){
    this.viewModelNewUser.addNewAccountUser(this.stateObserver,document.getElementById("name").value,document.getElementById("email").value,document.getElementById("number").value,document.getElementById("password").value);
  }

  showAlertCancel(){
    let result= confirm("¿Estás seguro de cancelar estos datos?");
    if(result){
      window.open("loginUser.html","_self");
    }
  }

  showAlertDialogSuccess(email){
    alert("Le hemos enviado un correo a " + email + " .Por favor confirme su cuenta");
   }
}
let newUser=new NewUser();
