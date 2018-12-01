import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController, Events, ModalController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { WelcomePage } from '../pages/welcome/welcome';
import { MainTabsPage } from '../pages/main-tabs/main-tabs';
import { UserDataProvider } from '../providers/user-data/user-data';
import { TutorialsPage } from '../pages/tutorials/tutorials';
import { CameraPage } from '../pages/camera/camera';
import { LoginPage } from '../pages/login/login';
import { AccountPage } from '../pages/account/account';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { LogsServiceProvider } from '../providers/logs-service/logs-service';
import { DeveloperPage } from '../pages/developer/developer';
import { RequestsPage } from '../pages/requests/requests';
import { PostedProductsPage } from '../pages/posted-products/posted-products';
import { RegistrationPage } from '../pages/registration/registration';
import { MessagingPage } from '../pages/messaging/messaging';
import { AboutPage } from '../pages/about/about';
import { User } from '../interfaces/user';


export interface PageInterface {
  title: string;
  name?: string;
  component: any;
  icon?: string;
  image_icon?:string,
  logsOut?: boolean;
  index?: number;
  tabName?: string;
  tabComponent?: any;
  setRoot?:boolean;
  badge?:string;
}

@Component({
  templateUrl: 'app.html'
})

export class Xibay {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  //login pages
  appPagesLogIn:PageInterface[]=[
    {title:'Home',name:'MainTabsPage',component:MainTabsPage,icon:"ios-home-outline",setRoot:true},
    {title: 'Requests' , name:'RequestsPage',component:RequestsPage,icon:'ios-chatbubbles-outline',badge:'1.8K'},
    {title: 'Posted Products' , name:'PostedProductsPage',component:PostedProductsPage,icon:'ios-cloud-done-outline',badge:'120'}
  ];

  loggedInPages:PageInterface[] = [
    {title:'User Info',name:'AccountPage',component:AccountPage,icon:'ios-contact-outline'},
    {title:'Logout',name:'LoginPage',component:LoginPage,icon:'ios-log-out-outline',logsOut:true},
    {title:'Notification',name:'NotificationsPage',component:'NotificationsPage',icon:'ios-notifications-outline'}
  ];

  //logout pages
  appPagesLogOut:PageInterface[]=[
    {title:'Welcome',name:'WelcomePage',component:WelcomePage,icon:"ios-home-outline",setRoot:true}
  ];

  loggedOutPages:PageInterface[] = [
    {title:'Login',name:'LoginPage',component:LoginPage,icon:'ios-log-in-outline'},
    {title:'Sign Up',component:RegistrationPage,name:'RegistrationPage',icon:'ios-clipboard-outline'},
    {title:'Support',name:'CameraPage',component:CameraPage,icon:'ios-redo-outline'}
  ];

  permanentPages:PageInterface[] = [
    {title:'Tutorials',name:'TutorialsPage',component:TutorialsPage,icon:'ios-photos-outline'},
    {title:'FAQ ?',name:'faq',component:TutorialsPage,icon:'ios-help-circle-outline'},
    {title:'Message to developer',name:'MessagingPage',component:MessagingPage,icon:'ios-chatbubbles-outline'},
    {title:'Terms & Policies',name:'termsAndPolicies',component:TutorialsPage,icon:'ios-copy-outline'},
    {title:'About',name:'AboutPage',component:AboutPage,image_icon:'assets/imgs/logo.png'},
    {title:'Developer',name:'DeveloperPage',component:DeveloperPage,icon:'ios-construct-outline'}
  ];

  public user:User;
  classReference:any = UserDataProvider;
  
