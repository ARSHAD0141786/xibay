import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LogsServiceProvider } from '../../providers/logs-service/logs-service';
import * as firebase from 'firebase';
/**
 * Generated class for the OtpValidationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-otp-validation',
  templateUrl: 'otp-validation.html',
})
export class OtpValidationPage {

  verificationId: any;
  code: string="";
  phoneNumber: string="";

  constructor(public navCtrl: NavController, public navParams: NavParams,private logs:LogsServiceProvider) {
  }

  sendOTP(){
    this.logs.addLog("Sending OTP...");
    (<any>window).FirebasePlugin.verifyPhoneNumber("+91" + this.phoneNumber,60,(credentials)=>{
      alert("SMS Sent successfullly");
      this.logs.addLog("Firebase Auth : "+credentials);
      this.verificationId = credentials.verificationId;
    },(error)=>{
      this.logs.addLog("Error : "+error);
    });
  }

  verifyOTP(){
    let signInCredential = firebase.auth.PhoneAuthProvider.credential(this.verificationId,this.code);
    firebase.auth().signInWithCredential(signInCredential).then((info)=>{
    console.log(info);
    this.logs.addLog(""+info);
    },(error)=>{
      this.logs.addLog(error);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OtpValidationPage');
  }


}
