import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-forgot-credentials',
  templateUrl: 'forgot-credentials.html',
})
export class ForgotCredentialsPage {

  isUserFound:boolean = false;
  newPassword:string;
  cnfNewPassword:string;
  username:string;
  constructor(public navCtrl: NavController, public navParams: NavParams,private viewCtrl:ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotCredentialsPage');
  }

  findUser(){
    console.log('Find user : '+this.username);
    this.isUserFound = true;
  }
  resetPassword(){
    if(this.newPassword == this.cnfNewPassword){
      console.log('Password : '+this.newPassword);
    }
    this.viewCtrl.dismiss();
  }

}
