import DriverDataSourceNetwork from '../network/DriverDataSourceNetwork.js';
import Vehicle from '../model/Vehicle.js';
export default class ViewModelDriverSetting{

    driverDataSource= new DriverDataSourceNetwork();

    getDriverInformationAll(stateObserve,responseObserver,email){
        this.driverDataSource.getDriverInformation(stateObserve,responseObserver,email);
    }

    updateDriver(stateObserve,email,password,name,phone,typeCar,maxDist,statePhoto,cantSeat,numberPlate,imageFile){
        this.driverDataSource.updateDriver(stateObserve,email,name,phone,typeCar,cantSeat,maxDist,password,numberPlate,statePhoto,imageFile);
    }

    deleteDriver(stateObserve,email){
        this.driverDataSource.deleteDriver(stateObserve,email);
    }
    getVehiclesList(){
        let result = [];
        result.push(new Vehicle("Auto básico",0,4,"Vehículo sencillo con alrededor de 4 capacidades, ideal para obtener mejores precios"));
        result.push(new Vehicle("Auto de confort",0,4,"Vehículo muy cómodo con alrededor de 4 capacidades y aire acondicionado"));
        result.push(new Vehicle("Auto familiar",0,8,"Vehículo cómodo con alrededor de 8 capacidades, ideal para el viaje en familia"));
        result.push(new Vehicle( "Triciclo",0,2,"Vehículo triciclo con alrededor de 2 asientos, ideal para viajes cortos"));
        result.push(new Vehicle("Motor",0,1,"Vehículo con solo 1 capacidad, ideal para viajes rápidos y sin mucho equipaje"));
        result.push(new Vehicle("Bicitaxi",0,2,"Vehículo con solo 2 capacidades, ideal para viajes cortos y cómodos"));
        console.log(result);
        return result;
       
    }
}    