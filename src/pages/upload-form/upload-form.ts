import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NetworkEngineProvider } from '../../providers/network-engine/network-engine';
import { NotifyProvider } from '../../providers/notify/notify';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer'
import { UserDataProvider } from '../../providers/user-data/user-data';
import { LogsServiceProvider } from '../../providers/logs-service/logs-service';

@IonicPage()
@Component({
  selector: 'page-upload-form',
  templateUrl: 'upload-form.html',
})
export class UploadFormPage {

  private userAuth = {
    username:'',
    token:''
  }
  years: Array<{id:number,name:string}>;
  categories: Array<{id:number,name:string}>;
  branches: Array<{id:number,name:string}>;

  constructor(
    private networkEngine: NetworkEngineProvider,
    public navCtrl: NavController, 
    private logs:LogsServiceProvider,
    private notify:NotifyProvider,
    private userData:UserDataProvider,
    private transfer:FileTransfer,    
    public navParams: NavParams) {
      // console.log("Starting new page of upload data");
    // console.log(this.navParams.data);

    this.notify.presentLoading("Please wait...");
    this.userData.getUsername().then((username:string)=>{
      this.userAuth.username = username;
      this.userData.getToken().then((token)=>{
        this.userAuth.token = token;
      });
    });
      this.networkEngine.get('get-year-category-branch').then((result:string) =>{
        let data = JSON.parse(result);
        this.notify.closeLoading();
        if(data._body){
          let response = JSON.parse(data._body);
          if(response.message){
            if(response.branch){
              this.branches = response.branch;
            }
            console.log(this.branches);
            if(response.year){
              this.years = response.year;
            }
            console.log(this.years);
            if(response.categories){
              this.categories = response.categories;
            }
            console.log(this.categories);
          }else{
            this.notify.presentToast("Sorry! unable to process the request");
          }
        }
      },
      (err:any)=>{
        this.notify.closeLoading();
        console.log(err);
        this.notify.presentToast("Error : "+ err);
    });
  }

  // get dynamic values in respective arrays
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad UploadFormPage');
  }

/*   submit(value: any){
    console.log("Submitting form");
    let data: any;
    data = {"username":localStorage.getItem('username'),"token":localStorage.getItem('token'),"image":this.navParams.data,"form_data":JSON.stringify(value)};
    console.log(data);

    this.networkEngine.post(data, "post-data").then((result:string) => {
      this.notify.closeLoading();
      this.responseData = JSON.parse(JSON.parse(result)._body);
      this.notify.closeLoading();
      console.log(this.responseData);
      // this.logs.addLog(JSON.parse(JSON.parse(this.resposeData)).code);
      
    }, (err) => {
      //Connection failed message
      console.log(err.status);
      if(err.status != 0){
        this.responseData = JSON.parse(err._body);
      }else{
        this.responseData = err;
      }
      console.log(this.responseData);
      if(this.responseData.Error){
        if(this.responseData.code){
          this.notify.presentToast(this.responseData.Error);
        }else if(this.responseData.Error.split(':')[0]){
          let error = this.responseData.Error.split(':')[0].split('[')[1].split(']')[0];
          let field = this.responseData.Error.split('key ')[1];
          console.log(field);
          if(error == '23000'){
            this.notify.presentToast(field + " already registered");    
          }else if(error == ''){
          }else if(error == ''){
          }else if(error == ''){
          }else if(error == ''){

          }else{
            this.notify.presentToast("Connection failed");
          }
        }
      }else if(this.responseData.Message){
        this.notify.presentToast(this.responseData.Message);
      }else{
        this.notify.presentToast("Connection failed");
      }
      this.notify.closeLoading();
      // this.notify.presentToast("Connection failed");
      //Connection failed message
      // this.notify.presentToast("Connection failed");
      // this.logs.addLog("Error : " + JSON.stringify(err));
      // this.notify.closeLoading();
    });
  }
 */
  uploadFile(value:any) {
  //  this.notify.presentLoading("Uploading data");
  //  console.log(this.navParams.get('image'));
  //  return;
    const fileTransfer: FileTransferObject = this.transfer.create();
    console.log("Form data : "+JSON.stringify(value));
    this.logs.addLog("Form data : "+JSON.stringify(value));
    let data = {username:this.userAuth.username,token:this.userAuth.token,form_data:value};
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
  
    fileTransfer.upload(this.navParams.get('image'), this.networkEngine.BASE_URL + 'post-data', options)
      .then((data:any) => {
        this.logs.addLog("File uploading : "+JSON.stringify(data));
        this.notify.closeLoading();
        if(data.message){
          console.log(JSON.stringify(data));
          console.log(this.navParams.get('image'));
          console.log(" Uploaded Successfully");
          // this.notify.presentToast("Data.message received : "+JSON.stringify(data.message));
          // this.notify.presentToast(JSON.stringify(data));
          this.notify.presentToast("Successfully uploaded.");
          
        }else if(data.error){
          console.log(data.error);
          this.notify.presentToast("Error : "+data.error);
        }
        this.navCtrl.popToRoot();
        // this.notify.presentToast("Data : "+JSON.stringify(data));
    }, (err) => {
      console.log(err);
      // loader.dismiss();
      this.logs.addLog("Error : "+ err);
      this.notify.closeLoading();
      this.notify.presentToast("Error : "+err);
    });
  }

  goBack(){
    this.navCtrl.pop();
  }
}
