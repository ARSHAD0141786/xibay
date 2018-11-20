import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { WelcomePage } from '../pages/welcome/welcome';
import { MainTabsPage } from '../pages/main-tabs/main-tabs';
import { UserDataProvider } from '../providers/user-data/user-data';
import { TutorialsPage } from '../pages/tutorials/tutorials';
import { CameraPage } from '../pages/camera/camera';
import { LoginPage } from '../pages/login/login';
import { RegistrationPage } from '../pages/registration/registration';
import { AccountPage } from '../pages/account/account';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { DebugLogsPage } from '../pages/debug-logs/debug-logs';
import { LogsServiceProvider } from '../providers/logs-service/logs-service';
import { OtpValidationPage } from '../pages/otp-validation/otp-validation';
import { DeveloperPage } from '../pages/developer/developer';
import { RequestsPage } from '../pages/requests/requests';
import { PostedProductsPage } from '../pages/posted-products/posted-products';
import { PostProductPage } from '../pages/post-product/post-product';


export interface PageInterface {
  title: string;
  name: string;
  component: any;
  icon: string;
  logsOut?: boolean;
  index?: number;
  tabName?: string;
  tabComponent?: any;
}

@Component({
  templateUrl: 'app.html'
})

export class Xibay {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  appPagesLogIn:PageInterface[]=[
    {title:'Home',name:'home',component:MainTabsPage,icon:"home"},
    {title:'Papers',name:'papers',component:CameraPage,icon:'paper'},
    {title: 'Requests' , name:'total_requests_from_others',component:RequestsPage,icon:'md-chatbubbles'},
    {title: 'Posted Products' , name:'users_posted_product',component:PostedProductsPage,icon:'md-cloud-done'}
  ];

  appPagesLogOut:PageInterface[]=[
    {title:'Welcome',name:'home',component:WelcomePage,icon:"home"},
    {title:'Camera',name:'papers',component:CameraPage,icon:'paper'}
  ];

  loggedOutPages:PageInterface[] = [
    {title:'Login',name:'login',component:LoginPage,icon:'log-in'},
    {title:'Signup',name:'signup',component:RegistrationPage,icon:'redo'}
  ];

  loggedInPages:PageInterface[] = [
    {title:'User Info',name:'user_info',component:AccountPage,icon:'contact'},
    {title:'Logout',name:'logout',component:LoginPage,icon:'log-out',logsOut:true},
    {title:'Support',name:'support',component:CameraPage,icon:'redo'}
  ];

  constructor(
    private userData:UserDataProvider,
    public platform: Platform, 
    private storage:Storage,
    public menu:MenuController,
    public events:Events,
    private logs:LogsServiceProvider,
    private push: Push,
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen) {
      this.logs.addLog('Inside app.component constructor');

      this.storage.get('hasSeenTutorial')
      .then((hasSeenTutorial) => {
        if (hasSeenTutorial) {
          this.logs.addLog('user has seen tutorials');
          this.userData.hasLoggedIn().then((hasLoggedIn) => {
            this.enableMenu(hasLoggedIn === true);
            console.log(hasLoggedIn);
            if(hasLoggedIn){
              
              this.rootPage = MainTabsPage;
              this.storage.get('username').then((value:string)=>{
                this.logs.addLog('user is logged in with username : '+value);
                // this.network.authentication.username = value;
                this.storage.get('token').then((value:string)=>{
                  this.logs.addLog('and token : '+value);
                  // this.network.authentication.token = value;
                  this.platformReady();
                });
              });
            }else{
              this.logs.addLog('user not logged in');
              this.rootPage = WelcomePage;
              this.platformReady();
            }
          });
        } else {
          this.logs.addLog('user not seen tutorials');
          this.rootPage = TutorialsPage;
          this.platformReady();
        }
      });

      this.listenToLoginEvents();

      
      

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
   
   pushObject.on('error').subscribe(error => {console.error('Error with Push plugin', error);
  this.logs.addLog('Error with push plugins');});
  }

  openPage(page: PageInterface) {
    // let params = {};

    // the nav component was found using @ViewChild(Nav)
    // setRoot on the nav to remove previous pages and only have this page
    // we wouldn't want the back button to show in this scenario
    // if (page.index) {
    //   params = { tabIndex: page.index };
    // }

    // If we are already on tabs just change the selected tab
    // don't setRoot again, this maintains the history stack of the
    // tabs even if changing them from the menu
    // if (this.nav.getActiveChildNavs().length && page.index != undefined) {
    //   this.nav.getActiveChildNavs()[0].select(page.index);
    // } else {
    //   // Set the root of the nav with params if it's a tab index
    //   this.nav.setRoot(page.name, params).catch((err: any) => {
    //     console.log(`Didn't set nav root: ${err}`);
    //   });
    // }


    this.nav.push(page.component);

    if (page.logsOut === true) {
      // Give the menu time to close before changing to logged out
      this.userData.logout();
      this.nav.setRoot(WelcomePage);
    }
  }


  openTutorial() {
    this.nav.push(TutorialsPage);
  }

  openLogs(){
    this.nav.push(DeveloperPage);
  }
  enableMenu(loggedIn: boolean) {
    this.menu.enable(loggedIn, 'loggedInMenu');
    this.menu.enable(!loggedIn, 'loggedOutMenu');
  }


  listenToLoginEvents() {
    this.logs.addLog('Listening to Login Events...');
    this.events.subscribe('user:login', () => {
      console.log("Event publish user login");
      this.enableMenu(true);
    });

    this.events.subscribe('user:signup', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:logout', () => {
      console.log("Event publish user logout");
      this.enableMenu(false);
    });
  }

  isActive(page: PageInterface) {
    // let childNav = this.nav.getActiveChildNavs()[0];

    // Tabs are a special case because they have their own navigation
    // if (childNav) {
    //   if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {
    //     return 'primary';
    //   }
    //   return;
    // }

    if (this.nav.getActive() && this.nav.getActive().name === page.name) {
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