import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams} from 'ionic-angular';
import { NetworkEngineProvider } from '../../providers/network-engine/network-engine';
import { UserDataProvider } from '../../providers/user-data/user-data';
import { item } from '../../interfaces/posted_item';

@IonicPage()
@Component({
  selector: 'page-requests',
  templateUrl: 'requests.html',
})
export class RequestsPage {

  public requests:Array<item>;
  constructor(public navCtrl: NavController, public navParams: NavParams, private networkEngine: NetworkEngineProvider,private userData: UserDataProvider) {
    
    this.networkEngine.post(this.userData.getUserPostData(),'fetch-requested-products').then( (result:any) =>{
      if(result.data.length > 0){
        this.requests = result.data;
      }
    },(err) => {
      console.log(err);
    });
  }

  convertTime(time) {
    let date = new Date(time * 1000);
    return date;
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad RequestsPage');
  }

  view(request:item){
    this.navCtrl.push('RequestAcceptedPage',{item:request});
  }

}
