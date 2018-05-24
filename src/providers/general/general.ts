import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {AlertController} from 'ionic-angular/components/alert/alert-controller';
import {LoadingController} from 'ionic-angular/components/loading/loading-controller';
import {ToastController} from 'ionic-angular/components/toast/toast-controller';
import {MenuController} from 'ionic-angular/components/app/menu-controller';

/*
  Generated class for the GeneralProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GeneralProvider {
    private _controller: any;
    private _loading;
    private showAlerts = true;
    public _months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    constructor(private alertCtrl: AlertController, private loadingCtrl: LoadingController, private toastCtrl: ToastController,
                public _menu: MenuController, /* private screenOrientation: ScreenOrientation */) {

        /* this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT); */

    }

    get controller() {
        return this._controller
    }

    set controller(newVal) {
        this._controller = newVal;
    }

    militaryHourToLocalString(hour) {
        let hourstr = (hour + '').split("").reverse().join("");
        return hourstr.substr(2, 2).split("").reverse().join("") + ':' + hourstr.substr(0, 2).split("").reverse().join("")
    }

    alerta_generica(title, subTitle, button_ok = "Ok") {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: subTitle,
            buttons: [button_ok]
        });
        if (this.showAlerts) {
            alert.present().then(() => {
            });
        }
    }

    findInArrayByKeyValue(arr, key, val) {
        var found = arr.find(function (element) {
            return element[key] == val;
        });
        return arr.indexOf(found);


    }


    presentPrompt(title, message, confirmBtn = "Yes", cancelBtn = "No") {
        return new Promise((resolve, reject) => {
            let alert = this.alertCtrl.create({
                title: title,
                message: message,
                buttons: [
                    {
                        text: confirmBtn,
                        handler: () => {
                            //console.log(confirmBtn+' clicked');
                            resolve(true);
                        }
                    },
                    {
                        text: cancelBtn,
                        role: 'cancel',
                        handler: () => {
                            //console.log(cancelBtn+' clicked');
                            resolve(false);
                        }
                    }
                ]
            });
            if (this.showAlerts) {
                alert.present().then(() => {
                });
            }
        })

    }


    goToPage(page, params = null) {

        if (page == 'none') {
            //console.log('Vista sin pagina asociada')
        } else {
            this.controller.navCtrl.push(page, params);
        }

    }

    presentLoader(text) {
        this._loading = this.loadingCtrl.create({
            content: text,
            // dismissOnPageChange: true
        });

        this._loading.present();
    }

    dismissLoader() {
        this._loading.dismiss();
    }

    presentToast(message: string, duration: number, closeButton: boolean) {
        let toast = this.toastCtrl.create({message: message, duration: duration, showCloseButton: closeButton, closeButtonText: "X"});
        toast.present();
    }

    menu() {
        //console.log('toggle menu');
        this._menu.toggle('main-menu');
    }

}
