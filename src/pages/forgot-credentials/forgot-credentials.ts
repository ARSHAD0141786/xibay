import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { NetworkEngineProvider } from '../../providers/network-engine/network-engine';

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
  ott:string;
  message:string;
  constructor(public navCtrl: NavController,private networkEngine:NetworkEngineProvider, public navParams: NavParams,private viewCtrl:ViewController) {
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotCredentialsPage');
  }

  findUser(){
    let userPostData:any = {
      username : this.username,
      phone: this.navParams.get('phone')
    }
    console.log('Find user : '+this.username);
    this.networkEngine.post(userPostData,'check-user-with-phone-and-username').then( (result:any) => {
      if(result.code == 786){
        this.ott = result.ott;
        this.isUserFound = true;
        this.message = null;
      }else{
        this.message = 'Invalid username. In case if you forgot your username then contact XIBAY team form contact section in menu';
      }
    },(err) => {
      this.message = err;
    });
  }
  resetPassword(){
    if(this.newPassword == this.cnfNewPassword){
      let userPostData:any = {
        username:this.username,
        phone:this.navParams.get('phone'),
        ott:this.ott
      }
      this.networkEngine.post(userPostData,'change-password').then( (result:any) => {
        if(result.code == 786){
          this.message = 'Password changed successfully';
          this.viewCtrl.dismiss();
        }else{
          this.message = 'Password not changed. Please try again later!'
        }
        
      },(err) => {
        this.message = err;
      });
    }else{
      this.message = 'New password and confirm new password are not same';
    }
  }
}
