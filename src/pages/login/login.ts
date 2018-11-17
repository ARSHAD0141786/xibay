import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { LogsServiceProvider } from '../../providers/logs-service/logs-service';
import { NetworkEngineProvider } from '../../providers/network-engine/network-engine';
import { NotifyProvider } from '../../providers/notify/notify';
import { MainTabsPage } from '../main-tabs/main-tabs';
import { RegistrationPage } from '../registration/registration';
import { NgForm } from '@angular/forms';
import { UserDataProvider } from '../../providers/user-data/user-data';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  responseData: any;
  
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.logs.addLog('ionViewDidLoad LoginPage');
  }

  onLogin(form: NgForm) {
    this.submitted = true;
    if (form.valid) {
      this.notify.presentLoading("Please wait...");
      this.logs.addLog(JSON.stringify(this.loginOptions));
      this.networkEngine.post(this.loginOptions, "login-for-xibay").then((result:string) => {
        this.notify.closeLoading();
        this.responseData = JSON.parse(JSON.parse(result)._body);
        console.log(this.responseData);
        if (this.responseData.user_data) {
          this.userData.login(this.responseData);
          // this.notify.presentToast('Login success');
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
    this.navCtrl.push(RegistrationPage);
  }

  forgotCredentials(){
    let otp_modal = this.modalCtrl.create('OtpValidationPage');
    otp_modal.onDidDismiss(isVerified => {
      console.log('OTP Verified : ' + isVerified);
      if(isVerified==true){
        //load forgotcredential modal
      }
      otp_modal.present();
    });
  }

}
