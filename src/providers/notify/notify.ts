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
    }
    try{
      this.loader.dismiss();
    }catch(e){
      console.log(e);
    }
   }

   presentToast(msg:string) {
    let toast = this.toast.create({
      message: msg,
      duration: 2000
    });
    console.log("Presenting toast");
    toast.present();
  }
}