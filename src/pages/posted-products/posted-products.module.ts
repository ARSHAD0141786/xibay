import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PostedProductsPage } from './posted-products';

@NgModule({
  declarations: [
    PostedProductsPage,
  ],
  imports: [
    IonicPageModule.forChild(PostedProductsPage),
  ],
})
export class PostedProductsPageModule {}
