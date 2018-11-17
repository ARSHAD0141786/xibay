import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-terms-and-condition',
  templateUrl: 'terms-and-condition.html',
})
export class TermsAndConditionPage {

  constructor(public navCtrl: NavController,public viewCtrl: ViewController, public navParams: NavParams, private modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TermsAndConditionPage');
  }

  onAgree(){
    //open otp modal
    console.log('User agreed on terms and conditions.')
    this.viewCtrl.dismiss(true);
  }
  onCancel(){
    this.viewCtrl.dismiss(false);
  }
}
