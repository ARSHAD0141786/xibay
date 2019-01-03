import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { LogsServiceProvider } from '../../providers/logs-service/logs-service';
import { NetworkEngineProvider } from '../../providers/network-engine/network-engine';
import { NotifyProvider } from '../../providers/notify/notify';
import { MainTabsPage } from '../main-tabs/main-tabs';
import { RegistrationPage } from '../registration/registration';
import { NgForm } from '@angular/forms';
import { UserDataProvider } from '../../providers/user-data/user-data';
import { NetworkUrls } from '../../providers/network-engine/networkUrls';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  responseData: any;
  passwordType:string;
  eyeIcon:string;
  
  loginOptions = {
    username:'',
    password:''
  };
  submitted = false;

  constructor(
    public navCtrl: NavController,
    private userData: UserDataProvider,
    public navParams: NavParams,
    private networkEngine: NetworkEngineProvider,
    private notify: NotifyProvider,
    private modalCtrl: ModalController,
    private logs: LogsServiceProvider) {
  }

  changeType(){
    if(this.passwordType == 'password'){
      this.passwordType = 'text';
      this.eyeIcon = 'ios-eye-off';
    }else{
      this.passwordType = 'password';
      this.eyeIcon = 'ios-eye';
    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.logs.addLog('ionViewDidLoad LoginPage');
    this.passwordType = 'password';
    this.eyeIcon = 'ios-eye';
  }

  onLogin(form: NgForm) {
    this.submitted = true;
    if (form.valid) {
      this.notify.presentLoading("Please wait...");
      this.logs.addLog(JSON.stringify(this.loginOptions));
      this.networkEngine.post(this.loginOptions, NetworkUrls.LOGIN).then((result:any) => {
        this.notify.closeLoading();
        this.responseData = result;
        if (this.responseData.user_data) {
          this.userData.login(this.responseData);
          // here update fmc token because you cannot update it before login
          if(UserDataProvider.fcmToken && UserDataProvider.userPostData && UserDataProvider.userPostData.username && UserDataProvider.userPostData.token){
            let userPostData:any = {
              username:UserDataProvider.userPostData.username,
              token:UserDataProvider.userPostData.token,
              fcmToken:UserDataProvider.fcmToken,
            }
            this.networkEngine.post(userPostData,NetworkUrls.UPDATE_FCM);
            this.networkEngine.notificationInit();
          }
          this.navCtrl.setRoot(MainTabsPage);
        }
        else {
          this.notify.presentToast("Something went wrong(See console for error)");
        }
      }, (err) => {
        //Connection failed message
        this.notify.closeLoading();
        console.log(err.status);
        if(err.status != 0){
          this.responseData = JSON.parse(err._body);
        }else if(err.status == 0){
          this.notify.presentToast('No Internet conection');
          return;
        }else{
          this.responseData = err;
        }
        console.log(this.responseData);
        if(this.responseData.Error){
          if(this.responseData.code){
            this.notify.presentToast(this.responseData.Error);
          }else{
            this.notify.presentToast('No connection');
          }
        }else{
          this.notify.presentToast('Something went wrong');
        }
      });
    }
    else {
      this.notify.presentToast("Give correct username/password");
    }
  }

  onSignUp(){
    //load terms and conditions if they accepted then load otp validation and then signup page
    let tc_modal = this.modalCtrl.create('TermsAndConditionPage');
    tc_modal.onDidDismiss(value => {
      if(value==true){
        let otp_modal = this.modalCtrl.create('OtpValidationPage',{wantUserToExists:false});
        otp_modal.onDidDismiss(phoneNumber => {
          console.log('user verified through OTP : ' + phoneNumber);
          if(phoneNumber){
            this.navCtrl.push(RegistrationPage,{phone:phoneNumber});
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

  forgotCredentials(){
    console.log('forgot credentials tapped....')
    let otp_modal = this.modalCtrl.create('OtpValidationPage',{wantUserToExists:true});
    otp_modal.onDidDismiss(phoneNumber => {
      console.log('OTP Verified : ' + phoneNumber);
      if(phoneNumber){
        //load forgotcredential modal
        let forgot_credential_modal = this.modalCtrl.create('ForgotCredentialsPage',{phone:phoneNumber});
        forgot_credential_modal.present();
      }
    });
    otp_modal.present();
  }

}