  constructor(
    public userData:UserDataProvider,
    public platform: Platform, 
    private storage:Storage,
    public menu:MenuController,
    public events:Events,
    private logs:LogsServiceProvider,
    private push: Push,
    private alertCtrl:AlertController,
    private modalCtrl:ModalController,
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen) {

      this.userData.checkHasSeenTutorial().then((hasSeenTutorial) => {
        if (hasSeenTutorial) {
          this.userData.hasLoggedIn().then((hasLoggedIn) => {
            this.enableMenu(hasLoggedIn === true);
            console.log('App Component : ' + hasLoggedIn);
            if(hasLoggedIn){
              // this line will run only single time when app loaded so we get user data from storage at this time
              this.storage.get(this.userData.USER_DATA).then((userData:User) => {
                UserDataProvider.userPostData = userData;
                this.user = userData;
                console.log(UserDataProvider.userPostData);
                this.rootPage = MainTabsPage;
              });
            }else{
              this.rootPage = WelcomePage;
            }
            this.platformReady();
          });
        } else {
          this.rootPage = TutorialsPage;
          this.platformReady();
        }
      });
      this.listenToLoginEvents();
      this.classReference = UserDataProvider;
  }

  pushSetup(){
    this.logs.addLog('inside setup push');
    const options: PushOptions = {
      android: {
        senderID: '572154572093'
      },
      ios: {
          alert: 'true',
          badge: true,
          sound: 'false'
      }
   };
   
   const pushObject: PushObject = this.push.init(options);
  
   pushObject.on('notification').subscribe((notification: any) => {
      console.log('Received a notification', notification);
      this.logs.addLog('Received a notification'+notification);
  },(error)=> {
    this.logs.addLog("Notification Error : "+error);
    console.log("Notification error : "+error);
  });
   
   pushObject.on('registration').subscribe((registration: any) => {
    console.log('Device registered', registration);
    this.logs.addLog('device registered : '+JSON.stringify(registration));
    var registrationToken:String = registration.registrationId;
     this.storage.set('FCM_TOKEN',registrationToken);
     this.storage.get('FCM_TOKEN').then((token:String)=>{
       this.logs.addLog("Get from storage : "+ token);
  
     });    
     this.logs.addLog('2nd : '+registration.registrationId);
    });
   
    pushObject.on('error').subscribe(error => {
      console.error('Error with Push plugin', error);
      this.logs.addLog('Error with push plugins');
    });
  }

  openPage(page: PageInterface) {
    if(page.logsOut){
      this.nav.setRoot(WelcomePage,{},{animate:false});
      this.nav.popToRoot({animation:'ios-transition'});
      this.userData.logout();
      return;
    }
    if(page.title === 'Sign Up'){
      this.signUp();
      return;
    }
    if(this.nav.getActive().name != page.name){
      if(page.setRoot){
        this.nav.setRoot(page.component);
        this.nav.popToRoot({animate:false});
      }else{
        this.nav.push(page.component);
        if(this.nav.getActive().index == -1 || this.nav.getActive().index == 1){
          this.nav.remove(1);
        }
      }
    }   
  }

  signUp(){
    //load terms and conditions if they accepted then load otp validation and then signup page
    let tc_modal = this.modalCtrl.create('TermsAndConditionPage');
    tc_modal.onDidDismiss(value => {
      if(value==true){
        let otp_modal = this.modalCtrl.create('OtpValidationPage',{wantUserToExists:false});
        otp_modal.onDidDismiss(phoneNumber => {
          console.log('user verified through OTP : ' + phoneNumber);
          if(phoneNumber){
            this.nav.push(RegistrationPage,{phone:phoneNumber});
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

  enableMenu(loggedIn: boolean) {
    this.menu.enable(loggedIn, 'loggedInMenu');
    this.menu.enable(!loggedIn, 'loggedOutMenu');
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

  listenToLoginEvents() {
    this.logs.addLog('Listening to Login Events...');
    this.events.subscribe('user:login', () => {
      console.log("Event publish user login");
      this.enableMenu(true);
      this.user = UserDataProvider.userPostData;
    });

    this.events.subscribe('user:signup', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:logout', () => {
      console.log("Event publish user logout");
      this.enableMenu(false);
      this.rootPage = WelcomePage;
    });
  }

  isActive(page: PageInterface) {
    if(this.nav.getActive() && this.nav.getActive().name===page.name){
      return 'primary';
    }
    return;
  }

  platformReady() {
    this.platform.ready().then(() => {
      this.logs.addLog('platform is ready');
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.pushSetup();
    });
  }
}