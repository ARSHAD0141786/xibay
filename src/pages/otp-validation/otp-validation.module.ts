import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OtpValidationPage } from './otp-validation';

@NgModule({
  declarations: [
    OtpValidationPage,
  ],
  imports: [
    IonicPageModule.forChild(OtpValidationPage),
  ],
})
export class OtpValidationPageModule {}
