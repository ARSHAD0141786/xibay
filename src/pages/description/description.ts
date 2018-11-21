import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { NetworkEngineProvider } from '../../providers/network-engine/network-engine';
import { NotifyProvider } from '../../providers/notify/notify';
import { UserDataProvider } from '../../providers/user-data/user-data';
import { item } from '../../interfaces/posted_item';

@IonicPage()
@Component({
  selector: 'page-description',
  templateUrl: 'description.html',
})
export class DescriptionPage {
  
  private item:item;  

  constructor(
    public navCtrl: NavController,
    private network:NetworkEngineProvider, 
    private userData:UserDataProvider,
    public menu:MenuController,
    private notify:NotifyProvider,
    public navParams: NavParams) {

    this.item  = navParams.get('item');
  }

  ionViewDidEnter() {
    // the root left menu should be disabled on the tutorial page
    this.menu.enable(false);
  }

  ionViewDidLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true, 'loggedInMenu');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DescriptionPage');
  }

  sendRequest(){
      let userPostData:any = {
        username:this.userData.getUserPostData().username,
        token : this.userData.getUserPostData().token,
        item_id : this.item.id,
        to_username : this.item.username_fk
      }
      this.network.post(userPostData,'send-request').then((d:any)=>{
          if(d.message){
            this.notify.presentToast(d.message);
          }else if(d.error){
            console.log("D.code : " + d.code);
            if(d.code == 1){ // SQL error
              let Error = d.error.split(':')[0].split('[')[1].split(']')[0];
              console.log(Error);
              if(Error == 23000){
                this.notify.presentToast("Request already sent.");
              }
            }else{
              this.notify.presentToast('Error : '+d.error);
            }
          }else{
            this.notify.presentToast("Something went wrong");
          }
      },(err)=>{
        this.notify.presentToast("error : "+JSON.stringify(err));
      });
  }
}