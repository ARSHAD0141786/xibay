import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, ActionSheetController, AlertController, ModalController, PopoverController, ViewController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { NetworkEngineProvider } from '../../providers/network-engine/network-engine';
import { UserDataProvider } from '../../providers/user-data/user-data';
import { User } from '../../interfaces/user';
import { LogsServiceProvider } from '../../providers/logs-service/logs-service';

@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {
  @ViewChild('fileInput') fileInput;
  isReadyToSave: boolean = false;
  item: any;
  year:string;
  public user:User;
  isProfilePicUploading:boolean;
  profilePicUploadingPercentage:number=0;
  private profilePicData:any;

  branches: any = [
    'ARC',
    'CH',
    'CIV',
    'CSE',
    'EE',
    'ECC',
    'ECE',
    'EEE',
    'IT',
    'ME',
    'MI',
    'P&I'
  ];

  constructor(
    public navCtrl: NavController,
    public menu: MenuController,
    private userData: UserDataProvider,
    private networkEngine: NetworkEngineProvider,
    private alertCtrl:AlertController,
    private logs:LogsServiceProvider,
    public popoverCtrl:PopoverController,
    private modalCtrl:ModalController,
    private actionSheetCtrl:ActionSheetController,
    public camera: Camera,
    public navParams: NavParams) {
         
  }

 
  editName(){
    let alert = this.alertCtrl.create({
      title: 'Edit name :',
      inputs: [
        {
          name: 'name',
          placeholder: 'enter name',
          type:'text',
          value:this.user.name
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Done',
          handler:data=>{
            this.user.name = data.name;
            this.isReadyToSave = true;
          }
        }
      ]
    });
    alert.present();
  } 

  editPhone(){
    let alert = this.alertCtrl.create({
      title: 'Edit phone number :',
      inputs: [
        {
          name: 'number',
          placeholder: 'enter new phone number',
          type:'number',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Done',
          handler:data=>{
            this.verifyPhoneNumber(data.number).then( (value:string )=> {
              if(value == data.number){
                console.log('Phone number will be changed after save button clicked');
                this.user.phone_number = value;
                this.isReadyToSave = true;
              }else{
                console.log('Something went wrong');
              }
            })
          }
        }
      ]
    });
    alert.present();
  }

  verifyPhoneNumber(phone:number):Promise<string>{
    return new Promise( (resolve) => {
      let otp_modal = this.modalCtrl.create('OtpValidationPage',{wantUserToExists:false,phone:phone});
      otp_modal.onDidDismiss( value => {
        resolve(value);
      });
      otp_modal.present();
    });
  }

  uploadProfilePic(){
    this.isProfilePicUploading = true;
    let userAuth:any = {
      username:this.userData.getUserPostData().username,
      token:this.userData.getUserPostData().token
    }
    this.networkEngine.uploadFile(this.profilePicData,userAuth,'upload-profile-picture').then( (result) => {
      console.log(result);
      this.user.user_image_url = this.profilePicData;
      this.isProfilePicUploading = false;
    },(error) => {
      this.isProfilePicUploading = false;
      alert('Unable to upload photo'+error);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountPage');
    let userAuth:any = {
      username:this.userData.getUserPostData().username,
      token:this.userData.getUserPostData().token
    }
      
    this.networkEngine.post(userAuth, 'get-user-data').then( (result: any) => {
      if(result.data){
        this.user = result.data[0];
      }
    },
    (err) => {
      console.error(err);
    });
  }

  getPicture() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Add photo From',
      buttons: [
        {
          text: 'Camera',
          handler: () => {
            console.log('Camera');
            this.openCamera(this.camera.PictureSourceType.CAMERA);
          }
        }, {
          text: 'Gallery',
          handler: () => {
            console.log('Gallery');
            this.openCamera(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        }, {
          text: 'Cancel',
          role: 'destructive',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  openCamera(sourceType:number) {
    if (Camera['installed']()) {
      this.camera.getPicture({
        destinationType: this.camera.DestinationType.DATA_URL,
        quality: 100,
        allowEdit: true,
        sourceType:sourceType,
        targetWidth: 500,
        targetHeight: 500,
        saveToPhotoAlbum:false,
        correctOrientation:true,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      }).then((data) => {
        this.profilePicData = 'data:image/jpg;base64,' + data;
        this.logs.addLog('Photo uploaded');
        console.log(this.profilePicData);
        this.uploadProfilePic();
      }, (err) => {
        alert('Unable to take photo');
        console.log(err);
      })
    } else {
      this.fileInput.nativeElement.click();
    }
  }

  processWebImage(event) {
    console.log('Opening file input mode...');
    console.log(event);
    let reader = new FileReader();
    reader.onload = (readerEvent) => {

      let imageData = (readerEvent.target as any).result;
      this.profilePicData = imageData;
      this.uploadProfilePic();
    };
    try{
      reader.readAsDataURL(event.target.files[0]);
    }catch(err){
      alert('Unable to take photo');
      console.log(err);
    } 
  }

  saveDetails(){
    if(this.year){
    this.user.year = Number.parseInt(this.year);
    }
    
    let data:any = {
      username:this.userData.getUserPostData().username,
      token:this.userData.getUserPostData().token,
      branch:this.user.branch,
      phone:this.user.phone_number,
      year:this.user.year,
      name:this.user.name,
    }
    this.networkEngine.post(data,'update-user-details').then( (result:any) => {
      if(result.code == 786){
        console.log(result.message);
        this.userData.setUserData(result);
      }else{
        console.log(result);
      }
    },err => {
      console.error(err);
    });
  }


  presentMore(event:any){
    let popover = this.popoverCtrl.create(PopOverAccount,{username:this.user.username,phoneNumber:this.user.phone_number});
    popover.present({
      ev:event
    });
  }


}


@Component({
  templateUrl:'popover.html'
})
export class PopOverAccount{
  username:string;
  phoneNumber:string;
  constructor(private modalCtrl:ModalController,private viewCtrl:ViewController,private navParams:NavParams){
  }
  ionViewDidLoad(){
    this.username = this.navParams.get('username');
    this.phoneNumber = this.navParams.get('phoneNumber');
  }
  changePassword(){
    let otp_modal = this.modalCtrl.create('OtpValidationPage',{wantUserToExists:true,phone:this.phoneNumber});
    otp_modal.onDidDismiss(phoneNumber => {
      console.log('OTP Verified : ' + phoneNumber);
      if(phoneNumber){
        //load forgotcredential modal
        let forgot_credential_modal = this.modalCtrl.create('ForgotCredentialsPage',{phone:phoneNumber,username:this.username});
        forgot_credential_modal.present();
      }
    });
    otp_modal.present();
  }
}

