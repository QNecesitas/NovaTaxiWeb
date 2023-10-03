import ViewModelLoginDriver from './viewModels/ViewModelLoginDriver.js';
import UserAccountShared from './auxiliary/UserAccountShared.js';

export default class LoginDriverActivity{

  emailToSend = " ";
  existDriverObserver;
  stateObserver;
  stateRecoverObserver;
  stateVersionObserver;
  versionResponseObserver;

  viewModelLogin = new ViewModelLoginDriver();


  //OnCreate
  constructor(){

    //Listeners

    document.getElementById("tvForgotPasswClick").onclick = () => {
      this.clickRecover();
    };

    document.getElementById("formLogin").addEventListener('submit', (event) => {
      event.preventDefault(); //Its for default
      this.clickIntro();
    });


    //Observers
    this.existDriverObserver = (it) => {
      this.checkStateAndGo(it);
    };

    this.stateObserver = (it) =>   {
      switch (it){
        case "LOADING":
          document.getElementById("progress").style.visibility = "visible";
          break;
        case "SUCCESS":
          document.getElementById("progress").style.visibility = "hidden";
          break;
        case "ERROR":
          document.getElementById("progress").style.visibility = "hidden";
          alert("Se ha producido un error. Compruebe su conexión e intente nuevamente");
          break;
      }
    };

    this.stateRecoverObserver = (it) => {
      switch (it){
        case "LOADING":
          document.getElementById("progress").style.visibility = "visible";
          break;
        case "SUCCESS":
          document.getElementById("progress").style.visibility = "hidden";
          this.showAlertDialogEmailSent();
          break;
        case "ERROR":
          document.getElementById("progress").style.visibility = "hidden";
          alert("Se ha producido un error. Compruebe su conexión e intente nuevamente");
          break;
      }
    };

    this.stateVersionObserver = (it) => {
      switch (it){
        case "LOADING":
          document.getElementById("progress").style.visibility = "visible";
          break;
        case "SUCCESS":
          document.getElementById("progress").style.visibility = "hidden";
          this.viewModelLogin.getIsValidAccount(
            this.stateObserver,
            this.existDriverObserver,
            document.getElementById("email").value,
            document.getElementById("password").value
          );
          break;
        case "ERROR":
          document.getElementById("progress").style.visibility = "hidden";
          break;
      }
    };

    this.versionResponseObserver = (it) => {
      this.showAlertDialogNotVersion(it);
    };

  }



  clickIntro(){
    if(document.getElementById("email").value.trim().length > 0 && document.getElementById("password").value.trim().length > 0) {
      this.emailToSend = document.getElementById("email").value;
      this.viewModelLogin.getAppVersion(this.stateVersionObserver, this.versionResponseObserver);
    }
  }



  checkStateAndGo(state) {
    switch(state){
      case "En espera":
        this.showAlertDialogNotConfirmed();
        break;
      case "Aceptado":
        if(this.emailToSend === "Admin" || this.emailToSend === "admin"){
         // window.open("admin.html","_self");
        }else {
          this.viewModelLogin.saveDriverInfo(this.emailToSend);
          window.open("MaphomeDriver.html","_self");
        }
        break;
      case "Bloqueado":
        this.showAlertDialogBlocked();
        break;
      default:
        this.showAlertDialogUserPasswordWrong();
        break;
    }
  }



//===================================Recover Password
  clickRecover(){
    this.liRecoverPassword()
  }

  liRecoverPassword(){
    const myModal = new bootstrap.Modal('#exampleModal', {
      keyboard: false
    });
    myModal.show();
    document.getElementById("li_recover_accept").onclick = () => {
      if(document.getElementById("emailRecover").value.length > 0) {
        this.showAlertDialogConfirmEmail(document.getElementById("emailRecover").value)
      }
    };
  }



//======================================Alert Dialogs
  showAlertDialogConfirmEmail(email) {
    let result = confirm("¿Tiene seguridad de enviar su contraseña al correo: "+ email + "?");
    if(result) {
      this.viewModelLogin.sendRecoverPetition(this.stateRecoverObserver, email);
    }
  }

  showAlertDialogEmailSent() {
    alert("Se le ha enviado  un correo con su contraseña a la dirección que proporcionó");
  }

  showAlertDialogNotVersion(urlDescarga) {
    alert("Versión desactualizada. Descargue la aplicación disponible en: "+ urlDescarga);
  }

  showAlertDialogNotConfirmed() {
    alert("Correo no confirmado. Le hemos enviado un correo que debe confirmar. Si está teniendo problemas en esto, comuníquese al: +5355759386");
  }

  showAlertDialogBlocked() {
    alert("Cuenta bloqueada. Por términos de seguridad y legales su cuenta ha sido bloqueada");
  }

  showAlertDialogUserPasswordWrong() {
    alert("Usuario o contraseña incorrectos");
  }

}
let loginActivity = new LoginDriverActivity();




