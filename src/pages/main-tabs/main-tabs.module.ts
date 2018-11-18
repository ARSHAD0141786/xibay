import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular/umd';
import { MainTabsPage } from './main-tabs';

@NgModule({
  declarations: [
    MainTabsPage,
  ],
  imports: [
    IonicPageModule.forChild(MainTabsPage),
  ],
})
export class MainTabsPageModule {}
