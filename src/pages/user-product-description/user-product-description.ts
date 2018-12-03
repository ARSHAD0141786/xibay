import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController} from 'ionic-angular';
import { item } from '../../interfaces/posted_item';
import { UserDataProvider } from '../../providers/user-data/user-data';
import { NetworkEngineProvider, Notification } from '../../providers/network-engine/network-engine';
import { User } from '../../interfaces/user';
import { NotifyProvider } from '../../providers/notify/notify';

@IonicPage()
@Component({
  selector: 'page-user-product-description',
  templateUrl: 'user-product-description.html',
})
export class UserProductDescriptionPage {
  private item:item;
  private itemIndex:number;
  public callbackFunction;
  public isRequestAccepted:boolean = false;

  private requests:Array<User>=[];
  private choosen_user:User;

  constructor(public navCtrl: NavController,private notify:NotifyProvider, private userData:UserDataProvider,private networkEngine:NetworkEngineProvider, private alertCtrl:AlertController, public navParams: NavParams) {
    this.item = this.navParams.get('product');
    console.log(this.item);
    this.itemIndex = this.navParams.get('index');
    console.log(this.itemIndex);
    this.callbackFunction = this.navParams.get('callbackFunction');
    if(this.item.is_hidden == 0){
      this.fetchRequests();
    }else{
      this.fetchChoosenUser(this.item.id);
    }
  }

  fetchChoosenUser(item_id:number){
    let postData:any = {
      username:this.userData.getUserPostData().username,
      token : this.userData.getUserPostData().token,
      item_id:item_id
    }
    this.networkEngine.post(postData,'fetch-choosen-user-for-a-product').then( (result:any) => {
      this.isRequestAccepted = true;
      this.choosen_user = result.data[0];//this is always one element array because user can only accept one user
    },err => {
      console.error(err);
    });
  }

  fetchRequests(){
    let postData:any = {
      username:this.userData.getUserPostData().username,
      token:this.userData.getUserPostData().token,
      item_id:this.item.id
    }
    this.networkEngine.post(postData,'fetch-requests-for-a-product').then( (result:any) => {
      this.requests = result.data;
    },err => {
      console.error(err);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserProductDescriptionPage');
  }
  
  refresh(){
    console.log('refresh');
    //only refresh list when found list with more requests
    this.fetchRequests();
  }

  showToast(status:number){
    if(status==0){
      this.notify.presentToast('Your product is visible to ALL');
    }else{
      this.notify.presentToast('Your product is not visible to ALL');
    }

  }

  accept(request:User){
    console.log('accepting request of : ');
    console.log(request);
    let alert = this.alertCtrl.create({
      title: 'Are you sure, you want to accept request from '+request.name +' ?',
      subTitle: 'After accepting this request all remaining requests are rejected automatically !',
      enableBackdropDismiss:false,
      buttons:[
        {
          text:'Nah',
          role:'cancel',
          handler : () => {
            console.log('Alert canceled');
          }
        },
        {
          text: 'Accept',
          handler: ()=> {
            console.log('Accepet request : '+request);
            //call api here
            this.acceptApiCall(this.item.id,request.request_id,request.username,request.FCM_token);
          }
        }
      ]
    });
    alert.present();
  }

  acceptApiCall(item_id:number,request_id:number,to_username:string,user_fcm_token:string){
    let postData:any = {
      username:this.userData.getUserPostData().username,
      token:this.userData.getUserPostData().token,
      item_id:item_id,
      request_id:request_id,
      to_username:to_username
    }

    this.networkEngine.post(postData,'accept-request').then( (result:any) => {
      console.log(result);
      this.isRequestAccepted = true;
      this.item.is_hidden = 1;
      this.callbackFunction(this.isRequestAccepted,this.requests.length,this.itemIndex).then( ()=> {
        this.choosen_user = result.data[0];//this is always one element array because user can only accept one user
      });
      // send notification to accepted user
      let notification:Notification = {
        notification:{
          title:'Congratulations !',
          body:'Your request for the product '+ this.item.title + ' has been accepted by @'+ UserDataProvider.userPostData.username,
          sound:"default",
          click_action:"",
          icon:"icon"
        },
        data:{
          click:"",
          code:12
        },
        to:user_fcm_token,
        priority:"high",
        restricted_package_name:"com.xibay.android"
      }
      this.networkEngine.sendNotificationToParticularPerson(notification).then( (res) => {
        console.log(res);
      },er => {
        console.log(er);
      });

      //send notification for all rejected users


    },(err) => {
      console.error(err);
    });

    
  }

  convertTime(time) {
    let date = new Date(time * 1000);
    return date;
  }

  
}
