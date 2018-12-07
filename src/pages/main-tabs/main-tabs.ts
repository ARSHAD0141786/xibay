import { Component, ViewChild } from '@angular/core';
import { NotifyProvider } from '../../providers/notify/notify';
import { NavController, PopoverController, Refresher, Content, NavParams } from 'ionic-angular';
import { UserDataProvider } from '../../providers/user-data/user-data';
import { NetworkEngineProvider } from '../../providers/network-engine/network-engine';
import { DescriptionPage } from '../description/description';
import { LogsServiceProvider } from '../../providers/logs-service/logs-service';
import { PostProductPage } from '../post-product/post-product';
import { item } from '../../interfaces/posted_item';
// import { CameraOptions,Camera } from '@ionic-native/camera';

@Component({
  templateUrl: 'main-tabs.html',
})
export class MainTabsPage {

  @ViewChild(Content) content:Content;
  public noRecords: boolean;
  public base64Image: string;
  public static categories:Array<boolean> = [false,false,false,false,false];
  public items:Array<item> = [];

  networkConnected:boolean;
  refresher: Refresher;
  queryText:string;
  segment:string = 'all';
  searchList:Array<any>;
  public refresher_is_present: boolean = false;
  lastCreated:number = 0;
  
  constructor(
    private notify: NotifyProvider,
    private navCtrl: NavController,
    private userData: UserDataProvider,
    private network: NetworkEngineProvider,
    private logs: LogsServiceProvider,
    public popoverCtrl: PopoverController) {

      
    this.noRecords = false;  
    this.fetchMainContent().catch( err => {
      console.log(err);
    });
      
    
  }

  convertTime(time) {
    let date = new Date(time * 1000);
    return date;
  }

  ofCategory(id){
    switch(id){
      case '1':return 'ios-book-outline';//books
      case '2':return 'ios-paper-outline';//papers
      case '3':return 'ios-construct-outline';//Accssories
      case '4':return 'ios-list-box-outline';//notes
      case '5':return 'ios-filing-outline';//others
    }
    return 'ios-help-circle-outline';
  }
 

  isUseful(useful_branch:string,useful_year:string){
    let use_ful_branch:any = JSON.parse(useful_branch.toString());
    let use_ful_year:any = JSON.parse(useful_year.toString());
    if(!UserDataProvider.userPostData) return;
    try{
      let user_branch = UserDataProvider.userPostData.branch_name;
      let user_year = UserDataProvider.userPostData.year_name;
      for(let year of use_ful_year){
        if(year === user_year){
          for(let branch of use_ful_branch){
            if(branch === user_branch){
              return true;
            }
          }
        }
      }
      return false;
    }catch(err){
      console.log(err);
      return false;
    }
  }
  
  changeTab(){//value of tab is changed by ngModel in html file
    this.lastCreated = 0;
    this.noRecords = false;
    this.fetchMainContent().catch(error =>{
      console.log(error);
      this.networkConnected = false;
    });
  }

  fetchMainContent(): Promise<any> { //this function is called from infinite loading , in constructor , when filter change
    return new Promise((resolve,reject) => {
        console.log("Start fetching more data : " + this.lastCreated);
        if(this.queryText && this.queryText.length > 0){
          console.log('Setting no more records true');
          this.noRecords = true;
          reject();
        }
        let api:string;
        switch(this.segment){
          case 'all':api = 'fetch-main-content';break;
          case 'useful':api='fetch-useful-main-content';break;
        }
        let userPostData:any = {
          username: UserDataProvider.userPostData.username,
          token:UserDataProvider.userPostData.token,
          branch:UserDataProvider.userPostData.branch_name,
          year:UserDataProvider.userPostData.year_name,
          lastCreated:this.lastCreated,
          filter:MainTabsPage.categories,
        }
        if(this.lastCreated == 0 && this.refresher_is_present==false){
          this.notify.presentWaiting();
        }
        this.network.post(userPostData,api).then((result: any) => {
          this.networkConnected = true;
          this.notify.closeWaiting();
          if (this.refresher_is_present) {
            this.refresher.complete();
            this.refresher_is_present = false;
          }
          if(this.lastCreated == 0){
            this.items = [];
          }
          if (result.data.length > 0) {
            for (let entry of result.data) {
              this.items.push(entry);
            }
            this.lastCreated = result.data[result.data.length - 1].created;
            resolve();
          } else {
            this.noRecords = true;
            console.log("No more records.");
            resolve();
          }
        }, (err) => {
          console.log(err);
          this.notify.closeWaiting();
          if(this.items.length == 0){
            this.networkConnected = false;
          }
          reject(err);
        }).catch( error => {
          this.notify.closeWaiting();
          console.log(error);
        });
    });
  }

  
  filterPopoverCallBackFunction = function(reference:any){//this function will be called from filter popover page
    reference.lastCreated = 0;
    reference.noRecords = false;
    reference.fetchMainContent().catch( error => {
      console.log(error);
    });
  }

  doRefresh(refresher: Refresher) {
    this.queryText = '';
    this.searchList = [];
    this.lastCreated = 0;
    this.noRecords = false;
    this.refresher_is_present = true;
    this.refresher = refresher;
    this.fetchMainContent().catch( error =>{
      console.log(error);
      this.refresher.complete();
      this.refresher_is_present = false;
      if(this.items.length == 0){
        this.networkConnected = false;
      }
      
    });
  }

