import { Injectable } from '@angular/core';
import { LoadingController,ToastController,AlertController } from 'ionic-angular/umd';
import { LogsServiceProvider } from '../logs-service/logs-service';

@Injectable()
export class NotifyProvider {
  public loader: any;
  private loading_is_present = false;
  constructor(
    public loading:LoadingController,
    public alert:AlertController,
    public toast:ToastController,
    public logs:LogsServiceProvider
  ) {
    this.logs.addLog("NotifyProvider Started");
    console.log('Hello NotifyProvider Provider');
  }

  presentLoading(msg:string){
    this.loader = this.loading.create({content: msg})
    this.loading_is_present = true;
    console.log("Presenting loading");
    this.loader.present();
   }
 
   closeLoading(){
    if(this.loading_is_present){
      console.log("Dismiss loading");
      this.loader.dismiss();
      this.loading_is_present = false;
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