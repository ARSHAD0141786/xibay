import { Component } from '@angular/core';
import { NotifyProvider } from '../../providers/notify/notify';
import { NavController,ViewController, PopoverController, Refresher, IonicPage } from 'ionic-angular';
// import { WelcomePage } from '../welcome/welcome';
import { UserDataProvider } from '../../providers/user-data/user-data';
import { NetworkEngineProvider } from '../../providers/network-engine/network-engine';
// import { DescriptionPage } from '../description/description';
import { LogsServiceProvider } from '../../providers/logs-service/logs-service';
// import { PostProductPage } from '../post-product/post-product';
import { item } from '../../interfaces/posted_item';
// import { ViewController } from '../../../node_modules/ionic-angular/navigation/view-controller';

@IonicPage()
@Component({
  templateUrl: 'main-tabs.html',
})
export class MainTabsPage {

  // @ViewChild('scheduleList', { read: List }) scheduleList: List;

  // dayIndex = 0;
  // queryText = '';
  // segment = 'all';
  // excludeTracks: any = [];
  // shownSessions: any = [];
  // groups: any = [];
  // confDate: string;

  // tab1Root = PrimaryMainPage;
  // tab2Root = SecondaryMainPage;
  // public photos: any;
  public noRecords: boolean;
  public base64Image: string;

  // data from SERVER
  /**
   * branch: "4"
created: "1531428994"
description: "By William Stallings"
image_url: "http://localhost/xibay/public_html/photo/img-20180712-5b47c082a1c53ionicfile.jpg"
is_hidden: "0"
title: "OPERATING SYSTEM"
useful_branch: "["Computer Science","ECC","Information Technology"]"
useful_year: "["3rd","Final"]"
user_image_url: null
username: "u"
year: "4"
   */

  // public items: Array<{
  //   username:string,
  //   year:string,
  //   branch:string,
  //   user_image_url:string,
  //   title: string,
  //   description: string,
  //   image_url: string,
  //   useful_year?: string,
  //   useful_branch?: string,
  //   created: string,
  // }> = [];

  public items:Array<item> = [];

  refresher: Refresher;
  public refresher_is_present: boolean = false;

  userPostData:any = {
    username: '',
    token: '',
    lastCreated: 0,
  }

  constructor(
    private notify: NotifyProvider,
    private navCtrl: NavController,
    private userData: UserDataProvider,
    private network: NetworkEngineProvider,
    private logs: LogsServiceProvider,
    public popoverCtrl: PopoverController) {

      
      this.userPostData.username = this.userData.getUserPostData().username;
      this.userPostData.token = this.userData.getUserPostData().token;
      this.userPostData.lastCreated = 0;
      this.noRecords = false;
      this.fetchMainContent();
      
    
  }

  convertTime(time) {
    let date = new Date(time * 1000);
    return date;
  }

  

  fetchMainContent() { // when this function is called then it starts loading items from scratch
    this.network.post(this.userPostData, 'fetch-main-content').then((result:any) => {
      if (this.refresher_is_present) {
        this.refresher.complete();
      }
      this.items = [];
      if (result.data.length > 0) {
        this.items = result.data;
        this.noRecords = false;
        this.userPostData.lastCreated = this.items[this.items.length - 1].created;
        console.log("Last created : " + this.userPostData.lastCreated);
      }
    }, (err) => {
      if (this.refresher_is_present) {
        this.refresher.complete();
      }
      console.error(err);
    });
  }

  doInfinite(): Promise<any> { //this function is called to load more data not from scratch
    return new Promise((resolve,reject) => {
        console.log("Start fetching more data : " + this.userPostData.lastCreated);
        this.network.post(this.userPostData, 'fetch-main-content').then((result: any) => {
          if (result.data.length > 0) {
            for (let entry of result.data) {
              this.items.push(entry);
            }
            this.userPostData.lastCreated = result.data[result.data.length - 1].created;
            resolve();
          } else {
            this.noRecords = true;
            console.log("No more records.");
            reject();
          }
        }, (err) => {
          console.log(err);
          reject();
        });
    })
  }

  doRefresh(refresher: Refresher) {
    this.userPostData.lastCreated = 0;
    this.refresher_is_present = true;
    this.refresher = refresher;
    this.fetchMainContent();
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
    this.navCtrl.setRoot('WelcomePage');
    /* import App from ionic angular 
    declare public app: App in constructor
    const root:  this.app.getRootNav();
    root.popToRoot(); */
  }


  showDescription(item:item) {
    this.navCtrl.push('DescriptionPage',{item : item});
  }

  gotoSecondaryPage() {
    this.navCtrl.push('PostProductPage');
  }

  presentFilter(event:any){
    let filter = this.popoverCtrl.create(Filter);
    filter.present({
      ev:event
    });
  }
}

@Component({
  templateUrl:'filterpopover.html'
})
export class Filter{
  constructor(private viewCtrl:ViewController){

  }
  close(){
    this.viewCtrl.dismiss();
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