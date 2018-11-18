import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular/umd';
import { LogsServiceProvider } from '../../providers/logs-service/logs-service';

/**
 * Generated class for the DebugLogsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-debug-logs',
  templateUrl: 'debug-logs.html',
})
export class DebugLogsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,private logService:LogsServiceProvider) {
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad DebugLogsPage');
  }
}
