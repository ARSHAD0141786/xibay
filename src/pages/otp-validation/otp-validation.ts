import { Component, ViewChild } from '@angular/core';
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

  @ViewChild('phoneNumberInput') phoneNumberInput;
  verificationId: any;
  code: string="";
  phoneNumber: string="";
  
  
  //otp status 
  /**
   * 0 : not initialize anything
   * 1 : verifying phone number in database
   * 2 : otp send initialize
   * 3 : otp not sent successfully
   * 4 : otp sent successfully
   * 5 : otp verifying
   * 6 : otp verified successfully
   * 7 : otp not verified successfully
   * 8 : resending OTP
   */
  otpStatus:number = 0;
  btnText:any = [
    "Send OTP",
    "Please wait...",
    "Sending OTP...",
    "Send OTP",
    "Verify OTP",
    "Verifying OTP...",
    "Verified",
    "Verify OTP",
    "Resending OTP..."
  ]
  
  message:string;
  canEditPhoneNumber:boolean;
  isPhoneNumberExists:boolean;

  constructor(public navCtrl: NavController,private networkEngine:NetworkEngineProvider, public navParams: NavParams,private logs:LogsServiceProvider,private viewCtrl: ViewController) {
    
  }

  validatePhoneNumber(){
    this.message = null;
    if(this.phoneNumber.length < 10 || this.phoneNumber.length > 10){
      this.message='Invalid Phone number';
    }else{
      this.otpStatus = 1;
      this.checkNumberInDatabase();
    }
  }

  validateOTP(){
    if(this.code.length < 6 || this.code.length > 6){
      this.message = 'Invalid OTP! It must be a 6-digit number';
    }else{
      this.otpStatus = 5;
      this.message = null;
      this.verifyOTP();
    }
  }

  resendOTP(){
    this.otpStatus = 8;
    try{
      (<any>window).FirebasePlugin.verifyPhoneNumber('+91' + this.phoneNumber,60,(credentials)=>{
        this.otpStatus = 4;
        console.log('inside verify phone number');
        this.logs.addLog("Firebase Auth : "+credentials);
        console.log(credentials);
        this.phoneNumberInput.disabled = false;
        this.verificationId = credentials.verificationId;
        //common stuff
        this.message='OTP sent successfully';
      },(error)=>{
        this.otpStatus = 4;
        this.phoneNumberInput.disabled = false;
        this.message = error;
        this.logs.addLog("Error : "+error);
        console.log(error);
      });
    }catch(err){
     this.otpStatus = 4;
     this.phoneNumberInput.disabled = false;
     console.log(err);
     this.message = err;
    }
  }
  sendOTP(){
    console.log('OTP SEND to : '+this.phoneNumber);
    try{
      this.phoneNumberInput.disabled = true;
      (<any>window).FirebasePlugin.verifyPhoneNumber('+91' + this.phoneNumber,60,(credentials)=>{
       this.otpStatus = 4;
        console.log('inside verify phone number');
        this.logs.addLog("Firebase Auth : "+credentials);
        console.log(credentials);
        this.phoneNumberInput.disabled = false;
        this.verificationId = credentials.verificationId;
        //common stuff
        
        this.message=null;
      },(error)=>{
        this.otpStatus = 3;
        this.phoneNumberInput.disabled = false;
        this.message = error;
        this.logs.addLog("Error : "+error);
        console.log(error);
      });
    }catch(err){
      this.otpStatus = 3;
      this.phoneNumberInput.disabled = false;
      console.log(err);
      this.message = err;
    }
    console.log('outside verify phone number');
    
  }

  verifyOTP(){
    try{
      let signInCredential = firebase.auth.PhoneAuthProvider.credential(this.verificationId,this.code);
      firebase.auth().signInWithCredential(signInCredential).then((info)=>{
        console.log(info);
        this.otpStatus = 6;
        this.logs.addLog(""+info);
        this.message = 'Successfully verified OTP';
       
        this.viewCtrl.dismiss(this.phoneNumber);
      },(error)=>{
        this.message = 'Wrong OTP';
        this.otpStatus = 7;
        this.logs.addLog(error);
      });
    }catch(err){
      this.otpStatus = 7;
      this.message = err;
      console.log(err);
    }
  }

  checkNumberInDatabase(){
    let userPostData:any = {
      phone_number : this.phoneNumber,
    }
    if(this.navParams.get('wantUserToExists')==undefined){
      this.otpStatus = 2;
      this.sendOTP();
      return;
    }
    this.phoneNumberInput.disabled = true;
    this.networkEngine.post(userPostData,'check-phone-number-exists').then( (result:any) => {
      this.phoneNumberInput.disabled = false;
      if(result.code ==786){
        this.isPhoneNumberExists = true;
      }else{
        this.isPhoneNumberExists = false;
      }
      console.log("Want user to exists : " + this.navParams.get('wantUserToExists'));
      if(this.navParams.get('wantUserToExists') == this.isPhoneNumberExists){
        this.otpStatus = 2;
        this.sendOTP();
      }else{
        this.otpStatus = 0;
        if(this.navParams.get('wantUserToExists')!=undefined){
          if(this.isPhoneNumberExists){
            this.message = 'This number is already registered';
          }else{
            this.message = 'Sorry! This number is not registered with us';
          }
        }
      }
    }, error => {
      this.otpStatus = 0;
      console.log(error);
      this.phoneNumberInput.disabled = false;
    }).catch(error => {
      console.log(error);
      this.phoneNumberInput.disabled = false;
      this.otpStatus = 0;
    });
  }

  //remove this method in production mode
  verifyWithoutOtp(){
    this.viewCtrl.dismiss(this.phoneNumber);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OtpValidationPage');
    this.message = null;
    this.canEditPhoneNumber = true;
    if(this.navParams.get('phone')){
      this.phoneNumber = this.navParams.get('phone');
      this.canEditPhoneNumber = false;
      this.validatePhoneNumber();
    }
  }

  editPhoneNumber(){
    this.message = null;
    this.otpStatus = 0;
  }


}
