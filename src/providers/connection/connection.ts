import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
import { Platform } from 'ionic-angular/umd';


declare var navigator: any;
declare var Connection: any;

@Injectable()
export class ConnectionProvider {

  public connectionVariable:boolean;
  constructor(public network:Network,public platform:Platform) {
    console.log('Hello ConnectionProvider Provider');
  }


  getConnection(){
    console.log('Checking connection');
    this.network.onDisconnect().subscribe(() => {
      console.log('network was disconnected :-(');
      this.connectionVariable = false;
      return false;
    });

    this.network.onConnect().subscribe(() => {
      console.log('Back Online');
      this.connectionVariable = true;
      return true;
    });

    // return this.connectionVariable;
  }

  checkNetwork() {
    this.platform.ready().then(() => {
      // console.log(this.network.type.toString());
        /* var networkState = navigator.connection.type;
        console.log(networkState);
        var states = {};
        states[Connection.UNKNOWN]  = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]     = 'WiFi connection';
        states[Connection.CELL_2G]  = 'Cell 2G connection';
        states[Connection.CELL_3G]  = 'Cell 3G connection';
        states[Connection.CELL_4G]  = 'Cell 4G connection';
        states[Connection.CELL]     = 'Cell generic connection';
        states[Connection.NONE]     = 'No network connection';
        if(networkState == Connection.UNKNOWN){
          this.notify.presentToast('Unknown connection');
          return false;
        }else if(networkState == Connection.NONE){
          this.notify.presentToast('No network connection');
          return false;
        }else{
          return true;
        } */
    });
  }
}
