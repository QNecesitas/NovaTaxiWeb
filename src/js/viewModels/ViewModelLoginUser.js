import UserAccountShared from '../auxiliary/UserAccountShared.js';
import UserDataSourceNetwork from '../network/UserDataSourceNetwork.js';
import AuxiliaryDataSourceNetwork from '../network/AuxiliaryDataSourceNetwork.js';

export default class ViewModelLoginUser {

  userDataSource = new UserDataSourceNetwork();
  auxiliaryDataSource = new AuxiliaryDataSourceNetwork();



  getIsValidAccount(stateObserve, responseObserver,email, password,) {
    stateObserve("LOADING");
    this.userDataSource.getUserExist(stateObserve,responseObserver,email,password);
  }



  saveUserInfo(email) {
    UserAccountShared.setUserEmail(email);
  }



  sendRecoverPetition(email) {
    this.userDataSource.sendRecoverPetition(email);
  }


  getAppVersion(observerState, observerResponse) {
    this.auxiliaryDataSource.getVersion(observerState,observerResponse);
  }
}



