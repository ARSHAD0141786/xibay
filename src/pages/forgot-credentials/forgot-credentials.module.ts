import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular/umd';
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
