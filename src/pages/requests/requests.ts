import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { NetworkEngineProvider } from '../../providers/network-engine/network-engine';
import { UserDataProvider } from '../../providers/user-data/user-data';

@IonicPage()
@Component({
  selector: 'page-requests',
  templateUrl: 'requests.html',
})
export class RequestsPage {

  private requests:Array<{
    image_url:'',
    title:'',
    status:number,
    description:'',
  }>;
  constructor(public navCtrl: NavController, public navParams: NavParams, private networkEngine: NetworkEngineProvider,private userData: UserDataProvider,private modalCtrl:ModalController) {
    
    this.networkEngine.post(this.userData.getUserPostData(),'fetch-requested-products').then( (result:any) =>{
      this.requests = result.data;
    },(err) => {
      console.log(err);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RequestsPage');
  }

  openImage(image_url:string){
    let full_image_modal = this.modalCtrl.create('FullImagePage',{image:image_url});
    full_image_modal.present();
  }

}
