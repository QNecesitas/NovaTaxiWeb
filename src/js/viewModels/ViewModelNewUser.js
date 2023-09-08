import UserDataSourceNetwork from '../network/UserDataSourceNetwork.js';

export default class ViewModelNewUser {

    userDataSource= new UserDataSourceNetwork();

    addNewAccountUser(stateObserve,name,email,phone,password){
        this.userDataSource.addUserInformation(stateObserve,name,email,phone,password);
    }
}