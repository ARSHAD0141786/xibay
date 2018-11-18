import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
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
  isOTPSent:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,private logs:LogsServiceProvider,private viewCtrl: ViewController) {
  }

  sendOTP(){
    this.logs.addLog("Sending OTP...");
    console.log('OTP SEND : '+this.phoneNumber);
    this.isOTPSent = true;
    (<any>window).FirebasePlugin.verifyPhoneNumber("+91" + this.phoneNumber,60,(credentials)=>{
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
    this.viewCtrl.dismiss(true);
    },(error)=>{
      this.logs.addLog(error);
    });
  }

  //remove this method in production mode
  verifyWithoutOtp(){
    this.viewCtrl.dismiss(this.phoneNumber);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OtpValidationPage');
  }

  editPhoneNumber(){
    this.isOTPSent = false;
  }


}
