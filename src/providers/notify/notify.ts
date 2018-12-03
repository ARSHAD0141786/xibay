import { Injectable } from '@angular/core';
import { LoadingController,ToastController,AlertController } from 'ionic-angular';
import { LogsServiceProvider } from '../logs-service/logs-service';

@Injectable()
export class NotifyProvider {
  private loader: any;
  private loading_is_present = false;
  constructor(
    private loading:LoadingController,
    private alert:AlertController,
    private toast:ToastController,
    private logs:LogsServiceProvider
  ) {
    this.logs.addLog("NotifyProvider Started");
    console.log('Hello NotifyProvider Provider');
  }

  presentLoading(msg:string){
    if(this.loading_is_present==true){
      return;
    }
    this.loader = this.loading.create({
      content:msg,
      showBackdrop:true,
      enableBackdropDismiss:true,
      dismissOnPageChange	: true,
    });
    this.loading_is_present = true;
    console.log("Presenting loading");
    this.loader.present();
   }
 
   closeLoading(){
    if(this.loading_is_present){
      console.log("Dismiss loading");
      this.loading_is_present = false;
      this.loader.dismiss();
    }
    try{
      
    }catch(e){
      console.log(e);
    }
   }

   presentToast(msg:string,type:number=0,duration:number=3000,showCloseButton?:boolean) {
     let css:string = 'toast-default';
     let position:string = 'bottom';
     switch(type){
       case 0:css = 'toast-default';break;
       case 1:css = 'toast-not-online';position='top';break;
       case 2:css = 'toast-back-online';break;
       case 3:css = 'toast-notification';position='top';break;
     }
    let toast = this.toast.create({
      message: msg,
      duration:duration,
      position:position,
      showCloseButton:showCloseButton,
      closeButtonText:'OK',
      cssClass:css
    });
    console.log("Presenting toast");
    toast.present();
  }
}