import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AllMessagesPage } from './all-messages';

@NgModule({
  declarations: [
    AllMessagesPage,
  ],
  imports: [
    IonicPageModule.forChild(AllMessagesPage),
  ],
})
export class AllMessagesPageModule {}
