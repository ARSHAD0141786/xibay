import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NetworkEngineProvider } from '../../providers/network-engine/network-engine';
import { MessagingPage } from '../messaging/messaging';

@IonicPage()
@Component({
  selector: 'page-all-messages',
  templateUrl: 'all-messages.html',
})
export class AllMessagesPage {

  public messages:Array<any>;
  constructor(public navCtrl: NavController, public navParams: NavParams,private networkEngine:NetworkEngineProvider) {
  }

  openMessages(phoneNumber:number){
    this.navCtrl.push(MessagingPage,{phoneNumber:phoneNumber,isDeveloper:true,passcode:'0786'});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AllMessagesPage');
    let userPostData:any = {
      passcode:'0786',
    }
    this.networkEngine.post(userPostData,'fetch-all-messages-as-a-developer').then( (res:any) => {
      if(res.code == 786){
        this.messages = res.data;
      }else{
        console.log(res);
      }
    },err => {
      console.log(err);
    });
  }

}
