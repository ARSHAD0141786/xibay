import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular/umd';
import { TermsAndConditionPage } from './terms-and-condition';

@NgModule({
  declarations: [
    TermsAndConditionPage,
  ],
  imports: [
    IonicPageModule.forChild(TermsAndConditionPage),
  ],
})
export class TermsAndConditionPageModule {}
