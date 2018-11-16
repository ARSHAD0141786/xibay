import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-camera',
  templateUrl: 'camera.html',
})
export class CameraPage {

  public photos: any;
  public base64Image: string;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public alertCtrl:AlertController,
    private camera: Camera) {
  }

  ngOnInit() {
    this.photos = [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CameraPage');
  }

  takePhoto() {
    console.log("Taking photo");
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.base64Image = 'data:image/jpeg;base64,' + imageData;
      this.photos.push(this.base64Image);
      this.photos.reverse();
    }, (err) => {
      // Handle error
    });
  }

  deletePhoto(index) {
    let confirm = this.alertCtrl.create({
      title: 'Alert',
      message: 'Are you sure to delete this image?',
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
            this.photos.splice(index,1);
          }
        }
      ]
    });
    confirm.present();
  }

}
