import DriverDataSourceNetwork from '../network/DriverDataSourceNetwork.js';

export default class ViewModelDriverSetting{

    driverDataSource= new DriverDataSourceNetwork();

    getDriverInformationAll(stateObserve,responseObserver,email){
        this.driverDataSource.getDriverInformationAll(stateObserve,responseObserver,email);
    }

    updateDriver(stateObserve,email,password,name,phone,typeCar,maxDist,latitud,longitude,state,statePhoto,balance,cantSeat,rating,numberPlate){
        this.driverDataSource.updateDriver(stateObserve,email,password,name,phone,typeCar,maxDist,latitud,longitude,state,statePhoto,balance,cantSeat,rating,numberPlate
        )
    }

    deleteDriver(stateObserve,email){
        this.driverDataSource.deleteDriver(stateObserve,email);
    }
}    