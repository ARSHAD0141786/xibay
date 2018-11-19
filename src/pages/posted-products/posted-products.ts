import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { item } from '../../interfaces/posted_item';
import { UserProductDescriptionPage } from '../user-product-description/user-product-description';
import { NetworkEngineProvider } from '../../providers/network-engine/network-engine';
import { UserDataProvider } from '../../providers/user-data/user-data';

@IonicPage()
@Component({
  selector: 'page-posted-products',
  templateUrl: 'posted-products.html',
})

export class PostedProductsPage {

  /**
   data item array element from server
   {
            "id": "13",
            "title": "ashad",
            "description": "This is nice pic",
            "category_fk": "5",
            "image_url": "http://localhost/xibay/public_html/photo/img-20181116-5bef1d24efbffionicfile.jpg",
            "is_hidden": "0",
            "year": "[\"2nd\",\"3rd\"]",
            "branch": "[\"Civil\",\"Computer Science\",\"Electrical\"]",
            "username_fk": "arshad",
            "created": "1542397220",
            "total_requests": "0",
            "sold_to": null,
            "sold_on": null,
            "category_name":"others"
        }
   */

  posted_products:item[] = [];
  
  constructor(public navCtrl: NavController,private userPostData:UserDataProvider, public navParams: NavParams,private networkEngine:NetworkEngineProvider) {
    
    this.fetchProducts();
  }

  fetchProducts(){
    this.networkEngine.post(this.userPostData.getUserPostData(),'fetch-my-posted-products').then( (result:any) => {
      this.posted_products = result.data;
    },err => {
      console.error(err);
    });
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad PostedProductsPage');
  }

  convertTime(time) {
    let date = new Date(time * 1000);
    return date;
  }

  openItem(item:item,index:number){
    console.log('open item');
    this.navCtrl.push(UserProductDescriptionPage,{index:,product:item , callbackFunction : this.requestCallBackFunction});
  }
  deleteItem(item:item){
    console.log('delete item');
  }

  //this function will be called from next pushing page which is user-product page
  requestCallBackFunction = function(isAccepted,index){
    return new Promise( (resolve , reject ) => {
      resolve();
    });
  }

}
