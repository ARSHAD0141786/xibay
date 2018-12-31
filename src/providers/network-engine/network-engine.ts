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
import { NetworkUrls } from './networkUrls';

export interface Notification {
    notification:{
      title:string,
      body:string,
      sound:string,
      click_action:string,
      icon:string,
    },
    data:{
      click:string,
      code:number,
    },
    to:string,
    priority:string,
    restricted_package_name:string,
}

@Injectable()
export class NetworkEngineProvider {

  public static isConnected :boolean;
  
// public authentication = {
//   username:'',
//   token:''
// }

  private static classReference:any;

  constructor(public http: Http,
    private notify: NotifyProvider,
    private network: Network,
    private transfer:FileTransfer,
    private logs:LogsServiceProvider) {
    console.log('Hello NetworkEngineProvider Provider');
    NetworkEngineProvider.classReference = this;
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
      
      let headers:Headers = new Headers();
      headers.set('Content-type','application/json');
      headers.append('Authorization','key=AAAAhTcR7T0:APA91bFBrLN3PVG-iXsIc-5nVDf2MRFaBh8NnML38esvBG9sPK5l9mzNzmExyV1oHaffn35Mv0_UEYAr0tLZFZWnRNV4pKwOmqBOE5y6ADNeuafeO_r5-5ZTTJCTQs2MN-KdBASrHpvU1ysTPvKgz6ocmBwhobNwYQ');
      
      console.log(params);
      this.http.post('https://fcm.googleapis.com/fcm/send',params,{headers:headers}).subscribe( (res:any) => {
        console.log(res);
        if(res._body){
          let response = JSON.parse(res._body);
          console.log(response);
          if(response.success == 1 && response.failure == 0){
            console.log("Notification sent successfully");
          }
          resolve(response);
        }
      },(err) => {
        console.log(err);
        reject(err);
      });
    });
  }
  
  connectionSuscribtion(){
    this.network.onDisconnect().subscribe(() => {
      console.log('network was disconnected :-(');
      this.notify.presentToast('You are offline.Please check your network connection',1,3000);
      NetworkEngineProvider.isConnected = false;
    });
    this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      this.notify.presentToast("You're back online",2,3000);
      // We just got a connection but we need to wait briefly
       // before we determine the connection type. Might need to wait.
      // prior to doing any api requests as well.
      NetworkEngineProvider.isConnected = true;
    });  
  }

  get(endingUrl:string){
    this.logs.addLog("getRequest : "+NetworkUrls.BASE_URL+""+endingUrl);
    // return this.httpNetworkUrls.BASE_URL+endingUrl).timeout(3000);
    return new Promise((resolve,reject) => {
      this.logs.addLog("Generating promise");
      this.http.get(NetworkUrls.BASE_URL + endingUrl).subscribe( (res:any) => {
        try{
          console.log(res);
          if(res._body){
            resolve(JSON.parse(res._body));
          }else{
            reject(JSON.parse(JSON.stringify(res)));
          }
        }catch(error){
          console.log(error);
          reject(error);
        }
      }, err =>{
        console.log('network engine err');
        this.logs.addLog("err");        
        reject(err);
      })
    });
  }

  post(params,endingUrl){
    return new Promise((resolve, reject) =>{
      let headers = new Headers();
      headers.set('Content-type','application/json');
      headers.append('Authorization','username='+UserDataProvider.userPostData.username+'&token='+UserDataProvider.userPostData.token);
      console.log("POST:"+NetworkUrls.BASE_URL+endingUrl);
      console.log(params);
      this.http.post(NetworkUrls.BASE_URL+endingUrl,params, {headers: headers}).subscribe(res =>{
        try{
          let response:any = JSON.parse(JSON.stringify(res));
          if(response.status == 200){
            console.log(JSON.parse(response._body));
            let result = JSON.parse(response._body);
            if(result.data){
              if(result.data.length>0){
                for(let entry of result.data){//change the user_image_url because on database whole url is not saved
                  if(entry.image_url){
                    entry.image_url = NetworkUrls.BASE_URL+entry.image_url;
                  }
                  if(entry.user_image_url){
                    entry.user_image_url = NetworkUrls.BASE_URL+entry.user_image_url;
                  }
                }
              }
            }
            if(result.user_data && result.user_data.user_image_url){
              result.user_data.user_image_url = NetworkUrls.BASE_URL+ result.user_data.user_image_url;
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
      NetworkUrls.BASE_URL = 'http://'+url+'/xibay/public_html/';
      this.logs.addLog('Base url changed to : '+NetworkUrls.BASE_URL);
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
      console.log('Upload link : '+NetworkUrls.BASE_URL+link);
      this.logs.addLog('Upload link : '+NetworkUrls.BASE_URL+link);
      fileTransfer.upload(uploadFile,  NetworkUrls.BASE_URL + link, options)
        .then((data:any) => {
          console.log(data);
          try{
            let result:any = JSON.parse(data.response);
            this.logs.addLog('File uploaded successfully');
            this.logs.addLog(result.message);
            if(result.code == 786){
              if(result.user_data && result.user_data.user_image_url){
                result.user_data.user_image_url = NetworkUrls.BASE_URL + result.user_data.user_image_url;
              }
              resolve(result);
            }else{
              reject(result);
            }
          }catch(error){
            console.log(error);
            reject(error);
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
          NetworkEngineProvider.classReference.post(userPostData,'update-fcm-token');
        }
        
      }, function (error) {
        console.error(error);
      });
  
      (<any>window).FirebasePlugin.onNotificationOpen(function (notification) {
        console.log('notification received');
        console.log(notification);
        //control the notification here by the tap value
        //case I : when app in foreground then three main parameters received : tap:false,title,body
        // handel notification here
        if(!notification.tap){
          // NetworkEngineProvider.classReference.notify.presentToast('Foreground Notification received : '+JSON.stringify(notification));
          NetworkEngineProvider.classReference.notify.presentToast(notification.title+'  :  '+notification.body,3,null,true);
        }
  
        //case II: when app in background then many main parameters are received : time ,tap,etc.
        if(notification.tap){
          NetworkEngineProvider.classReference.notify.presentToast('Background notification received : '+JSON.stringify(notification));
        }
  
      }, function (error) {
        console.error(error);
      });

      if(!(UserDataProvider.userPostData && UserDataProvider.userPostData.username)){
        console.log('Unregister this user from this app');
        UserDataProvider.fcmToken = null;
        NetworkEngineProvider.classReference.notify('Unregister this user from receiving notifications');
        (<any>window).FirebasePlugin.unregister();
      }

  
    }catch(err){
    console.log(err);
  }
  }
}
