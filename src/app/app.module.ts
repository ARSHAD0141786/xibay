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
import { WelcomePage } from '../pages/welcome/welcome';
import { LoginPage } from '../pages/login/login';
import { RegistrationPage } from '../pages/registration/registration';
import { TutorialsPage } from '../pages/tutorials/tutorials';
import { DebugLogsPage } from '../pages/debug-logs/debug-logs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NetworkEngineProvider } from '../providers/network-engine/network-engine';
import { HttpModule } from '@angular/http';
import { LogsServiceProvider } from '../providers/logs-service/logs-service';
import { NotifyProvider } from '../providers/notify/notify';
import { PrimaryMainPage } from '../pages/primary-main/primary-main';
import { SecondaryMainPage } from '../pages/secondary-main/secondary-main';
import { MainTabsPage } from '../pages/main-tabs/main-tabs';
import { CameraPage } from '../pages/camera/camera';
import { UploadFormPage } from '../pages/upload-form/upload-form';
import { UserDataProvider } from '../providers/user-data/user-data';
import { ConnectionProvider } from '../providers/connection/connection';
import { DescriptionPage } from '../pages/description/description';
import { AccountPage } from '../pages/account/account';
import { Push } from '@ionic-native/push';

import * as firebase from 'firebase';
import { OtpValidationPage } from '../pages/otp-validation/otp-validation';
import { DeveloperPage } from '../pages/developer/developer';
import { OtpValidationPageModule } from '../pages/otp-validation/otp-validation.module';
import { PostedProductsPage } from '../pages/posted-products/posted-products';
import { RequestsPage } from '../pages/requests/requests';
import { UserProductDescriptionPage } from '../pages/user-product-description/user-product-description';
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
    WelcomePage,
    LoginPage,
    RegistrationPage,
    TutorialsPage,
    DebugLogsPage,
    MainTabsPage,
    PrimaryMainPage,
    SecondaryMainPage,
    CameraPage,
    UploadFormPage,
    DescriptionPage,
    AccountPage,
    DeveloperPage,
    PostedProductsPage,
    RequestsPage,
    UserProductDescriptionPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(Xibay),
    // HttpClientModule,
    OtpValidationPageModule,
    HttpModule,
    MomentModule,
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    Xibay,
    WelcomePage,
    LoginPage,
    OtpValidationPage,
    RegistrationPage,
    TutorialsPage,
    DebugLogsPage,
    MainTabsPage,
    PrimaryMainPage,
    SecondaryMainPage,
    CameraPage,
    UploadFormPage,
    DescriptionPage,
    AccountPage,
    DeveloperPage,
    PostedProductsPage,
    RequestsPage,
    UserProductDescriptionPage
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
