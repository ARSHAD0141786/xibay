import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { LogsServiceProvider } from '../../providers/logs-service/logs-service';
import * as firebase from 'firebase';
import { NetworkEngineProvider } from '../../providers/network-engine/network-engine';

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
  isPhoneNumberExists:boolean;

  constructor(public navCtrl: NavController,private networkEngine:NetworkEngineProvider, public navParams: NavParams,private logs:LogsServiceProvider,private viewCtrl: ViewController) {
    
  }

  validatePhoneNumber(){
    this.message = null;
    if(this.phoneNumber.length < 10 || this.phoneNumber.length > 10){
      this.message='Invalid Phone number';
    }else{
      this.checkNumberInDatabase();
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
    },300);
    try{
      (<any>window).FirebasePlugin.verifyPhoneNumber('+91' + this.phoneNumber,60,(credentials)=>{
        clearInterval(this.myInterval);
        this.logs.addLog("Firebase Auth : "+credentials);
        this.verificationId = credentials.verificationId;
        //common stuff
        this.counter = 0;
        this.isOTPSent = true;
        this.message=null;
        this.startResendTimeout();
      },(error)=>{
        this.message = error;
        this.logs.addLog("Error : "+error);
        //common stuff
        this.sendInnerHtml = 'Send Otp';
        this.counter = 0;
        clearInterval(this.myInterval);
      });
    }catch(err){
      console.log(err);
      this.message = err;
    }
    
  }

  startResendTimeout(){
    this.resendInterval = setInterval( () => {
      this.timeLeft--;
      if(this.timeLeft == 1800000){
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
    
    try{
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
    }catch(err){
      this.message = err;
      console.log(err);
      clearInterval(this.myInterval);
    }
  }

  checkNumberInDatabase(){
    let userPostData:any = {
      phone_number : this.phoneNumber,
    }
    this.sendInnerHtml = 'Please wait...';
    this.networkEngine.post(userPostData,'check-phone-number-exists').then( (result:any) => {
      this.sendInnerHtml = 'Send OTP';
      if(result.code ==786){
        this.isPhoneNumberExists = true;
      }else{
        this.isPhoneNumberExists = false;
      }
      if(this.navParams.get('wantUserToExists') == this.isPhoneNumberExists){
        this.sendOTP();
      }else{
        if(this.navParams.get('wantUserToExists')){
          if(this.isPhoneNumberExists){
            this.message = 'This number is already registered';
          }else{
            this.message = 'Sorry! This number is not registered with us';
          }
        }
      }
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
    this.timeLeft = 1800000+90*1000;// 2min = 120 sec = 120000milisec
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
