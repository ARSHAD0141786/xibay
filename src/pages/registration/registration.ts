import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NetworkEngineProvider } from '../../providers/network-engine/network-engine';
import { LogsServiceProvider } from '../../providers/logs-service/logs-service';
import { NotifyProvider } from '../../providers/notify/notify';
import { NgForm } from '@angular/forms';
import { Storage } from '@ionic/storage';

// import { WelcomePage } from '../welcome/welcome';

@IonicPage()
@Component({
  selector: 'page-registration',
  templateUrl: 'registration.html',
})
export class RegistrationPage {

  // these are dynamic arrays which will fill at runtime from database
  years: any;
  branches: any;

  defaultFormData  = {
    "name":"Mohammed Arshad",
    "username":"arshad0141786",
    "password":"arshad01",
    "phone_number":"8441975563",
    "gender":"M",
    "branch":"4",
    "year":"3"
  };

  signupOptions:any = {
    username:'',
    name:'',
    // phone_number come from OTP activity
    phone_number:'8441975563',
    password:'',
    gender:'',
    branch:'',
    year:'',
    FMC_TOKEN:''
  };

  submitted=false;

  responseData:any;
  
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public networkEngine: NetworkEngineProvider,
    private notify: NotifyProvider,
    private storage: Storage,
    private logs: LogsServiceProvider) {
      this.notify.presentLoading("Please wait...");
      this.networkEngine.get('get-year-category-branch').then((result:string) =>{
        let data = JSON.parse(result);
        this.notify.closeLoading();
        if(data._body){
          this.storage.get('FCM_TOKEN').then((FCM_TOKEN:String)=>{
            this.signupOptions.FCM_TOKEN = FCM_TOKEN;
          });
          let response = JSON.parse(data._body);
          if(response.branch){
            this.branches = response.branch;
          }
          console.log(this.branches);
          if(response.year){
            this.years = response.year;
          }
          console.log(this.years);
        }
      },
      (err:any)=>{
        this.notify.closeLoading();
        console.log(err);
      });
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
      this.networkEngine.post(this.signupOptions, "create-user-for-xibay").then((result:string) => {
        this.responseData = JSON.parse(JSON.parse(result)._body);
        this.logs.addLog("Response :"+JSON.stringify(this.responseData));
        console.log(this.responseData);
        if (this.responseData.User) {
          this.notify.presentToast("User registered successfully");
          this.navCtrl.pop();
        }
        else {
          this.notify.presentToast("Please give valid username and password");
        }
      }, (err:any) => {
        //Connection failed message
        console.log(err.status);
        if(err.status != 0){
          this.responseData = JSON.parse(err._body);
        }else{
          this.responseData = err;
        }
        console.log(this.responseData);
        if(this.responseData.Error){
          let error = this.responseData.Error.split(':')[0].split('[')[1].split(']')[0];
          console.log(error);
          if(error == '23000'){
            let field = this.responseData.Error.split('key ')[1];
            console.log(field);
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


  registerUser(value: any){
    // this.logs.addLog("Register user : "+JSON.stringify(this.defaultFormData));
    // this.logs.addLog("Register user : "+JSON.stringify(value));
    // //this.networkEngine.post('/create-user-for-xibay',this.defaultFormData)
    // this.networkEngine.post('/create-user-for-xibay',value)
    // .subscribe(
    //   (data:any) => { this.logs.addLog("Response : "+ JSON.stringify(data))},
    //   (err:any) => { this.logs.addLog("ERROR : " + JSON.stringify(err))},
    //   () => { this.logs.addLog("User registered successfully.")}
    // );
    // this.networkEngine.createUser(this.defaultFormData)
    // .subscribe( (data:any) => {
    //   this.logs.addLog("Response : "+data);
    //   // console.log(data);
    // },
    // (err?:any) => console.log("Error Loging In:" + JSON.stringify(err._body)),
    // () => { console.log("error") }
    // );

      this.notify.presentLoading("Please wait...");
      this.logs.addLog(JSON.stringify(value));
      this.networkEngine.post(value, "create-user-for-xibay").then((result:string) => {
        this.responseData = JSON.parse(JSON.parse(result)._body);
        this.logs.addLog("Response :"+JSON.stringify(this.responseData));
        console.log(this.responseData);
        if (this.responseData.User) {
          this.notify.presentToast("User registered successfully");
          this.navCtrl.pop();
        }
        else {
          this.notify.presentToast("Please give valid username and password");
        }
      }, (err:any) => {
        //Connection failed message
        console.log(err.status);
        if(err.status != 0){
          this.responseData = JSON.parse(err._body);
        }else{
          this.responseData = err;
        }
        console.log(this.responseData);
        if(this.responseData.Error){
          let error = this.responseData.Error.split(':')[0].split('[')[1].split(']')[0];
          let field = this.responseData.Error.split('key ')[1];
          console.log(field);
          if(error == '23000'){
            this.notify.presentToast(field + " already registered");    
          }else if(error == ''){
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
