import DriverDataSourceNetwork from '../network/DriverDataSourceNetwork.js';

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
}    