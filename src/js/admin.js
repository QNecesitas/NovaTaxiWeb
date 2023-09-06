/*codigo prueba html 2secciones*/

//variables html doble seccion
const botonConductores = document.getElementById('boton-conductores');
const botonViajes = document.getElementById('boton-viajes');
const seccionConductores = document.getElementById('seccion-conductores');
const seccionViajes = document.getElementById('seccion-viajes');

//variables para search
const botonSearch=document.querySelector('#btn-search');
const inputSearch=document.querySelector('#form-search');
const money=document.querySelector('.money-header');
const adminH2=document.querySelector('.h2-header');
const btnCerrar=document.querySelector('#btn-cerrar');

//variables para accordion
const btn_ac=document.querySelector('#btn-aux-accordion');
const ac_body=document.querySelector('.ac-body');


//html doble seccion
botonConductores.addEventListener('click', function() {
  seccionConductores.style.display = 'block'; // Muestra la sección de carros
  seccionViajes.style.display = 'none'; // Oculta la sección de motos
});

botonViajes.addEventListener('click', function() {
  seccionConductores.style.display = 'none'; // Oculta la sección de carros
  seccionViajes.style.display = 'block'; // Muestra la sección de motos
});


//search
botonSearch.addEventListener('click', function(){
   money.style.display='none';
   adminH2.style.display='none';
   inputSearch.style.display = 'block';
   btnCerrar.style.display='block';
} )
btnCerrar.addEventListener('click', function(){
    money.style.display='block';
    adminH2.style.display='block';
    inputSearch.style.display = 'none';
    btnCerrar.style.display='none';
 } )

 //accordion
 btn_ac.addEventListener('click', function(){
    ac_body.style.display='block';
} )