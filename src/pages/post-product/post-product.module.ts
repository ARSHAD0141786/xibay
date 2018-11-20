import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PostProductPage } from './post-product';

@NgModule({
  declarations: [
    PostProductPage,
  ],
  imports: [
    IonicPageModule.forChild(PostProductPage),
  ],
})
export class PostProductPageModule {}
