import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { IonicPage, NavController, ViewController, ActionSheetController, ModalController } from 'ionic-angular';
import { UserDataProvider } from '../../providers/user-data/user-data';
import { NetworkEngineProvider } from '../../providers/network-engine/network-engine';
import { LogsServiceProvider } from '../../providers/logs-service/logs-service';
import { ResourceLoader } from '../../../node_modules/@angular/compiler';
@IonicPage()
@Component({
  selector: 'page-post-product',
  templateUrl: 'post-product.html',
})
export class PostProductPage {
  @ViewChild('fileInput') fileInput;

  isFormSubmitted:boolean = false;
  item: any;

  form: FormGroup;

  constructor(public navCtrl: NavController,private logs:LogsServiceProvider ,private networkEngine:NetworkEngineProvider, private userData:UserDataProvider ,public mdlCtrl:ModalController, public actionSheetCtrl: ActionSheetController, public viewCtrl: ViewController, formBuilder: FormBuilder, public camera: Camera) {
    this.form = formBuilder.group({
      productPic: [''],
      title: ['', Validators.required],
      description:['',Validators.required],
      category:['',Validators.required],
      useful_year:['',Validators.required],
      useful_branch:['',Validators.required],
    });
    this.logs.addLog('Entered into post product');
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      
    });
  }

  ionViewDidLoad() {

  }

  postProduct(){
    this.isFormSubmitted = true;
    let userAuth:any = {
      username:this.userData.getUserPostData().username,
      token:this.userData.getUserPostData().token
    }
    let imageFile:any = this.form.controls['productPic'].value;
    let postFormData:any = {
      title:this.form.value.title,
      description:this.form.value.description,
      category:this.form.value.category,
      useful_year:this.form.value.useful_year,
      useful_branch:this.form.value.useful_branch
    }
    this.networkEngine.uploadFile(imageFile,userAuth,postFormData).then( (result:any) => {
        this.navCtrl.pop();
    },err => {
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
        correctOrientation:true,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      }).then((data) => {
        this.form.patchValue({ 'productPic': 'data:image/jpg;base64,' + data });
      }, (err) => {
        alert('Unable to take photo');
        console.log(err);
      })
    } else {
      this.fileInput.nativeElement.click();
    }
  }

  processWebImage(event) {
    let reader = new FileReader();
    reader.onload = (readerEvent) => {
      let imageData = (readerEvent.target as any).result;
      this.form.patchValue({ 'productPic': imageData });
    };

    try{
      reader.readAsDataURL(event.target.files[0]);
    }
    catch(err){
      console.error(err);
    }
  }

  getProfileImageStyle() {
    return 'url(' + this.form.controls['productPic'].value + ')'
  }

  viewFullImage(){
    console.log('View full image');
    let modal = this.mdlCtrl.create('FullImagePage',{image_data:this.form.controls['productPic'].value});
    modal.present();
  }
}
