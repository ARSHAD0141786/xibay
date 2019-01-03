import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { User } from '../../interfaces/user';

@Injectable()
export class UserDataProvider {
  static userPostData:User;
  static fcmToken:string;

  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';
  USER_DATA = 'user_data-for-xibay';

  constructor(
    public events: Events,
    public storage: Storage) {
    console.log('Hello UserDataProvider Provider');
  }

  login(result:any): void {
    this.setUserData(result);
    this.storage.set(this.HAS_LOGGED_IN, true);
    this.events.publish('user:login');
  };

  setUserData(result:any){
    let user_data = result.user_data;
    let user:User = {
      token:result.token,
      username:user_data.username,
      name:user_data.name,
      phone_number:user_data.phone_number,
      branch:user_data.branch,
      gender:user_data.gender,
      year:Number.parseInt(user_data.year),
      user_image_url:user_data.user_image_url
    }
    console.log(user.year);
    switch(user.year){
      case 1:user.year_name = '1st';break;
      case 2:user.year_name = '2nd';break;
      case 3:user.year_name = '3rd';break;
      case 4:user.year_name = 'Final';break;
    }
    switch(user.branch){
      case 'ARC':user.branch_name = 'Architecture';break;
      case 'CH':user.branch_name = 'Chemical';break;
      case 'CIV':user.branch_name = 'Civil';break;
      case 'CSE':user.branch_name = 'Computer Science';break;
      case 'EE':user.branch_name = 'Electrical';break;
      case 'ECC':user.branch_name = 'ECC';break;
      case 'ECE':user.branch_name = 'ECE';break;
      case 'EEE':user.branch_name = 'EEE';break;
      case 'IT':user.branch_name = 'Information Technology';break;
      case 'ME':user.branch_name = 'Mechanical';break;
      case 'MI':user.branch_name = 'Mining';break;
      case 'P&I':user.branch_name = 'Production & Industrial';break;
    }
    UserDataProvider.userPostData = user;
    this.storage.set(this.USER_DATA,user);
  }

  changeUserImageUrl(imageUrl:string){//function calls from account.ts while changing user account picture
    let currentUser = UserDataProvider.userPostData;//just copying previous data and add new image url entry
    let user:any = {
      user_data:{
        username:currentUser.username,
        name:currentUser.name,
        phone_number:currentUser.phone_number,
        branch:currentUser.branch,
        gender:currentUser.gender,
        year:currentUser.year,
        user_image_url:imageUrl
      },
      token:currentUser.token
    }
    this.setUserData(user);
  }

  // this function will invoke when user is registered
  // use this function in future in case when user registered then no need to login again direct login user when registered
  signup(value:any): void {
    this.events.publish('user:signup');
  };

  logout(): void {
    console.log("Logging out");
    // remove all saved data
    this.events.publish('user:logout');
    UserDataProvider.userPostData = undefined;
    this.storage.remove(this.HAS_LOGGED_IN);
    this.storage.remove(this.USER_DATA);
    this.events.publish('user:logout');
    try{
      (<any>window).FirebasePlugin.unregister();
    }catch(err){
      console.log(err);
    }
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
