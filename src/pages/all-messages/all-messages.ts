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

  // TODO:: secure this page and remove this line

  passcode:string;
  handler:any//this handler fetches all messages after each 2000 secs;
  public messages:Array<any>;
  constructor(public navCtrl: NavController, public navParams: NavParams,private networkEngine:NetworkEngineProvider) {
  }

  fetchAllMessages(){
    let userPostData:any = {
      passcode:this.passcode,
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

  openMessages(phoneNumber:number){
    this.navCtrl.push(MessagingPage,{phoneNumber:phoneNumber,isDeveloper:true,passcode:'0786'});
  }

  ionViewWillEnter(){
    console.log('all messages page loaded');
    this.handler = setInterval( ()=>{ 
      this.fetchAllMessages();
    },2000);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AllMessagesPage');
    this.passcode = '0786';//this will receive by developer
    this.fetchAllMessages();
  }

  ionViewDidLeave(){
    console.log('Leaving all messages page');
    clearInterval(this.handler);
  }

}
