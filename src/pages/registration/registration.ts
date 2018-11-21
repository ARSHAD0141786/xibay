import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NetworkEngineProvider } from '../../providers/network-engine/network-engine';
import { LogsServiceProvider } from '../../providers/logs-service/logs-service';
import { NotifyProvider } from '../../providers/notify/notify';
import { NgForm } from '@angular/forms';

// import { WelcomePage } from '../welcome/welcome';

@IonicPage()
@Component({
  selector: 'page-registration',
  templateUrl: 'registration.html',
})
export class RegistrationPage {

  // these are dynamic arrays which will fill at runtime from database
  years: any;
  branches: any = [
    'ARC',
    'CH',
    'CIV',
    'CSE',
    'EE',
    'ECC',
    'ECE',
    'EEE',
    'IT',
    'ME',
    'MI',
    'P&I'
  ];

  isUsernameExists:boolean = false;

  signupOptions:any = {
    username:'',
    name:'',
    // phone_number come from OTP activity
    phone_number:'',
    password:'',
    gender:'',
    branch:'',
    year:'',
    FMC_TOKEN:''
  };

  submitted=false;
  
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public networkEngine: NetworkEngineProvider,
    private notify: NotifyProvider,
    private logs: LogsServiceProvider) {
      this.signupOptions.phone_number = this.navParams.get('phone');
      console.log('phone number : ' + this.signupOptions.phone_number);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegistrationPage');
  }

  onSignup(form: NgForm) {
    this.submitted = true;
    if (form.valid) {
      // this.userData.signup(form);
      // console.log(this.signupOptions);
      // this.userData.signup(this.signupOptions);

      this.notify.presentLoading("Please wait...");
      this.logs.addLog(JSON.stringify(this.signupOptions));
      let responseData:any;
      this.networkEngine.post(this.signupOptions, "create-user-for-xibay").then((result:any) => {
        responseData = result;
        this.logs.addLog("Response :"+JSON.stringify(responseData));
        console.log(responseData);
        if (responseData.User) {
          this.notify.presentToast("We welcome you");
          this.navCtrl.pop();
        }
        else {
          this.notify.presentToast("Please give valid username and password");
        }
      }, (err:any) => {
        //Connection failed message
        console.log(err.status);
        if(err.status != 0){
          responseData = JSON.parse(err._body);
        }else{
          responseData = err;
        }
        console.log(responseData);
        if(responseData.Error){
          let error = responseData.Error.split(':')[0].split('[')[1].split(']')[0];
          console.log(error);
          if(error == '23000'){
            let field = responseData.Error.split('key ')[1];
            console.log(field);
            if(field == "username"){
              this.isUsernameExists = true;
            }
            
            this.notify.presentToast(field + " already registered");    
          }else if(error == 'HY000'){
            this.notify.presentToast("General error");
          }else if(error == ''){
          }else if(error == ''){
          }else if(error == ''){

          }else{
            this.notify.presentToast("Connection failed");
          }
        }else{
          this.notify.presentToast("Connection failed");
        }
        this.notify.closeLoading();
        // this.notify.presentToast("Connection failed");
        // this.logs.addLog("Error : " + JSON.stringify(this.responseData));
      });
      
    }
  }
}
