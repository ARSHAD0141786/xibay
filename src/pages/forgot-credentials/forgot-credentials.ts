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
  eyeIcon:string;
  type:string;
  ott:string;
  message:string;
  constructor(public navCtrl: NavController,private networkEngine:NetworkEngineProvider, public navParams: NavParams,private viewCtrl:ViewController) {
   
  }

  changeType(){
    if(this.type=='password'){
      this.type = 'text';
      this.eyeIcon = 'ios-eye-off';
    }else{
      this.type = 'password';
      this.eyeIcon = 'ios-eye';
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotCredentialsPage');
    this.eyeIcon = 'ios-eye';
    this.type = 'password';
    if(this.navParams.get('username')){
      console.log('Username found forgot credentials'+this.navParams.get('username'));
      this.username = this.navParams.get('username');
      this.findUser();
    }
  }

  findUser(){
    this.message = null;
    if(this.username==null || this.username.trim().length == 0){
      this.message = 'No username found';
      return;
    }
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
        this.message = 'Invalid username. In case if you forgot your username then contact XIBAY team, from contact section in menu';
      }
    },(err) => {
      this.message = err;
    });
  }
  resetPassword(){
    this.message = null;
    if(this.newPassword==null || this.newPassword.trim().length < 5){
      this.message = 'Your password should be atleast 5 characters, for better security';
      return;
    }
    if(this.newPassword == this.cnfNewPassword){
      let userPostData:any = {
        username:this.username,
        phone:this.navParams.get('phone'),
        ott:this.ott,
        new_password:this.newPassword.trim()
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
