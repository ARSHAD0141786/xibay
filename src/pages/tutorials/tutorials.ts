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
      title: "Find everything",
      description: "Find all necessary <b>engineering</b> accessories",
      image: "assets/imgs/tutorials/t4.png",
    },
    {
      title: "Help others",
      description: "Exchange goodies in a better way",
      image: "assets/imgs/tutorials/t2.png",
    },
    {
      title: "Third ",
      description: "This is the <b>third page</b> of tutorial page",
      image: "assets/imgs/tutorials/t1.png",
    },
    {
      title: "Last Tutorials",
      description: "This is the Second page of tutorial page",
      image: "assets/imgs/tutorials/t3.png",
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
