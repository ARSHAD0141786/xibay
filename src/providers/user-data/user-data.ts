import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Injectable()
export class UserDataProvider {
  static userPostData:any = {
    username:'',
    token:'',
    phone:''
  };

  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';
  constructor(
    public events: Events,
    public storage: Storage) {
    console.log('Hello UserDataProvider Provider');
  }

  login(result:any): void {
    console.log(result);
    let user_data = result.user_data;
    // set storage data
    this.storage.set('username',user_data.username);
    this.storage.set('token',result.token);
    this.storage.set('phone',user_data.phone_number);
    UserDataProvider.userPostData.username = user_data.username;
    UserDataProvider.userPostData.token = result.token;
    UserDataProvider.userPostData.phone = user_data.phone_number;
    this.storage.set(this.HAS_LOGGED_IN, true);
    //there is no use of user_data remove below line as it is wasting storage in future production mode
    this.storage.set('user_data',user_data);
    this.events.publish('user:login');
  };

  // this function will invoke when user is registered
  // use this function in future in case when user registered then no need to login again direct login user when registered
  signup(value:any): void {
    this.events.publish('user:signup');
  };

  logout(): void {
    console.log("Logging out");
    // remove all saved data
    UserDataProvider.userPostData.username = '';
    UserDataProvider.userPostData.token = '';
    UserDataProvider.userPostData.phone = '';

    this.storage.remove(this.HAS_LOGGED_IN);
    this.storage.remove('username');
    this.storage.remove('token');
    this.storage.remove('user_data');
    this.events.publish('user:logout');
  };

  getUserPostData(){
    return UserDataProvider.userPostData;
  }

  hasLoggedIn(): Promise<boolean> {
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      console.log('User logged in : '+value);
      return value;
    });
  };

  checkHasSeenTutorial(): Promise<string> {
    return this.storage.get(this.HAS_SEEN_TUTORIAL).then((value) => {
      console.log('User has seen tutorials : '+ value);
      return value;
    });
  };
}
