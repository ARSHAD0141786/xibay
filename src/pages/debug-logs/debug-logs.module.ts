import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DebugLogsPage } from './debug-logs';

@NgModule({
  declarations: [
    DebugLogsPage,
  ],
  imports: [
    IonicPageModule.forChild(DebugLogsPage),
  ],
})
export class DebugLogsPageModule {}
