import { Component } from '@angular/core';
import { NotifyProvider } from '../../providers/notify/notify';
import { NavController, PopoverController, Refresher } from 'ionic-angular';
import { WelcomePage } from '../welcome/welcome';
import { UserDataProvider } from '../../providers/user-data/user-data';
import { NetworkEngineProvider } from '../../providers/network-engine/network-engine';
import { DescriptionPage } from '../description/description';
import { LogsServiceProvider } from '../../providers/logs-service/logs-service';
import { PostProductPage } from '../post-product/post-product';
// import { CameraOptions,Camera } from '@ionic-native/camera';

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
  public photos: any;
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

  items: Array<{
    username:string,
    year:string,
    branch:string,
    user_image_url:string,
    title: string,
    description: string,
    image_url: string,
    useful_year?: string,
    useful_branch?: string,
    created: string,
  }>;

  refresher: Refresher;
  public refresher_is_present: boolean = false;

  userPostData = {
    username: '',
    token: '',
    lastCreated: '',
  }

  constructor(
    private notify: NotifyProvider,
    private navCtrl: NavController,
    private userData: UserDataProvider,
    private network: NetworkEngineProvider,
    private logs: LogsServiceProvider,
    public popoverCtrl: PopoverController) {
    this.notify.presentLoading('Please wait...');
    this.logs.addLog('inside main-tabs constructor');
    this.userData.getUsername().then((username: string) => {
      this.userPostData.username = username;
      this.userData.getToken().then((token) => {
        this.notify.closeLoading();
        this.userPostData.token = token;
        // if all variables are initialised
        this.fetchMainContent();
        this.userPostData.lastCreated = '';
        this.noRecords = false;
      });
    });

  }

  convertTime(time) {
    let date = new Date(time * 1000);
    return date;
  }

  fetchMainContent() {
    this.notify.presentLoading("Loading main content...");
    this.logs.addLog('Fetching main content');
    this.network.post(this.userPostData, 'fetch-main-content').then((fetchData:any) => {
      this.notify.closeLoading();
      if (this.refresher_is_present) {
        this.refresher.complete();
      }
      if (fetchData.data) {
        this.items = fetchData.data;
        let dataLength = this.items.length;
        this.userPostData.lastCreated = this.items[dataLength - 1].created;
        console.log("Last created : " + this.userPostData.lastCreated);
      }
    }, (err) => {
      if (this.refresher_is_present) {
        this.refresher.complete();
      }
      console.log(err);
    });
  }

  doInfinite(e): Promise<any> {
    console.log('Begin async operation');

    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Start fetching more data : " + this.userPostData.lastCreated);
        this.network.post(this.userPostData, 'fetch-main-content').then((fetchData: any) => {
          if (fetchData.data.length) {
            const newData = fetchData.data;
            this.userPostData.lastCreated = newData[newData.length - 1].created;
            console.log("Last created : " + this.userPostData.lastCreated);
            for (let i = 0; i < newData.length; i++) {
              this.items.push(newData[i]);
            }
          } else {
            this.noRecords = true;
            console.log("No more records.");
          }
        }, (err) => {
          console.log(err);
        });
        console.log('Async operation has ended');
        resolve();
      }, 500);
    })
  }

  doRefresh(refresher: Refresher) {
    this.userPostData.lastCreated = '';
    this.refresher_is_present = true;
    this.items = [];
    this.refresher = refresher;
    this.fetchMainContent();
    // this.confData.getTimeline(this.dayIndex, this.queryText, this.excludeTracks, this.segment).subscribe((data: any) => {
    //   this.shownSessions = data.shownSessions;
    //   this.groups = data.groups;
    //   // simulate a network request that would take longer
    //   // than just pulling from out local json file
    //   setTimeout(() => {
    //     refresher.complete();

    //     const toast = this.toastCtrl.create({
    //       message: 'Sessions have been updated.',
    //       duration: 3000
    //     });
    //     toast.present();
    //   }, 1000);
    // });
  }

  // showPopOver(){
  //   let popover = this.popoverCtrl.create(MyPopOverPage);
  //   popover.present();
  // }
  ngOnInit() {
    this.photos = [];
  }

  clearLocalStorage() {
    this.logs.addLog('clear local storage');
    localStorage.clear();
    this.notify.presentLoading("Logging out...");
    setTimeout(() => this.logout(), 1000);
  }

  logout() {
    this.logs.addLog('Logging out...');
    this.notify.closeLoading();
    this.userData.logout();
    this.logs.addLog('Setting root page to Welcome page');
    this.navCtrl.setRoot(WelcomePage);
    /* import App from ionic angular 
    declare public app: App in constructor
    const root:  this.app.getRootNav();
    root.popToRoot(); */
  }

  // takePhoto() {
  //   console.log("Taking photo");
  //   const options: CameraOptions = {
  //     quality: 50,
  //     destinationType: this.camera.DestinationType.DATA_URL,
  //     encodingType: this.camera.EncodingType.JPEG,
  //     mediaType: this.camera.MediaType.PICTURE
  //   }

  //   this.camera.getPicture(options).then((imageData) => {
  //     // imageData is either a base64 encoded string or a file URI
  //     // If it's base64:
  //     this.base64Image = 'data:image/jpeg;base64,' + imageData;
  //     this.photos.push(this.base64Image);
  //     this.photos.reverse();
  //   }, (err) => {
  //     // Handle error
  //   });
  // }


  showDescription(item) {
    this.logs.addLog('show description method in main-tabs.ts');
    this.navCtrl.push(DescriptionPage, item);
  }

  gotoSecondaryPage() {
    this.navCtrl.push(PostProductPage);
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