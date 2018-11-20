import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ActionSheetController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { NotifyProvider } from '../../providers/notify/notify';
import { UploadFormPage } from '../upload-form/upload-form';
import { LogsServiceProvider } from '../../providers/logs-service/logs-service';

@IonicPage()
@Component({
  selector: 'page-secondary-main',
  templateUrl: 'secondary-main.html',
})
export class SecondaryMainPage {
  @ViewChild('fileInput') fileInput;


  imageURI:any;
  
  constructor(
    private alertCtrl: AlertController,
    private actionSheetCtrl: ActionSheetController,
    public navCtrl: NavController,
    private notify: NotifyProvider,
    private logs:LogsServiceProvider,
    public navParams: NavParams,
    private camera: Camera) {
      this.logs.addLog('Secondary Main page constructor');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SecondaryMainPage');
  }

  uploadData(){
    // pop over show in a series
    // uplaod data in async promise
    // move to account page and show uploaded data
  }

  gotoNextPage(){
    if(this.imageURI){
      this.navCtrl.push(UploadFormPage,{image:this.imageURI});
    }else{
      this.notify.presentToast("Your object should have atleast 1 image");
    }
    
  }

  ngOnInit() {
    this.imageURI = '/assets/imgs/photo.jpg';
  }

  chooser() {
    console.log("Chooser");
    if(this.imageURI){
      this.notify.presentToast('Only 1 photos can be uploaded.');
      this.imageURI = "";
      return;
    }
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Add photo From',
      buttons: [
        {
          text: 'Camera',
          handler: () => {
            console.log('Camera');
            this.getImage(this.camera.PictureSourceType.CAMERA);
          }
        }, {
          text: 'Gallery',
          handler: () => {
            console.log('Gallery');
            this.getImage(this.camera.PictureSourceType.PHOTOLIBRARY);
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


  getImage(sourceType:number) {
    const options: CameraOptions = {
      quality: 100,
      allowEdit: true,
      sourceType:sourceType,
      targetWidth: 500,
      targetHeight: 500,
      correctOrientation:true,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      // this.base64Image = 'data:image/jpeg;base64,' + imageData;
      // this.image = this.base64Image;
      this.imageURI = imageData;
      console.log(this.imageURI);
    }, (err) => {
      // Handle error
      console.log(err);
      this.notify.presentToast(err);
      console.log('Image not loaded from phone');
      this.fileInput.nativeElement.click();
    });
  }

  processWebImage(event) {
    console.log('Opening file input mode...');
    let reader = new FileReader();
    reader.onload = (readerEvent) => {

      let imageData = (readerEvent.target as any).result;
      this.imageURI = imageData;
      console.log(this.imageURI);
    };
    reader.readAsDataURL(event.target.files[0]);
  }

  deletePhoto() {
    let confirm = this.alertCtrl.create({
      title: 'Alert',
      message: 'Are you sure you want to delete this image?',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Agree',
          handler: () => {
            this.imageURI = "";
          }
        }
      ]
    });
    confirm.present();
  }

  /* editPhoto(index) {
    console.log("Taking photo");
    const options: CameraOptions = {
      quality: 50,
      allowEdit: true,
      targetWidth: 300,
      targetHeight:300,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
      this.photos.reverse();
      this.photos.push(this.base64Image);
      this.photos.reverse();
    }, (err) => {
      // Handle error
    });
  } */


  viewPhoto(){
    // this.photoViewer.show(this.photos[index], 'My image title', {share: false});
  }

}
