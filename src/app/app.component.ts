import { CommunicationsProvider } from './../providers/communications/communications';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';

import {OneSignal} from '@ionic-native/onesignal';
import { GeneralProvider } from '../providers/general/general';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;
  public alertSound = new Audio();
  public player_id = '';

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, 
    private oneSignal: OneSignal, public general : GeneralProvider, private coms : CommunicationsProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      
            // OneSignal Code start:
            // Enable to debug issues:
            // window["plugins"].OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});

            //################################################################################################################################################################################

            this.alertSound.src='assets/sounds/ding.mp3';
            this.alertSound.load();

            console.log('inicializando OneSignal');
            this.oneSignal.startInit('e0a8b866-b7ce-44bc-bbb7-a78e2c919cf6', '30929118488');

            this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);

            this.oneSignal.handleNotificationReceived().subscribe((jsonData) => {
                // do something when notification is received;
                this.alertSound.play();
                console.log('notificationReceivedCallback: ', jsonData);
                
                this.general.alerta_generica(jsonData['payload']['title'], jsonData['payload']['body']);
                /* if (jsonData['payload'].hasOwnProperty('additionalData')) {
                    if (jsonData['payload']['additionalData'].hasOwnProperty('orderUpdate')) {
                        if (jsonData['payload']['additionalData']['orderUpdate']) {
                            //this.alertSound.play();
                            this.coms.pedidos(this.memory.user['id']).then(data => {
                                this.memory.user['pedidos'] = data
                            })
                        }
                        else {
                            console.log('mensaje genérico recibido');
                        }
                    }
                } */
            });

            this.oneSignal.handleNotificationOpened().subscribe((jsonData) => {
                // do something when a notification is opened
                console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
                console.log(jsonData);
            });


            this.oneSignal.endInit();

            this.getOSid();

            /* setTimeout(() => {
              this.getOSid();
            }, 10000); */


            console.log('Se ha inicializado OneSignal');
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  getOSid() {
    return new Promise((resolve, reject) => {
      console.log('solicitando estado de onesignal');
      
        this.oneSignal.getPermissionSubscriptionState().then(status => {
            console.log('estado de subscripcion');
            console.log(status);
            this.player_id = status['subscriptionStatus']['userId'];
            this.coms.OSplayerId( this.player_id).then(() => {
            });
            console.log('user push id');
            console.log(this.player_id);
            resolve(true)
        })
    })
}
}

