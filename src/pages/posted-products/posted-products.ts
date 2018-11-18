import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { item } from '../../interfaces/posted_item';
import { UserProductDescriptionPage } from '../user-product-description/user-product-description';

@IonicPage()
@Component({
  selector: 'page-posted-products',
  templateUrl: 'posted-products.html',
})

export class PostedProductsPage {

  /**
   * data item array element from server
   * {
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

  

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    let item1 = {
      title:'OPERATING SYSTEM',
      description:'By William Stallings',
      category_name:'Books',
      image_url:'http://localhost/xibay/public_html/photo/img-20180712-5b47c082a1c53ionicfile.jpg',
      is_hidden:0,
      useful_year:["3rd","Final"],
      useful_branch:["Computer Science","ECC","Information Technology"],
      total_requests:0,
      created:	1531428907,
      sold_on:null,
      sold_to:null
    }
    this.posted_products.push(item1);
    this.posted_products.push(item1);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PostedProductsPage');
  }

  openItem(item:item){
    console.log('open item');
    this.navCtrl.push(UserProductDescriptionPage,{product:item});
  }
  deleteItem(item:item){
    console.log('delete item');
  }

}