  // showPopOver(){
  //   let popover = this.popoverCtrl.create(MyPopOverPage);
  //   popover.present();
  // }

  ngOnInit() {
    this.items = [];
  }

  // clearLocalStorage() {
  //   this.logs.addLog('clear local storage');
  //   localStorage.clear();
  //   this.notify.presentLoading("Logging out...");
  //   setTimeout(() => this.logout(), 1000);
  // }

  logout() {
    this.logs.addLog('Logging out...');
    this.notify.closeLoading();
    this.userData.logout();
    this.logs.addLog('Setting root page to Welcome page');
    /* import App from ionic angular 
    declare public app: App in constructor
    const root:  this.app.getRootNav();
    root.popToRoot(); */
  }

  showDescription(item:item) {
    this.queryText = '';
    this.searchList = [];
    this.navCtrl.push(DescriptionPage,{item : item});
  }

  gotoSecondaryPage() {
    this.queryText = '';
    this.searchList = [];
    this.navCtrl.push(PostProductPage);
  }

  findItem(query:string){//this will call when user tap on search result
    this.queryText = query;
    this.searchList = [];
    let userPostData:any = {
      username:this.userData.getUserPostData().username,
      token:this.userData.getUserPostData().token,
      query:query
    }
    this.notify.presentLoading('Searching...');
    this.network.post(userPostData,'fetch-particular-product').then( (result:any) => {
      this.items = result.data;
      this.notify.closeLoading();
    },err => {
      console.log(err);
      this.notify.closeLoading();
    });
  }

  searchQuery(){//this will call when user writes somthing in searchbox
    let userPostData:any = {
      username:this.userData.getUserPostData().username,
      token:this.userData.getUserPostData().token,
      query:this.queryText
    }
    if(this.queryText.length > 0){
      this.network.post(userPostData,'search-a-product').then( (result:any) => {
        console.log(result.data);
        this.searchList = result.data;
      }, error => {
        console.log(error);
      });
    }else{
      this.searchList = [];
    }
  }

  presentFilter(event:any){
    let filter = this.popoverCtrl.create(Filter,{callBackFunction:this.filterPopoverCallBackFunction,objectReference:this});
    filter.present({
      ev:event
    });
  }
}

@Component({
  templateUrl:'filterpopover.html'
})
export class Filter{
  classReference:any = MainTabsPage;
  callBackFunction:any;
  objectReference:any;
  constructor(private navParams:NavParams){
    this.classReference = MainTabsPage;
    this.callBackFunction = navParams.get('callBackFunction');
    this.objectReference = navParams.get('objectReference');
  }
  callBack(){
    this.callBackFunction(this.objectReference);
  }
}

/* @Component({
  template: `<!--
  <ion-list radio-group [(ngModel)]="fontFamily" (ionChange)="changeFontFamily()" class="popover-page">
    <ion-row>
      <ion-col>
        <button (click)="changeFontSize('smaller')" ion-item detail-none class="text-button text-smaller">A</button>
      </ion-col>
      <ion-col>
        <button (click)="changeFontSize('larger')" ion-item detail-none class="text-button text-larger">A</button>
      </ion-col>
    </ion-row>
    <ion-row class="row-dots">
      <ion-col>
        <button ion-button="dot" (click)="changeBackground('white')" class="dot-white" [class.selected]="background == 'white'"></button>
      </ion-col>
      <ion-col>
        <button ion-button="dot" (click)="changeBackground('tan')" class="dot-tan" [class.selected]="background == 'tan'"></button>
      </ion-col>
      <ion-col>
        <button ion-button="dot" (click)="changeBackground('grey')" class="dot-grey" [class.selected]="background == 'grey'"></button>
      </ion-col>
      <ion-col>
        <button ion-button="dot" (click)="changeBackground('black')" class="dot-black" [class.selected]="background == 'black'"></button>
      </ion-col>
    </ion-row>
    <ion-item class="text-athelas">
      <ion-label>Athelas</ion-label>
      <ion-radio value="Athelas"></ion-radio>
    </ion-item>
    <ion-item class="text-charter">
      <ion-label>Charter</ion-label>
      <ion-radio value="Charter"></ion-radio>
    </ion-item>
    <ion-item class="text-iowan">
      <ion-label>Iowan</ion-label>
      <ion-radio value="Iowan"></ion-radio>
    </ion-item>
    <ion-item class="text-palatino">
      <ion-label>Palatino</ion-label>
      <ion-radio value="Palatino"></ion-radio>
    </ion-item>
    <ion-item class="text-san-francisco">
      <ion-label>San Francisco</ion-label>
      <ion-radio value="San Francisco"></ion-radio>
    </ion-item>
    <ion-item class="text-seravek">
      <ion-label>Seravek</ion-label>
      <ion-radio value="Seravek"></ion-radio>
    </ion-item>
    <ion-item class="text-times-new-roman">
      <ion-label>Times New Roman</ion-label>
      <ion-radio value="Times New Roman"></ion-radio>
    </ion-item>
  </ion-list>
  -->
  <button ion-button>Hi</button>
`
})
export class MyPopOverPage{
  constructor() {

  }
} */