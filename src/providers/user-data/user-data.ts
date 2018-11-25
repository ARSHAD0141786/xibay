import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { User } from '../../interfaces/user';

@Injectable()
export class UserDataProvider {
  static userPostData:User;

  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';
  USER_DATA = 'user_data-for-xibay';
  constructor(
    public events: Events,
    public storage: Storage) {
    console.log('Hello UserDataProvider Provider');
  }

  login(result:any): void {
    console.log(result);
    let user_data = result.user_data;
    // set storage data
    let user:User = {
      username:user_data.username,
      token:result.token,
      name:user_data.name,
      phone_number:user_data.phone_number,
      branch:user_data.branch,
      gender:user_data.branch,
      year:Number.parseInt(user_data.year),
      year_name:'',
      user_image_url:user_data.user_image_url
    }
    console.log(user.year);
    switch(user.year){
      case 1:user.year_name = '1st';break;
      case 2:user.year_name = '2nd';break;
      case 3:user.year_name = '3rd';break;
      case 4:user.year_name = 'Final';break;
    }
    console.log(user.year_name);
    UserDataProvider.userPostData = user;
    this.storage.set(this.HAS_LOGGED_IN, true);
    this.storage.set(this.USER_DATA,user);
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
    UserDataProvider.userPostData = undefined;
    this.storage.remove(this.HAS_LOGGED_IN);
    this.storage.remove(this.USER_DATA);
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
