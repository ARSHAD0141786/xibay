import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ForgotCredentialsPage } from './forgot-credentials';

@NgModule({
  declarations: [
    ForgotCredentialsPage,
  ],
  imports: [
    IonicPageModule.forChild(ForgotCredentialsPage),
  ],
})
export class ForgotCredentialsPageModule {}
