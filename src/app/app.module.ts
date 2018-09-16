import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { MerchantMenuProvider } from '../providers/merchant-menu/merchant-menu';
import { MerchantProvider } from '../providers/merchant/merchant';
import { CategoryProvider } from '../providers/category/category';

import { config } from './../config/app.config';
import * as firebase from 'firebase';

firebase.initializeApp(config.firebasConfig);

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthServiceProvider,
    MerchantMenuProvider,
    MerchantProvider,
    CategoryProvider
  ]
})
export class AppModule {}
