import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular/umd';
import { UploadFormPage } from './upload-form';

@NgModule({
  declarations: [
    UploadFormPage,
  ],
  imports: [
    IonicPageModule.forChild(UploadFormPage),
  ],
})
export class UploadFormPageModule {}
