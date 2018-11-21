// import { HttpClient } from '@angular/common/http';
import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { LogsServiceProvider } from '../../providers/logs-service/logs-service';

import 'rxjs/add/operator/timeout'
import 'rxjs/add/operator/map';
import { NotifyProvider } from '../notify/notify';
import { FileTransferObject, FileUploadOptions, FileTransfer } from '@ionic-native/file-transfer';
import { database } from '../../../node_modules/firebase';


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
    private transfer:FileTransfer,
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
      console.log('Parameters are : ');
      console.log(params);
      this.logs.addLog("postRequest : "+this.BASE_URL+""+endingUrl);
      this.logs.addLog(JSON.stringify(params));
      this.http.post(this.BASE_URL+endingUrl,params, {headers: headers}).
      subscribe(res =>{
        console.log('Entered into network engine');
        this.notify.closeLoading();
        let response:any = JSON.parse(JSON.stringify(res));
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
          resolve(result);
        }else{
          console.log('status : '+response.status);
          resolve(response._body);
        }
      }, (err) =>{
        console.log('network engine err');
        this.logs.addLog("err");        
        this.notify.closeLoading();
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
      if(!uploadLink){
        uploadLink = 'upload-file-with-data';
      }
      fileTransfer.upload(uploadFile,  this.BASE_URL + uploadLink, options)
        .then((data:any) => {
          console.log(data);
          this.logs.addLog('File uploaded : '+data);
          if(data.code == 786){
            resolve(data);
          }else{
            reject(data);
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

}
