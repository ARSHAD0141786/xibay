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
  status:number
}
@IonicPage()
@Component({
  selector: 'page-messaging',
  templateUrl: 'messaging.html',
})
export class MessagingPage {
  @ViewChild('input') input;
  @ViewChild('content') content;
  query:string;
  phone:string;//this is used to fetch messages only
  lastTime:number=0;
  handler:any;//this will handel thread of new messages
  messages:Array<Message>;
  constructor(public navCtrl: NavController,private userData:UserDataProvider, private networkEngine:NetworkEngineProvider, public navParams: NavParams,private modalCtrl:ModalController) {
    this.messages = [];
  }

  sendMessage(){
    if(this.navParams.get('isDeveloper')){
      this.sendMessageAsADeveloper();  
    }else{
      this.sendMessageAsIndividual();    
    }
  }

  scrollDown(){
    setTimeout( () => {
      this.content.scrollToBottom();
    },200);
  }

  checkForNewMessages(){
    let userPostData:any = {
      lastTime:this.lastTime,
      phoneNumber:this.phone
    }
    this.networkEngine.post(userPostData,'fetch-more-messages').then( (result:any) =>{
        if(result.code == 786 && result.data.length > 0){
          for(let x of result.data){
            this.messages.push(x);
          }
          this.scrollDown();
          this.lastTime = this.messages[this.messages.length - 1].time;
        }else{
          console.log(result);
        }
    },err => {
      console.log(err);
    }).catch( err => {
      console.log('Catch exception');
      console.log(err);
    });
  }

  myIcon(status:number){
    switch(status){
      case -1:return 'md-time';
      case 0: return 'md-checkmark';
      case 1: return 'md-checkmark';
      case 2: return 'md-done-all';
      default: return 'md-done-all';
    }
  }

  myColor(status:number){
    switch(status){
      case 2: return 'secondary';
      default: return 'dark';
    }
  }

  sendMessageAsADeveloper(){
    let time = new Date().getTime()/1000;
    console.log(time);
    let message:Message = {
      message:this.query,align:'left',time:time,status:-1
    };
    this.input.value = null;
    this.messages.push(message);
    let userPostData:any = {
      phone_number:this.navParams.get('phoneNumber'),
      message:message.message,
      passcode:this.navParams.get('passcode')
    }
    let index:number = this.messages.length - 1;
    this.networkEngine.post(userPostData,'send-message-as-a-developer').then( (result:any) => {
      if(result.code == 786){
        this.messages[index].status = 1;
        this.lastTime = result.time;
        this.messages[index].time = result.time;
      }
    },err => {
      //notify developer
      this.messages[index].message = 'Resend this message !';
      console.log(err);
    }).catch( err => {
      console.log(err);
      this.messages[index].message = 'Resend this message !';
    });
    this.scrollDown();
  }

  sendMessageAsIndividual(){
    let time = new Date().getTime()/1000;
    console.log(time);
    let message:Message = {
      message:this.query,align:'right',time:time,status:-1
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
        this.messages[index].status = 1;
        this.messages[index].time = result.time;
        this.lastTime = result.time;
      }
    },err=>{
      console.log(err);
      this.messages[index].message = 'Resend this message !';
    }).catch( err => {
      console.log(err);
      this.messages[index].message = 'Resend this message !';
    });
    this.scrollDown();
  }

  convertTime(time){
    return new Date(time * 1000);
  }

  convertDir(dir:string){
    if(this.navParams.get('isDeveloper')){
      switch(dir){
        case 'left':return 'right';
        case 'right':return 'left';
      }
    }else{
      return dir;
    }
  }

  fetchAllMessagesInitially(phoneNumber){
    let userPostData:any = {
      phone_number:phoneNumber,
    }
    this.networkEngine.post(userPostData,'show-message').then((result:any) =>{
      if(result.code == 786 && result.data.length > 0){
        this.messages = result.data;
        this.lastTime = this.messages[this.messages.length-1].time;
        console.log('Last messages from : '+this.lastTime);
        this.scrollDown();
      }
    },(err) => {
      console.log(err);
      this.navCtrl.pop();
    });
    this.handler = setInterval( () => {
      this.checkForNewMessages();
    },800);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagingPage');
    /// make secure this page
    if(this.navParams.get('isDeveloper')==true){//here this page is called from developers page
      this.fetchAllMessagesInitially(this.navParams.get('phoneNumber'));
      this.phone = this.navParams.get('phoneNumber');
      return;
    }
    let otp_modal = this.modalCtrl.create('OtpValidationPage');
    otp_modal.onDidDismiss( phoneNumber => {
      if(phoneNumber){
        this.phone = phoneNumber;
        this.fetchAllMessagesInitially(phoneNumber);
      }else{
        this.navCtrl.pop();
      }
    });
    console.log(this.userData.getUserPostData());
    if(this.userData.getUserPostData() == undefined){//when user not logged in
      otp_modal.present();
    }else{//when user logged in
      this.phone = this.userData.getUserPostData().phone_number;
      this.fetchAllMessagesInitially(this.phone);
    }
  }

  ionViewDidLeave(){
    console.log('Leaving Messages page');
    clearInterval(this.handler);
  }
}
