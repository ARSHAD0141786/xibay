import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, ModalController, ActionSheetController } from 'ionic-angular';
import { NotifyProvider } from '../../providers/notify/notify';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { NetworkEngineProvider } from '../../providers/network-engine/network-engine';
import { UserDataProvider } from '../../providers/user-data/user-data';

@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {
  @ViewChild('fileInput') fileInput;

  isReadyToSave: boolean;

  item: any;

  // form: FormGroup;
  /**
  branch_name: "Computer Science"
  username: "arshad"
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

  isProfilePicUploading:boolean = false;
  profilePicUploadingPercentage:number=0;
  private profilePicData:any;

  constructor(
    public navCtrl: NavController,
    public menu: MenuController,
    private userData: UserDataProvider,
    private networkEngine: NetworkEngineProvider,
    private actionSheetCtrl:ActionSheetController,
    public camera: Camera,
    public navParams: NavParams) {
      
      let userAuth:any = {
        username:this.userData.getUserPostData().username,
        token:this.userData.getUserPostData().token
      }
        
      this.networkEngine.post(userAuth, 'get-user-data').then(
        (result: any) => {
          console.log(result);
            let data = result.data[0];
            if (data) {
              this.account = data;
            }
            console.log(this.account);
        },
        (err) => {
          console.error(err);
        });
  }

  uploadProfilePic(){
    this.isProfilePicUploading = true;
    let userAuth:any = {
      username:this.userData.getUserPostData().username,
      token:this.userData.getUserPostData().token
    }
    this.networkEngine.uploadFile(this.profilePicData,userAuth,'upload-profile-picture').then( (result) => {
      this.isProfilePicUploading = false;
      this.account.user_image_url = this.profilePicData;
    },(error) => {
      this.isProfilePicUploading = false;
      alert('Unable to upload photo'+error);
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
        correctOrientation:true,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      }).then((data) => {
        this.profilePicData = 'data:image/jpg;base64,' + data;
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

  getProfileImageStyle(value) {
    return 'url(' + value + ')'
  }
  
}
