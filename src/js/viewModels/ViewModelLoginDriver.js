import DriverAccountShared from '../auxiliary/DriverAccountShared.js';
import DriverDataSourceNetwork from '../network/DriverDataSourceNetwork.js';
import AuxiliaryDataSourceNetwork from '../network/AuxiliaryDataSourceNetwork.js';

export default class ViewModelLoginDriver {

  driverDataSource = new DriverDataSourceNetwork();
  auxiliaryDataSource = new AuxiliaryDataSourceNetwork();



  getIsValidAccount(stateObserve, responseObserver,email, password,) {
    this.driverDataSource.getDriverExist(stateObserve,responseObserver,email,password);
  }



  saveDriverInfo(email) {
    DriverAccountShared.setDriverEmail(email);
  }



  sendRecoverPetition(stateObserve,email) {
    this.driverDataSource.sendRecoverPetition(stateObserve,email);
  }


  getAppVersion(observerState, observerResponse) {
    this.auxiliaryDataSource.getVersion(observerState,observerResponse);
  }
}



