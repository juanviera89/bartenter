import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CommunicationsProvider } from '../../providers/communications/communications';
import {OneSignal} from '@ionic-native/onesignal';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public seccion = 0

  player_id = '';

  constructor(public navCtrl: NavController, public coms : CommunicationsProvider, private oneSignal: OneSignal) {

  }

  ionViewDidLoad(){
   this.coms.getPedidos();
   //this.getOSid()
  }
   
  ionViewDidEnter(){
   this.seccion=0;
   
  }

  ionViewWillEnter(){
    
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

  pedidosActuales(){
    let res = []
    for (const pedido of this.coms.pedidos) {
      if (pedido['estado'] == 0 ) res.push(pedido)
    }
    //console.log('pedidos actuales' , res);
    
    return res
  }

  pedidosListos(){
    let res = []
    for (const pedido of this.coms.pedidos) {
      if (pedido['estado'] == 1 ) res.push(pedido)
    }
    //console.log('pedidos listos' , res);
    return res
  }

  pedidosEntrgados(){
    let res = []
    for (const pedido of this.coms.pedidos) {
      if (pedido['estado'] == 2 ) res.push(pedido)
    }
    //console.log('pedidos entregados' , res);
    return res
  }

  status(status){
    let _statusArr = ['Pedido','Listo','Entregado']
    return _statusArr[status];
  }

  boton(status){
    let _statusArr = ['Listo','Entregar']
    return _statusArr[status];
  }

  formatPedidoId(pedidoId){
    let pedidoIdString = pedidoId.toString();
    return pedidoIdString.substr(pedidoIdString.length - 3);
}

}
