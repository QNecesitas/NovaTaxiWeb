import DriverDataSourceNetwork from '../network/DriverDataSourceNetwork.js';

export default class ViewModelInfoDriver{
    driverDataSource= new DriverDataSourceNetwork();

    getDriver(stateObserve,responseObserver,email){
        this.driverDataSource.getDriverInformation(stateObserve,responseObserver,email);
    }
}