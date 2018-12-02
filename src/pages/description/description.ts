import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, PopoverController, AlertController } from 'ionic-angular';
import { NetworkEngineProvider, Notification } from '../../providers/network-engine/network-engine';
import { NotifyProvider } from '../../providers/notify/notify';
import { UserDataProvider } from '../../providers/user-data/user-data';
import { item } from '../../interfaces/posted_item';
import { ViewController } from '../../../node_modules/ionic-angular/navigation/view-controller';

@IonicPage()
@Component({
  selector: 'page-description',
  templateUrl: 'description.html',
})
export class DescriptionPage {
  
  private item:item; 
  private useful_branch:Array<String>;
  private useful_year:Array<string>=[];

  constructor(
    public navCtrl: NavController,
    private network:NetworkEngineProvider,
    private popoverCtrl:PopoverController,
    private userData:UserDataProvider,
    public menu:MenuController,
    private notify:NotifyProvider,
    public navParams: NavParams) {

    this.item  = navParams.get('item');
    this.useful_branch = JSON.parse(this.item.useful_branch.toString());
    this.useful_year = JSON.parse(this.item.useful_year.toString());
    if(this.useful_branch.length == 12){
      this.useful_branch = ['ALL'];
    }
    if(this.useful_year.length == 4){
      this.useful_year = ['ALL'];
    }
    console.log(this.useful_branch);
    console.log(this.useful_year);
  }

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    this.menu.enable(false);
  }
  
  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverPage,{item_id:this.item.id});
    popover.present({
      ev: myEvent,
    });
  }

  ionViewDidLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true, 'loggedInMenu');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DescriptionPage');
  }

  sendRequest(){
      let userPostData:any = {
        username:this.userData.getUserPostData().username,
        token : this.userData.getUserPostData().token,
        item_id : this.item.id,
        to_username : this.item.username_fk
      }
      this.network.post(userPostData,'send-request').then((d:any)=>{
          if(d.message){
            this.notify.presentToast(d.message);
            //request sent successfully
            let notification:Notification = {
              notification_body:{
                title:'New Request',
                body:'You have a new request from '+UserDataProvider.userPostData.username + ' for your posted product '+ this.item.title,
              },
              to_user:this.item.user_fcm_token,
             data:{
               click:'',
               code:12
             },
            }
            this.network.sendNotificationToParticularPerson(notification).then( (res) => {
              console.log(res);
            },er => {
              console.log(er);
            });
          }else if(d.error){
            console.log("D.code : " + d.code);
            if(d.code == 1){ // SQL error
              let Error = d.error.split(':')[0].split('[')[1].split(']')[0];
              console.log(Error);
              if(Error == 23000){
                this.notify.presentToast("You have already requested for this product.");
              }
            }else{
              this.notify.presentToast('Error : '+d.error);
            }
          }else{
            this.notify.presentToast("Something went wrong");
          }
      },(err)=>{
        this.notify.presentToast("error : "+JSON.stringify(err));
      });
  }
}

@Component({
  template: `
      <button ion-item (click)="report()">Report</button>
  `
})
export class PopoverPage {
  constructor(public navParams:NavParams, public viewCtrl: ViewController,private userPostData:UserDataProvider,private networkEngine:NetworkEngineProvider,private alertCtrl:AlertController) {}
  
  report(){
    let alert = this.alertCtrl.create({
      title:'Are you sure you want to report this product ?',
      buttons:[
        {text:'No',role:'cancel'},
        {text:'Yes',handler: () => {
          let userPostData :any = {
            username:this.userPostData.getUserPostData().username,
            token:this.userPostData.getUserPostData().token,
            item_id:this.navParams.get('item_id'),
          }
          this.networkEngine.post(userPostData,'report-a-product').then( (result:any) => {
            if(result.code == 786){
              console.log('Product reported successfully');
            }else{
              console.log('Someting went wrong');
              console.log(result.message);
            }
          },(err) => {
            console.log(err);
          });
        }}
      ],
    });
    alert.present();
    this.viewCtrl.dismiss();
  }
}