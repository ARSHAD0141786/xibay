import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
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

  public classReference = PostedProductsPage;
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

 static posted_products:item[] = [];
  
  constructor(public navCtrl: NavController,private userPostData:UserDataProvider, public navParams: NavParams,private networkEngine:NetworkEngineProvider,private alertCtrl:AlertController) {
    
    this.fetchProducts();
  }

  fetchProducts(){
    this.networkEngine.post(this.userPostData.getUserPostData(),'fetch-my-posted-products').then( (result:any) => {
      PostedProductsPage.posted_products = result.data;
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
    console.log('open item idex : '+index);
    this.navCtrl.push(UserProductDescriptionPage,{index:index,product:item , callbackFunction : this.requestCallBackFunction});
  }
  deleteItem(item:item,index:number){
    let alert = this.alertCtrl.create({
      title:'Are you sure, you want to delete this product ?',
      subTitle:item.title,
      buttons:[
        {
          text:'Nah',
          role:'cancel',
          handler : () => {
            console.log('Alert canceled');
          }
        },
        {
          text: 'Delete',
          handler: ()=> {
            console.log('deleting item...');
            let postData:any = {
              username : this.userPostData.getUserPostData().username,
              token : this.userPostData.getUserPostData().token,
              item_id : item.id
            }
            this.networkEngine.post(postData,'delete-a-posted-product').then( (result:any) => {
              PostedProductsPage.posted_products.splice(index,1);
            },error => {
              console.error(error);
            });
          }
        }
      ]
    });
    alert.present();
  }

  //this function will be called from next pushing page which is user-product page
  requestCallBackFunction = function(isAccepted,index){
    if(isAccepted){
      
      // this.posted_products[index].is_hidden = 1;
    }
    return new Promise( (resolve , reject ) => {
      PostedProductsPage.posted_products[index].is_hidden = isAccepted;
      resolve();
    });
  }

}
