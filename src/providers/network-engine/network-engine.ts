// import { HttpClient } from '@angular/common/http';
import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { LogsServiceProvider } from '../../providers/logs-service/logs-service';

import 'rxjs/add/operator/timeout'
import 'rxjs/add/operator/map';
import { Network } from '@ionic-native/network';
// import { NotifyProvider } from '../notify/notify';
import { FileTransferObject, FileUploadOptions, FileTransfer } from '@ionic-native/file-transfer';
import { NotifyProvider } from '../notify/notify';
import { UserDataProvider } from '../user-data/user-data';

export interface Notification {
    notification_body:{
      title:string,
      body:string,
      sound?:'default',
      click_action?:null,
      icon?:"icon"
    },
    data:{
      click?:string,
      code:number,
    },
    to_user:string,
    priority?:"high",
    restricted_package_name?:"com.xibay.android"
}

@Injectable()
export class NetworkEngineProvider {

  public static isConnected :boolean;
  public BASE_URL = 'http://localhost/xibay/public_html/';
// public BASE_URL = 'http://192.168.43.50/xibay/public_html/';
  
// public authentication = {
//   username:'',
//   token:''
// }

  constructor(public http: Http,
    private notify: NotifyProvider,
    private network: Network,
    private transfer:FileTransfer,
    private logs:LogsServiceProvider) {
    console.log('Hello NetworkEngineProvider Provider');
    this.connectionSuscribtion();
    this.notificationInit();
    console.log(this.network.type);
    NetworkEngineProvider.isConnected = navigator.onLine;
    if(NetworkEngineProvider.isConnected == false){
      this.notify.presentToast('No Internet access! Please connect to Internet');
    }
  }

  sendNotificationToParticularPerson(params:Notification){
    return new Promise( (resolve,reject) => {
      let options:any = {
        'Content-Type':'application/json',
        'Authorization':'key=AAAAhTcR7T0:APA91bFBrLN3PVG-iXsIc-5nVDf2MRFaBh8NnML38esvBG9sPK5l9mzNzmExyV1oHaffn35Mv0_UEYAr0tLZFZWnRNV4pKwOmqBOE5y6ADNeuafeO_r5-5ZTTJCTQs2MN-KdBASrHpvU1ysTPvKgz6ocmBwhobNwYQ'
      }
      let headers = new Headers(options);
      console.log(params);
      this.http.post('https://fcm.googleapis.com/fcm/send',params,{headers:headers}).subscribe( res => {
        console.log(res);
        resolve();
      },(err) => {
        console.log(err);
        reject();
      });
    });
  }
  
