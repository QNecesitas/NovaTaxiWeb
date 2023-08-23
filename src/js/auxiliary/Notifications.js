export default class RoutesTools{

  static notify(bodyNotification){
    if("Notification" in window){

      Notification.requestPermission().then(function (permission) {
        if(permission === "granted"){
          let notification = new Notification("Aviso de NovaTaxi", {
            body: bodyNotification,
            icon: "../icon.png"
          });
        }else{
          alert(bodyNotification)
        }
      })

    }else{
      alert(bodyNotification)
    }
  }


}
