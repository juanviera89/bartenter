import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { GeneralProvider } from '../providers/general/general';
import { MemoryProvider } from '../providers/memory/memory';
import { CommunicationsProvider } from '../providers/communications/communications';


import { HttpClientModule } from '@angular/common/http';
import {OneSignal} from '@ionic-native/onesignal';

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule
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
    GeneralProvider,
    MemoryProvider,
    OneSignal,
    CommunicationsProvider
  ]
})
export class AppModule {}
