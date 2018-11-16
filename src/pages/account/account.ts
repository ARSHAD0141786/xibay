import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { NotifyProvider } from '../../providers/notify/notify';
import { NetworkEngineProvider } from '../../providers/network-engine/network-engine';
import { UserDataProvider } from '../../providers/user-data/user-data';

/**
 * Generated class for the AccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {

  /**
   * branch_name: "Computer Science"
   * username: "arshad"
  gender: "M"
  name: "Mohammed Arshad"
  phone_number: "8441975563"
  user_image_url: "http://localhost/xibay/public_html/photo/img-20180513-5af7d3c05ba4eionicfile.jpg"
  year: "Final"
   */

  private account:any = {
    username:'',
    gender:'',
    name:'',
    phone_number:'',
    user_image_url:'',
    year:'',
    branch_name:''
  }

  private requests = {

  }
  private userAuth: any = { username: '', token: '' };

  constructor(
    public navCtrl: NavController,
    private notify: NotifyProvider,
    public menu: MenuController,
    private userData: UserDataProvider,
    private networkEngine: NetworkEngineProvider,
    public navParams: NavParams) {
    this.notify.presentLoading("Loading...");
    this.userData.getUsername().then((username: string) => {
      this.userData.getToken().then((token: string) => {
        this.notify.closeLoading();
        this.notify.presentLoading("Please wait..");
        this.userAuth.username = username;
        this.userAuth.token = token;
        this.networkEngine.post(this.userAuth, 'get-user-data').then(
          (result: string) => {
            this.notify.closeLoading();
            let data = JSON.parse(result);
            if (data._body) {
              data = JSON.parse(data._body).data[0];
              console.log('Data from get-user-detaisl : ');
              console.log(data);
              if (data) {
                this.account = data;
              }
            }
          },
          (err) => {
            this.notify.closeLoading();
            console.log(err);
          }
        );
      });
    });

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
    console.log('ionViewDidLoad AccountPage');
  }

}
