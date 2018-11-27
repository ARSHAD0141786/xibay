import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Camera } from '@ionic-native/camera';
import { IonicStorageModule } from '@ionic/storage';
import { Network } from '@ionic-native/network';
import { MomentModule } from 'angular2-moment';

import { Xibay } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NetworkEngineProvider } from '../providers/network-engine/network-engine';
import { HttpModule } from '@angular/http';
import { LogsServiceProvider } from '../providers/logs-service/logs-service';
import { NotifyProvider } from '../providers/notify/notify';
import { UserDataProvider } from '../providers/user-data/user-data';
import { ConnectionProvider } from '../providers/connection/connection';
import { Push } from '@ionic-native/push';

import * as firebase from 'firebase';
import { OtpValidationPageModule } from '../pages/otp-validation/otp-validation.module';
import { IonicImageViewerModule } from 'ionic-img-viewer';

firebase.initializeApp({
  apiKey: "AIzaSyDOH8r5j6evr4npYDYFVUd5wleuUuH_cz4",
  authDomain: "xibay-64286.firebaseapp.com",
  databaseURL: "https://xibay-64286.firebaseio.com",
  projectId: "xibay-64286",
  storageBucket: "xibay-64286.appspot.com",
  messagingSenderId: "572154572093"
});

@NgModule({
  declarations: [
    Xibay,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(Xibay),
    OtpValidationPageModule,
    HttpModule,
    MomentModule,
    IonicImageViewerModule,
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    Xibay,
  ],
  providers: [
    Push,
    StatusBar,
    SplashScreen,
    Camera,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FileTransfer,
    FileTransferObject,
    File,
    Push,
    NetworkEngineProvider,
    LogsServiceProvider,
    NotifyProvider,
    UserDataProvider,
    Network,
    ConnectionProvider,
  ]
})
export class AppModule {}
