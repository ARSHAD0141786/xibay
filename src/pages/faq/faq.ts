import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NetworkEngineProvider } from '../../providers/network-engine/network-engine';

/**
 * Generated class for the FaqPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
export interface FAQ{
  question:string;
  answer:string;
}

@IonicPage()
@Component({
  selector: 'page-faq',
  templateUrl: 'faq.html',
})
export class FaqPage {

  public data:Array<FAQ>=[];
  networkConnected:boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams,private networkEngine:NetworkEngineProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FaqPage');
    this.networkEngine.get('faq-file').then( (result:any) => {
      console.log(result);
      this.data = result;
    } , error => {
      console.log(error);
      this.networkConnected = false;
    }).catch( err => {
      console.log(err);
      this.networkConnected = false;
    });
  }

}
