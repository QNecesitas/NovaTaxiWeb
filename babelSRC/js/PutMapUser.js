import UserAccountShared from './auxiliary/UserAccountShared.js';
export default class PutMapUser {
  map;
  constructor() {
    let marker; // Variable para el marcador
    let geolocate; // Variable para la capa de ubicación en tiempo real
    let lastLocationGps;
    let lastLocationPoint;
    let lastPointSelected = UserAccountShared.getLastLocation();
    mapboxgl.accessToken = 'pk.eyJ1Ijoicm9ubnlucCIsImEiOiJjbGl4YTg3bDgwNHpwM2RucTlwdWFkOXN1In0.MlTnx-myS4E3LJUeh5CVbw';
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/ronnynp/cljbmkjqs00gt01qrb2y3bgxj',
      center: [lastPointSelected.longitude, lastPointSelected.latitude],
      zoom: 12,
      // starting zoom,
      pitch: 70.0
    });
    let customMarker; // Variable para el marcador personalizado
    let context = this;
    this.map.on('mousedown', function (e) {
      // Obtener las coordenadas de la ubicación donde se hizo clic
      const latitudePoint = e.lngLat.lat;
      const longitudePoint = e.lngLat.lng;
      lastLocationPoint = {
        latitude: latitudePoint,
        longitude: longitudePoint
      };
      // Eliminar el marcador anterior si existe
      if (customMarker) {
        customMarker.remove();
      }

      // Crear un marcador personalizado (puedes cambiar el icono y estilo según tus necesidades)
      customMarker = new mapboxgl.Marker({
        color: 'red',
        // Color del marcador
        draggable: true // Permite arrastrar el marcador
      }).setLngLat([longitudePoint, latitudePoint]) // Establecer la ubicación del marcador
      .addTo(context.map); // Agregar marcador al mapa

      // Agregar eventos de arrastre al marcador (opcional)
      customMarker.on('dragend', function () {
        const newCoordinates = customMarker.getLngLat();
        console.log('Nuevas coordenadas del marcador:', newCoordinates);
      });
    });

    // Eliminar el marcador anterior si existe
    if (marker) {
      marker.remove();
    }

    // Configurar la capa de ubicación en tiempo real
    geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true // Habilitar alta precisión
      },

      trackUserLocation: true,
      // Rastrear la ubicación en tiempo real
      showUserLocation: true,
      // Mostrar la ubicación del usuario en el mapa
      showAccuracyCircle: true // Mostrar círculo de precisión
    });

    this.map.addControl(geolocate);

    // Escuchar el evento 'geolocate' para manejar actualizaciones de ubicación
    geolocate.on('geolocate', function (e) {
      // Obtener las coordenadas de la ubicación
      const latitudeGps = e.coords.latitude;
      const longitudeGps = e.coords.longitude;
      lastLocationGps = {
        latitude: latitudeGps,
        longitude: longitudeGps
      };

      // Crear un marcador personalizado (puedes cambiar el icono y estilo según tus necesidades)
      if (!marker) {
        marker = new mapboxgl.Marker({
          color: 'blue',
          // Color del marcador
          draggable: true // Permite arrastrar el marcador
        }).setLngLat([longitudeGps, latitudeGps]) // Establecer la ubicación del marcador
        .addTo(this.map); // Agregar marcador al mapa
      } else {
        // Actualizar la posición del marcador en el mapa
        marker.setLngLat([longitudeGps, latitudeGps]);
      }
    });

    // Iniciar la geolocalización
    geolocate.trigger();
    document.getElementById("select-ubic").addEventListener("click", () => {
      this.addLocation(lastLocationGps, lastLocationPoint);
    });
    document.getElementById("back").addEventListener('click', () => {
      window.open("MaphomeUser.html", "_self");
    });
  }
  addLocation(lastLocationGps, lastLocationPoint) {
    if (!lastLocationPoint) {
      if (!lastLocationGps) {
        alert("No ha añadido su posición");
      } else {
        let result = confirm("¿Desea escoger su ubicación actual?");
        if (result) {
          let resultLocation = JSON.stringify(lastLocationGps);
          const miCanal = new BroadcastChannel("putmap_channel");
          miCanal.postMessage(resultLocation);
          window.close();
        }
      }
    } else {
      let resultLocation = JSON.stringify(lastLocationPoint);
      const miCanal = new BroadcastChannel("putmap_channel");
      miCanal.postMessage(resultLocation);
      window.close();
    }
  }
}
let putMapUser = new PutMapUser();