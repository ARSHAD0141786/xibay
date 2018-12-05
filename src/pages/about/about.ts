import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private popoverCtrl:PopoverController) {
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutPage');
  }

  showDevelopers(event){
    let popover = this.popoverCtrl.create('DeveloperPopoverPage');
    popover.present({
      ev: event,
    });
  }

}

@Component({
  templateUrl:'developersPopup.html'
})
export class DeveloperPopoverPage{
  constructor(){

  }
}

