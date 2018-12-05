import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NetworkEngineProvider } from '../../providers/network-engine/network-engine';

/**
 * Generated class for the TermsAndPoliciesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-terms-and-policies',
  templateUrl: 'terms-and-policies.html',
})
export class TermsAndPoliciesPage {

  public data:Array<any> = [];
  networkConnected:boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams,private networkEngine:NetworkEngineProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TermsAndPoliciesPage');
    this.networkEngine.get('terms-and-policies').then( (result:any) => {
      console.log(result);
      this.data = result;
    },error => {
      console.log(error);
      this.networkConnected = false;
    }).catch(error => {
      console.log(error);
      this.networkConnected = false;
    });
  }

}
