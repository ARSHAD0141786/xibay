import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { item } from '../../interfaces/posted_item';

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
  private requests:Array<
  {
    user_image_url:string,
    user_branch_code:string,
    user_year:string,
    username:string;
    full_name:string
  }>=[];
  constructor(public navCtrl: NavController, public navParams: NavParams,private modalCtrl:ModalController) {
    this.item = this.navParams.get('product');
  
    let request:any = {
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
  }

  
}
