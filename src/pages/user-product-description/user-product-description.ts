import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.item = this.navParams.get('product');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserProductDescriptionPage');
  }

  convertTime(time) {
    let date = new Date(time * 1000);
    return date;
  }
}
