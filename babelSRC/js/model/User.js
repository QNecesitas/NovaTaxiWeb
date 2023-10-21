export default class User {
  email;
  phone;
  name;
  state;
  password;
  constructor(email, phone, name, state, password) {
    this.email = email;
    this.phone = phone;
    this.name = name;
    this.state = state;
    this.password = password;
  }
}