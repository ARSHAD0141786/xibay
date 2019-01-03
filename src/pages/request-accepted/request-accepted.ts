import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { item } from '../../interfaces/posted_item';
import { User } from '../../interfaces/user';
import { NetworkEngineProvider } from '../../providers/network-engine/network-engine';
import { NetworkUrls } from '../../providers/network-engine/networkUrls';

@IonicPage()
@Component({
  selector: 'page-request-accepted',
  templateUrl: 'request-accepted.html',
})
export class RequestAcceptedPage {

  private item:item;
  public user:User;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private networkEngine:NetworkEngineProvider) {
    this.item = navParams.get('item');
    console.log(this.item);
    let userPostData:any = {
      item_id:this.item.id
    }
    this.networkEngine.post(userPostData,NetworkUrls.FETCH_ACCEPTED_USER_DETAILS).then( (result:any) => {
      this.user = result.data[0];
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RequestAcceptedPage');
  }

  convertTime(time) {
    let date = new Date(time * 1000);
    return date;
  }


}
