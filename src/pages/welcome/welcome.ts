import { Component } from '@angular/core';
import { IonicPage,NavController, ModalController, AlertController } from 'ionic-angular';
import { LogsServiceProvider } from '../../providers/logs-service/logs-service';

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {

  responseData:any;
  url:string;
  constructor(public navCtrl: NavController, private modalCtrl: ModalController, private logs: LogsServiceProvider,private alertCtrl:AlertController) {
  }

  signup(){
    //load terms and conditions if they accepted then load otp validation and then signup page
    let tc_modal = this.modalCtrl.create('TermsAndConditionPage');
    tc_modal.onDidDismiss(value => {
      if(value==true){
        let otp_modal = this.modalCtrl.create('OtpValidationPage',{wantUserToExists:false});
        otp_modal.onDidDismiss(phoneNumber => {
          console.log('user verified through OTP : ' + phoneNumber);
          if(phoneNumber){
            this.navCtrl.push('RegistrationPage',{phone:phoneNumber});
          }
        });
        otp_modal.present();
      }
      if(value==false){
        //notify user
      }
    })
    tc_modal.present();
  }
  login(){
    this.logs.addLog("Welcome login btn clicked loading logging page...");
    this.navCtrl.push('LoginPage');
  }

  ionViewCanLeave(){
    let alert = this.alertCtrl.create({
      message:'Do you want to exit from XIBAY ?',
      buttons:[
        { text:'NAH',role:'cancel',handler:()=>{return false}},
        { text:'Yes' ,handler:()=>{return true;}}
      ]
    });
    alert.present();
  }
}