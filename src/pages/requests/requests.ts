import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Refresher} from 'ionic-angular';
import { NetworkEngineProvider } from '../../providers/network-engine/network-engine';
import { item } from '../../interfaces/posted_item';
import { RequestAcceptedPage } from '../request-accepted/request-accepted';
import { NetworkUrls } from '../../providers/network-engine/networkUrls';

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
  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private networkEngine: NetworkEngineProvider) {
    this.fetchRequests();
  }

  doRefresh(refresher:Refresher){
    this.refresher = refresher;
    this.refresherPresent = true;
    this.fetchRequests();
  }

  fetchRequests(){
    this.networkEngine.post(null,NetworkUrls.FETCH_MY_REQUESTS).then( (result:any) =>{
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
