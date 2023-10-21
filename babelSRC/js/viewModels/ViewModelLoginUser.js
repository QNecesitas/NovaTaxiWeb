import UserAccountShared from '../auxiliary/UserAccountShared.js';
import UserDataSourceNetwork from '../network/UserDataSourceNetwork.js';
import AuxiliaryDataSourceNetwork from '../network/AuxiliaryDataSourceNetwork.js';
export default class ViewModelLoginUser {
  userDataSource = new UserDataSourceNetwork();
  auxiliaryDataSource = new AuxiliaryDataSourceNetwork();
  getIsValidAccount(stateObserve, responseObserver, email, password) {
    this.userDataSource.getUserExist(stateObserve, responseObserver, email, password);
  }
  saveUserInfo(email) {
    UserAccountShared.setUserEmail(email);
  }
  sendRecoverPetition(stateObserve, email) {
    this.userDataSource.sendRecoverPetition(stateObserve, email);
  }
  getAppVersion(observerState, observerResponse) {
    this.auxiliaryDataSource.getVersion(observerState, observerResponse);
  }
}