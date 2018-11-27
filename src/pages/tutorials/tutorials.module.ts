import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TutorialsPage } from './tutorials';

@NgModule({
  declarations: [
    TutorialsPage,
  ],
  imports: [
    IonicPageModule.forChild(TutorialsPage),
  ],
  exports:[
    TutorialsPage,
  ]
})
export class TutorialsPageModule {}
