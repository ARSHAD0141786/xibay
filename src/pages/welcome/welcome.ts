import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { LogsServiceProvider } from '../../providers/logs-service/logs-service';
import { RegistrationPage } from '../registration/registration';

@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {

  responseData:any;
  url:string;
  constructor(public navCtrl: NavController,private modalCtrl: ModalController, private logs: LogsServiceProvider) {
  }

  signup(){
    //load terms and conditions if they accepted then load otp validation and then signup page
    let tc_modal = this.modalCtrl.create('TermsAndConditionPage');
    tc_modal.onDidDismiss(value => {
      console.log(value);
      if(value==true){
        console.log('Open OTP Modal');
        let otp_modal = this.modalCtrl.create('OtpValidationPage');
        otp_modal.onDidDismiss(phoneNumber => {
          console.log('user verified through OTP : ' + phoneNumber);
          if(phoneNumber){
            this.navCtrl.push(RegistrationPage,{phone:phoneNumber});
          }
        });
        otp_modal.present();
      }
      if(value==false){
        
      }
    })
    tc_modal.present();
  }
  login(){
    this.logs.addLog("Welcome login btn clicked loading logging page...");
    this.navCtrl.push(LoginPage);
  }
}
