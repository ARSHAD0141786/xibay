import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { LogsServiceProvider } from '../../providers/logs-service/logs-service';
import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-otp-validation',
  templateUrl: 'otp-validation.html',
})
export class OtpValidationPage {

  verificationId: any;
  code: string="";
  phoneNumber: string="";
  isOTPSent:boolean;
  sendInnerHtml:string;
  verifyInnerHtml:string;
  counter:number=0;
  message:string;
  myInterval:any;
  timeLeft:number;
  resendInterval:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,private logs:LogsServiceProvider,private viewCtrl: ViewController) {
    
  }

  validatePhoneNumber(){
    if(this.phoneNumber.length < 10 || this.phoneNumber.length > 10){
      this.message='Invalid Phone number';
    }else{
      this.message=null;
      this.sendOTP();
    }
  }

  validateOTP(){
    if(this.code.length < 6 || this.code.length > 6){
      this.message = 'Invalid OTP';
    }else{
      this.message = null;
      this.verifyOTP();
    }
  }

  sendOTP(){
    clearInterval(this.myInterval);//for safety
    console.log('OTP SEND to : '+this.phoneNumber);
    this.myInterval = setInterval( () => {
      this.setInnerHtml(1);
    },500);
  
    (<any>window).FirebasePlugin.verifyPhoneNumber('+91' + this.phoneNumber,60,(credentials)=>{
      this.logs.addLog("Firebase Auth : "+credentials);
      this.verificationId = credentials.verificationId;
      this.message=null;
      //common stuff
      this.sendInnerHtml = 'Send Otp';
      this.counter = 0;
      clearInterval(this.myInterval);
      this.startResendTimeout();
      this.isOTPSent = true;
    },(error)=>{
      this.message = error;
      this.logs.addLog("Error : "+error);
      //common stuff
      this.sendInnerHtml = 'Send Otp';
      this.counter = 0;
      clearInterval(this.myInterval);
    });
  }

  startResendTimeout(){
    this.resendInterval = setInterval( () => {
      this.timeLeft--;
      if(this.timeLeft == 0){
        clearInterval(this.resendInterval);
      }
    },1000);
  }

  setInnerHtml(i:number){
    if(i==1){
      switch(this.counter%4){
        case 0: this.sendInnerHtml = 'Sending.';break;
        case 1: this.sendInnerHtml = 'Sending..';break;
        case 2: this.sendInnerHtml = 'Sending...';break;
        case 3: this.sendInnerHtml = 'Sending';break;
      }
    }else{
      switch(this.counter%4){
        case 0: this.verifyInnerHtml = 'Verifying.';break;
        case 1: this.verifyInnerHtml = 'Verifying..';break;
        case 2: this.verifyInnerHtml = 'Verifying...';break;
        case 3: this.verifyInnerHtml = 'Verifying';break;
      }
    }
    this.counter++;
  }

  verifyOTP(){
    this.myInterval = setInterval( () => {
      this.setInnerHtml(2);
    },500);
    let signInCredential = firebase.auth.PhoneAuthProvider.credential(this.verificationId,this.code);
    
    firebase.auth().signInWithCredential(signInCredential).then((info)=>{
      console.log(info);
      this.logs.addLog(""+info);
      this.message = 'Successfully verified OTP';
      this.verifyInnerHtml = 'Verify OTP';
      clearInterval(this.myInterval);
      clearInterval(this.resendInterval);
      this.viewCtrl.dismiss(this.phoneNumber);
    },(error)=>{
      this.message = 'Wrong OTP';
      this.verifyInnerHtml = 'Verify OTP';
      clearInterval(this.myInterval);
      this.logs.addLog(error);
    });
  }

  //remove this method in production mode
  verifyWithoutOtp(){
    this.viewCtrl.dismiss(this.phoneNumber);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OtpValidationPage');
    this.sendInnerHtml = 'Send OTP';
    this.verifyInnerHtml = 'Verify OTP';
    this.isOTPSent = false;
    this.message = null;
    this.timeLeft = 2*60;// 2min = 120 sec = 120000milisec
  }

  editPhoneNumber(){
    this.sendInnerHtml = 'Send OTP';
    this.verifyInnerHtml = 'Verify OTP';
    this.isOTPSent = false;
    this.message = null;
    clearInterval(this.myInterval);
    this.timeLeft = 2*60;
    clearInterval(this.resendInterval);
  }


}
