import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
// import { WelcomePage } from '../welcome/welcome';
import { LogsServiceProvider } from '../../providers/logs-service/logs-service';
import { NotifyProvider } from '../../providers/notify/notify';

@IonicPage()
@Component({
  selector: 'page-primary-main',
  templateUrl: 'primary-main.html',
})
export class PrimaryMainPage {
  public data: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public notify: NotifyProvider,
    private Logs:LogsServiceProvider) {
      this.data = this.navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MainPage');
    this.Logs.addLog('Login page loaded successfully');
  }
}