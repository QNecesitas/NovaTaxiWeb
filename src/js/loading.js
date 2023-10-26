

// Obtener la cadena User-Agent 
const userAgent = navigator.userAgent; 
 
// Buscar la versión de iOS utilizando una expresión regular 
const iOSVersion = parseFloat(('' + (/CPU.*OS ([0-9_]{1,5})|(CPU like).*AppleWebKit.*Mobile/i.exec(userAgent) || [0,''])[1]) 
.replace('undefined', '3_2').replace('_', '.').replace('_', '')) || false; 
const isiPhone = /iPhone/i.test(navigator.userAgent);


// Comparar la versión con un valor específico 
if (isiPhone && iOSVersion && iOSVersion < 17) { 
  let imgAlert= document.createElement("img");
  imgAlert.setAttribute("class", "imgAlert");
  imgAlert.setAttribute("src", "src/img/warning_FILL0_wght400_GRAD0_opsz24.svg");
  let textAlert=document.createElement("h2");
  textAlert.setAttribute("class", "textAlert")
  textAlert.innerHTML="Su versi&oacute;n no es compatible, por favor actualice a la versi&oacute;n 17 de iOS";
  document.querySelector('#loading').appendChild(imgAlert);
  document.querySelector('#loading').appendChild(textAlert);
} else {
    document.querySelector('#loading');
    let textLoading=document.createElement("h2");
    textLoading.setAttribute("class", "textAlert");
    
    textLoading.innerHTML="Cargando...";
    
    document.querySelector('#loading').appendChild(textLoading);
    
 window.location.href ='https://qnecesitas.nat.cu/NovaTaxi/src/index.html';
}

