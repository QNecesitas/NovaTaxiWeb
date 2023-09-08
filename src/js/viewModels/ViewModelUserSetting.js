import UserDataSourceNetwork from '../network/UserDataSourceNetwork.js';

export default class ViewModelUserSetting{

    userDataSource= new UserDataSourceNetwork();

    getUserInformationAll(stateObserve,responseObserver,email){
        this.userDataSource.getUserInformationAll(stateObserve,responseObserver,email);
    }

    updateUser(stateObserve,email,phone,password){
        this.userDataSource.updateUser(stateObserve,email,password,phone);
    }

    deleteUsers(stateObserve,email){
        this.userDataSource.deleteUser(stateObserve,email);
    }
}