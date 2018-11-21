import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, ModalController } from 'ionic-angular';
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

  form: FormGroup;
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

  constructor(
    public navCtrl: NavController,
    private notify: NotifyProvider,
    public menu: MenuController,
    private userData: UserDataProvider,
    private mdlCtrl: ModalController,
    private networkEngine: NetworkEngineProvider,
    formBuilder: FormBuilder, public camera: Camera,
    public navParams: NavParams) {
      this.form = formBuilder.group({
        profilePic: [''],
        name: ['', Validators.required],
        about: ['']
      });

      this.form.valueChanges.subscribe((v) => {
        this.isReadyToSave = this.form.valid;
      });

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

  seeFullImage(url:string){
    let modal = this.mdlCtrl.create('FullImagePage',{image:url});
    console.log('image_url : '+url);
    modal.present();
  }

  done(){
    console.log('update user details...')
    console.log('Not yet implemented');
  }
  getPicture() {
    if (Camera['installed']()) {
      this.camera.getPicture({
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth: 96,
        targetHeight: 96
      }).then((data) => {
        this.form.patchValue({ 'profilePic': 'data:image/jpg;base64,' + data });
      }, (err) => {
        alert('Unable to take photo');
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
      this.account.user_image_url = imageData;
      console.log(imageData);
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  getProfileImageStyle(value) {
    return 'url(' + value + ')'
  }
  
  save(){
    console.log(this.form.value);
  }
}
