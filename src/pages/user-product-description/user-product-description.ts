import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { item } from '../../interfaces/posted_item';
import { UserDataProvider } from '../../providers/user-data/user-data';
import { NetworkEngineProvider } from '../../providers/network-engine/network-engine';
import { User } from '../../interfaces/user';

/**
 * Generated class for the UserProductDescriptionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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
  
  // private requests:Array<
  // {
  //   user_image_url:string,
  //   branch:string,
  //   user_year:string,
  //   username:string,
  //   name:string,
  //   request_id:number
  // }>=[];

  private requests:Array<User>=[];
  private choosen_user:User;

  // private user_choosen:any = {
  //   user_image_url:'http://localhost/xibay/public_html/photo/img-20180513-5af7d3c05ba4eionicfile.jpg',
  //   user_branch:'CSE',
  //   user_year:'3rd',
  //   full_name:'Mohammed Arshad',
  //   contact_details:'+91 8441975563',
  // }
  constructor(public navCtrl: NavController,private userData:UserDataProvider,private networkEngine:NetworkEngineProvider, private alertCtrl:AlertController, public navParams: NavParams,private modalCtrl:ModalController) {
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
  }

  accept(request:any){
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
            this.acceptApiCall(this.item.id,request.request_id,request.username);
            this.callbackFunction(this.isRequestAccepted,this.itemIndex).then( ()=> {
              // this.navCtrl.pop();
            });
          }
        }
      ]
    });
    alert.present();
  }

  acceptApiCall(item_id:number,request_id:number,to_username:string){
    let postData:any = {
      username:this.userData.getUserPostData().username,
      token:this.userData.getUserPostData().token,
      item_id:item_id,
      request_id:request_id,
      to_username:to_username
    }

    this.networkEngine.post(postData,'accept-request').then( (result:any) => {
      console.log(result);
    },(err) => {
      console.error(err);
    });

    
  }
  
  popThisPage(){
    this.callbackFunction(this.isRequestAccepted).then( ()=> {
      // this.navCtrl.pop();
    });
  }

  
}
