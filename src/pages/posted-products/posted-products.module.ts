import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular/umd';
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
