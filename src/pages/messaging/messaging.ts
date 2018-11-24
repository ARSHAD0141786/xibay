import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { NetworkEngineProvider } from '../../providers/network-engine/network-engine';
import { UserDataProvider } from '../../providers/user-data/user-data';

/**
 * Generated class for the MessagingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

export interface Message{
  message:string,
  align:string,
  time:number,
  isSent?:boolean
}
@IonicPage()
@Component({
  selector: 'page-messaging',
  templateUrl: 'messaging.html',
})
export class MessagingPage {
  @ViewChild('input') input;
  query:string;
  phone:number;
  messages:Array<Message>;
  constructor(public navCtrl: NavController,private userData:UserDataProvider, private networkEngine:NetworkEngineProvider, public navParams: NavParams,private modalCtrl:ModalController) {
    
  }

  sendMessage(){
    let time = new Date().getTime()/1000;
    console.log(time);
    let message:Message = {
      message:this.query,align:'right',time:time,isSent:false
    };
    this.input.value = null;
    this.messages.push(message);
    let userPostData:any = {
      phone_number:this.phone,
      message:message.message,
    }
    let index:number = this.messages.length - 1;
    this.networkEngine.post(userPostData,'send-message').then( (result:any) => {
      if(result.code == 786){
        this.messages[index].isSent = true;
      }
    });
  }

  convertTime(time){
    return new Date(time * 1000);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagingPage');
    let otp_modal = this.modalCtrl.create('OtpValidationPage');
    otp_modal.onDidDismiss( phoneNumber => {
      if(phoneNumber){
        this.phone = phoneNumber;
        let userPostData:any = {
          phone_number:phoneNumber,
        }
        this.networkEngine.post(userPostData,'show-message').then((result:any) =>{
          this.messages = result.data;
        },(err) => {
          console.log(err);
          this.navCtrl.pop();
        });
      }else{
        this.navCtrl.pop();
      }
    });
    if(this.userData.getUserPostData()==undefined){
      otp_modal.present();
    }else{
      this.phone = this.userData.getUserPostData().phone;
      let userPostData:any = {
        phone_number:this.phone,
      }
      this.networkEngine.post(userPostData,'show-message').then((result:any) =>{
        this.messages = result.data;
      },(err) => {
        console.log(err);
        this.navCtrl.pop();
      });
    }
  }
}