  connectionSuscribtion(){
    this.network.onDisconnect().subscribe(() => {
      console.log('network was disconnected :-(');
      this.notify.presentToast('Network was disconnected :-( ');
      NetworkEngineProvider.isConnected = false;
    });
    this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      this.notify.presentToast("You're back online :-)");
      // We just got a connection but we need to wait briefly
       // before we determine the connection type. Might need to wait.
      // prior to doing any api requests as well.
      NetworkEngineProvider.isConnected = true;
    });  
  }

  get(endingUrl:string){
    this.logs.addLog("getRequest : "+this.BASE_URL+""+endingUrl);
    // return this.http.get(BASE_URL+endingUrl).timeout(3000);
    return new Promise((resolve,reject) => {
      this.logs.addLog("Generating promise");
      this.http.get(this.BASE_URL + endingUrl).
      subscribe( res => {
        console.log('network engine res');
        this.logs.addLog("res");
        resolve(JSON.stringify(res));
      }, (err) =>{
        console.log('network engine err');
        this.logs.addLog("err");        
        reject(err);
      }, () => {
        console.log('Success network request');
        this.logs.addLog("Clean");        
      });
    });
  }

  post(params,endingUrl){
    return new Promise((resolve, reject) =>{
      let headers = new Headers();
      console.log("POST:"+this.BASE_URL+endingUrl);
      console.log('Parameters are : ');
      console.log(params);
      this.logs.addLog("postRequest : "+this.BASE_URL+""+endingUrl);
      this.logs.addLog(JSON.stringify(params));
      this.http.post(this.BASE_URL+endingUrl,params, {headers: headers}).
      subscribe(res =>{
        console.log('Entered into network engine');
        let response:any = JSON.parse(JSON.stringify(res));
        try{
          if(response.status == 200){
            console.log(JSON.parse(response._body));
            let result = JSON.parse(response._body);
            if(result.data){
              if(result.data.length>0){
                for(let entry of result.data){
                  if(entry.image_url){
                    entry.image_url = this.BASE_URL+entry.image_url;
                  }
                  if(entry.user_image_url){
                    entry.user_image_url = this.BASE_URL+entry.user_image_url;
                  }
                }
              }
            }
            if(result.user_data && result.user_data.user_image_url){
              result.user_data.user_image_url = this.BASE_URL+ result.user_data.user_image_url;
            }
            resolve(result);
          }else{
            console.log('status : '+response.status);
            resolve(response._body);
          }
        }catch(e){
          console.log(e);
          console.log(res);
        }
      }, (err) =>{
        console.log('network engine err');
        this.logs.addLog("err");
        this.notify.presentToast('Cannot connect with server or Internal server error');
        reject(err);
      });
    });
  }

  changeBaseUrl(url:string){
    if(url != ""){
      this.BASE_URL = 'http://'+url+'/xibay/public_html/';
      this.logs.addLog('Base url changed to : '+this.BASE_URL);
    } 
  }

  uploadFile(uploadFile:any,userAuth:any,uploadLink?:string,formData?:any) {
    this.logs.addLog('Uploading file....');
    return new Promise( (resolve,reject) => {
      this.logs.addLog('Uploading file 2....');
      console.log(userAuth);
      if(formData){
        console.log(formData);
      }
      this.logs.addLog(JSON.stringify(userAuth));
      this.logs.addLog(JSON.stringify(formData));
      const fileTransfer: FileTransferObject = this.transfer.create();
      let data = {
        form_data:formData,
        username:userAuth.username,
        token:userAuth.token
      };
      let uploadData = JSON.stringify(data);
      let options: FileUploadOptions = {
        fileKey: 'ionicfile',
        fileName: 'ionicfile',
        chunkedMode: false,
        mimeType: "image/jpeg",
        headers: {},
        params:{
          uploadData
        }
      }
      this.logs.addLog(JSON.stringify(options));
      console.log(JSON.stringify(options));
      console.log(options);
      let link:string = 'upload-file-with-data';
      if(uploadLink){
        link = uploadLink;
      }
      console.log('Upload link : '+this.BASE_URL+link);
      this.logs.addLog('Upload link : '+this.BASE_URL+link);
      fileTransfer.upload(uploadFile,  this.BASE_URL + link, options)
        .then((data:any) => {
          console.log(data);
          console.log(data.response);
          let result:any = JSON.parse(data.response);
          this.logs.addLog('File uploaded successfully');
          this.logs.addLog(result.message);
          if(result.code == 786){
            resolve(result);
          }else{
            reject(result);
          }
      }, (err) => {
        console.log(err);
        this.logs.addLog('Error in uploading data......');
        this.logs.addLog(JSON.stringify(err));
        reject(err);
      });

      fileTransfer.onProgress( (progressevent) => {
        console.log(progressevent);
        console.log('Progress');
        this.logs.addLog(progressevent.toString());
      });
    
    });
  }

  notificationInit(){
    console.log('initialize notifications');

    // (<any>window).FirebasePlugin.getToken(function (token) {
    //   // save this server-side and use it to push notifications to this device
    //   console.log('token');
    //   if(UserDataProvider.fcmToken){
    //     this.setFCMToken(token);
    //   }
    //   console.log(token);
    // }, function (error) {
    //   console.error(error);
    // });

    //this function is also do the the work of above function
    try{
      (<any>window).FirebasePlugin.onTokenRefresh(function (token) {
        // save this server-side and use it to push notifications to this device
        console.log('refresh token');
        console.log(token);
        UserDataProvider.fcmToken = token;
        if(token && UserDataProvider.userPostData && UserDataProvider.userPostData.username && UserDataProvider.userPostData.token){
          let userPostData:any = {
            username:UserDataProvider.userPostData.username,
            token:UserDataProvider.userPostData.token,
            fcmToken:token,
          }
          this.post(userPostData,'update-fcm-token');
        }
        
      }, function (error) {
        console.error(error);
      });
  
      (<any>window).FirebasePlugin.onNotificationOpen(function (notification) {
        console.log('notification received');
        console.log(notification);
        //control the notification here by the tap value
        //case I : when user is on xibay then three main parameters received : tap:false,title,body
  
  
        //case II: when user is not on xibay then many main parameters are received : time ,tap,etc.
  
  
      }, function (error) {
        console.error(error);
      });
  
    }catch(err){
    console.log(err);
  }
  }
}
