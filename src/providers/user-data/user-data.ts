import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Injectable()
export class UserDataProvider {
  public userPostData:any = {
    username:'',
    token:'',
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
    this.userPostData.username = user_data.username;
    this.userPostData.token = result.token;
    this.storage.set('user_data',user_data);
    this.storage.set(this.HAS_LOGGED_IN, true);

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
    this.storage.remove(this.HAS_LOGGED_IN);
    this.storage.remove('username');
    this.storage.remove('token');
    this.storage.remove('user_data');

    this.events.publish('user:logout');
  };

  getUsername(): Promise<string>{
    return this.storage.get('username').then((value:string) => {
      this.userPostData.username = value;
      return value;
    });
  };
  getToken(): Promise<string>{
    return this.storage.get('token').then((value:string) => {
      this.userPostData.token = value;
      return value;
    });
  };

  getUserPostData(){
    return this.userPostData;
  }

  hasLoggedIn(): Promise<boolean> {
    console.log(this.storage.get(this.HAS_LOGGED_IN));
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      return value === true;
    });
  };

  checkHasSeenTutorial(): Promise<string> {
    return this.storage.get(this.HAS_SEEN_TUTORIAL).then((value) => {
      return value;
    });
  };
}
