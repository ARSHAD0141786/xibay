import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';

import { WelcomePage } from '../welcome/welcome';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-tutorials',
  templateUrl: 'tutorials.html',
})
export class TutorialsPage {

  showSkip = true;
  @ViewChild('slides') slides: Slides;
  

  tutorials = [
    {
      title: "Welcome to XIBAY",
      description: "Xibay - E<b>X</b>change <b>I</b>n <b>B</b>etter w<b>AY</b>.<br/>Find almost everything you need for your <b>engineering</b>",
      image: "assets/imgs/tuts/first.jpg",
    },
    {
      title: "Get Products for Free",
      description: "Send requests for any product and get<br/>notified when other user accept it.<br/><b>By just one click</b>",
      image: "assets/imgs/tuts/happy.jpg",
    },
    {
      title: "Post your products",
      description: "You can post your products related to engineering which are useless for you but useful for others.<br/>Help others and get <b>blessed</b>.",
      image: "assets/imgs/tuts/good.jpg",
    },
    {
      title: "We gurantee for security",
      description: "<b>XIBAY</b> team always look forward for the security and easiness of their family.<br/>Trust us and enjoy we <b>care</b> for you.",
      image: "assets/imgs/tuts/secure.jpg",
    }
  ];
  constructor(
    private storage:Storage,
    public navCtrl: NavController, 
    public navParams: NavParams) {
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad TutorialsPage');
  }

  onSlideChangeStart(slider: Slides) {
    this.showSkip = !slider.isEnd();
  }
  
  startApp() {
    this.storage.get('hasSeenTutorial').then((hasSeenTurtorial)=>{
      if(!hasSeenTurtorial){
        this.navCtrl.setRoot(WelcomePage).then(() => {
          this.storage.set('hasSeenTutorial', 'true');
        })
      }else{
        this.navCtrl.pop();
      }
    });
  }
}
