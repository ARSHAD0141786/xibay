import { Injectable } from '@angular/core';
import { LoadingController,ToastController } from 'ionic-angular';

@Injectable()
export class NotifyProvider {
  private loader: any;
  private waiting:any;
  constructor(
    private loading:LoadingController,
    private toast:ToastController,
  ) {
    console.log('Hello NotifyProvider Provider');
  }

  presentWaiting(){
    this.waiting = this.loading.create({
      showBackdrop:true,
      enableBackdropDismiss:false,
    });
    this.waiting.present();
    console.log('waiting');
  }
  closeWaiting(){
    try{
      console.log('close waiting');
      this.waiting.dismiss();
    }catch(error){
      console.log(error);
    }
  }

  presentLoading(msg:string){
    this.loader = this.loading.create({
      content:msg,
      showBackdrop:true,
      enableBackdropDismiss:true,
      dismissOnPageChange	: true,
    });
    console.log("Presenting loading");
    this.loader.present();
   }
 
   closeLoading(){
    try{
      console.log("Dismiss loading");
      this.loader.dismiss();
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