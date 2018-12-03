import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Refresher} from 'ionic-angular';
import { NetworkEngineProvider } from '../../providers/network-engine/network-engine';
import { UserDataProvider } from '../../providers/user-data/user-data';
import { item } from '../../interfaces/posted_item';
import { RequestAcceptedPage } from '../request-accepted/request-accepted';

@IonicPage()
@Component({
  selector: 'page-requests',
  templateUrl: 'requests.html',
})
export class RequestsPage {

  refresherPresent:boolean;
  refresher:Refresher;
  networkConnected:boolean;
  public requests:Array<item>;
  constructor(public navCtrl: NavController, public navParams: NavParams, private networkEngine: NetworkEngineProvider,private userData: UserDataProvider) {
    this.fetchRequests();
  }

  doRefresh(refresher:Refresher){
    this.refresher = refresher;
    this.refresherPresent = true;
    this.fetchRequests();
  }

  fetchRequests(){
    this.networkEngine.post(this.userData.getUserPostData(),'fetch-requested-products').then( (result:any) =>{
      this.networkConnected = true;
      if(result.data.length > 0){
        this.requests = result.data;
      }
      if(this.refresherPresent == true){
        this.refresher.complete();
      }
    },(err) => {
      console.log(err);
      this.requests = undefined;
      if(this.refresherPresent == true){
        this.refresher.complete();
      }
      if(err.status ==0){
        this.networkConnected = false;
      }
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
    this.navCtrl.push(RequestAcceptedPage,{item:request});
  }

}
