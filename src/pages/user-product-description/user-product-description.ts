import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { item } from '../../interfaces/posted_item';
import { UserDataProvider } from '../../providers/user-data/user-data';
import { NetworkEngineProvider } from '../../providers/network-engine/network-engine';

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
  public callbackFunction;
  public isRequestAccepted:boolean = false;
  private requests:Array<
  {
    user_image_url:string,
    user_branch_code:string,
    user_year:string,
    username:string;
    full_name:string
  }>=[];
  private user_choosen:any = {
    user_image_url:'http://localhost/xibay/public_html/photo/img-20180513-5af7d3c05ba4eionicfile.jpg',
    user_branch:'CSE',
    user_year:'3rd',
    full_name:'Mohammed Arshad',
    contact_details:'+91 8441975563',
  }
  constructor(public navCtrl: NavController,private userData:UserDataProvider,private networkEngine:NetworkEngineProvider, private alertCtrl:AlertController, public navParams: NavParams,private modalCtrl:ModalController) {
    this.item = this.navParams.get('product');
    this.callbackFunction = this.navParams.get('callbackFunction');
    let request:any = {
      request_id:12,
      user_image_url:'http://localhost/xibay/public_html/photo/img-20180513-5af7d3c05ba4eionicfile.jpg',
      user_branch:'CSE',
      user_year:'3rd',
      username:'u',
      full_name:'Mohammed Arshad'
    }
    this.requests.push(request);
    this.requests.push(request);
    this.requests.push(request);
    this.requests.push(request);
    this.requests.push(request);
    this.requests.push(request);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserProductDescriptionPage');
  }
  openImage(image_url:any){
    let full_image_modal = this.modalCtrl.create('FullImagePage',{image:image_url});
    full_image_modal.present();
  }

  refresh(){
    console.log('refresh');
    //only refresh list when found list with more requests
  }

  accept(request:any){
    console.log('accepting request of : ');
    console.log(request);
    let alert = this.alertCtrl.create({
      title: 'Are you sure you want to accept request from '+request.full_name +' ?',
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
            this.acceptApiCall(this.item.item_id,request.request_id,request.username);
            this.isRequestAccepted = true;
            this.callbackFunction(this.isRequestAccepted).then( ()=> {
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
