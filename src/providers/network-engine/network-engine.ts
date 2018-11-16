// import { HttpClient } from '@angular/common/http';
import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { LogsServiceProvider } from '../../providers/logs-service/logs-service';
import { Storage } from '@ionic/storage';

import 'rxjs/add/operator/timeout'
import 'rxjs/add/operator/map';
import { NotifyProvider } from '../notify/notify';
import { UserDataProvider } from '../user-data/user-data';


@Injectable()
export class NetworkEngineProvider {

public BASE_URL = 'http://localhost/xibay/public_html/';
// public BASE_URL = 'http://192.168.43.50/xibay/public_html/';
  
// public authentication = {
//   username:'',
//   token:''
// }

  constructor(public http: Http,
    private notify: NotifyProvider,
    private logs:LogsServiceProvider) {
    console.log('Hello NetworkEngineProvider Provider');
      // this.getAuthentication();
  }

  // getAuthentication(){
  //   console.log("Getting auth");
  //   this.userData.getUsername().then((username)=>{
  //     this.authentication.username = username;
  //     this.userData.getToken().then((token)=>{
  //       this.authentication.token = token;
  //     });
  //   });
  // }
  
  get(endingUrl:string){
    this.logs.addLog("getRequest : "+this.BASE_URL+""+endingUrl);
    // return this.http.get(BASE_URL+endingUrl).timeout(3000);
    return new Promise((resolve,reject) => {
      this.logs.addLog("Generating promise");
      this.http.get(this.BASE_URL + endingUrl).
      subscribe( res => {
        console.log('network engine res');
        this.logs.addLog("res");
        this.notify.closeLoading();
        resolve(JSON.stringify(res));
      }, (err) =>{
        console.log('network engine err');
        this.logs.addLog("err");        
        this.notify.closeLoading();
        reject(err);
      }, () => {
        console.log('Success network request');
        this.logs.addLog("Clean");        
        this.notify.closeLoading();
      });
    });
  }

  post(params,endingUrl){
    return new Promise((resolve, reject) =>{
      let headers = new Headers();
      console.log("POST:"+this.BASE_URL+endingUrl);
      console.log("PARAMS:"+JSON.stringify(params));
      this.logs.addLog("postRequest : "+this.BASE_URL+""+endingUrl);
      this.logs.addLog(JSON.stringify(params));
      this.http.post(this.BASE_URL+endingUrl,params, {headers: headers}).
      subscribe(res =>{
        console.log('network engine res');
        this.logs.addLog("res");
        this.notify.closeLoading();
        resolve(JSON.stringify(res));
      }, (err) =>{
        console.log('network engine err');
        this.logs.addLog("err");        
        this.notify.closeLoading();
        reject(err);
      }, () => {
        console.log('Success');
        this.logs.addLog("Clean");        
        this.notify.closeLoading();
      });
    });
  }

  changeBaseUrl(url:string){
    if(url != ""){
      this.BASE_URL = 'http://'+url+'/xibay/public_html/';
      this.logs.addLog('Base url changed to : '+this.BASE_URL);
    }
    
  }

}
