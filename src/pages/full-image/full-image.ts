import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the FullImagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-full-image',
  templateUrl: 'full-image.html',
})
export class FullImagePage {

  image_url:string;
  image_data:string;//base64 image

  //this page just show the full image by url send in navParams from other page in {image: url} format;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.image_url = navParams.get('image');
    this.image_data = navParams.get('image_data');
  }

  getImageUrl(){
    return 'url(' + this.image_data.toString() + ')'
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad FullImagePage');
  }

  goBack(){
    this.viewCtrl.dismiss();
  }

}
