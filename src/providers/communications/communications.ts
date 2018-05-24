import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/timeout';
import { GeneralProvider } from '../general/general';


/*
  Generated class for the CommunicationsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CommunicationsProvider {

   public pedidos = [];

   private newsTimer;

   private _baseUrl = 'http://52.191.250.248:1880';


   
  constructor(public http: HttpClient, public general : GeneralProvider) {
    console.log('Hello CommunicationsProvider Provider');
    this.getBaseUrl();
    
  }

  findInArrayByKeyValue(arr,key,val){
    var found = arr.find(function(element) {
      return element[key] == val;
    });
    return arr.indexOf(found);
  
    
  }

  getBaseUrl(){
    return new Promise((resolve, reject) => {
            //Establecemos cabeceras
            let headers = new HttpHeaders(); //.set('x-access-token','untoken');
            console.log('comprobando servidor');
            
            this.http.get('http://52.191.250.248:1880/summit_52_191_250_248_1880', {headers: headers}).timeout(5000).subscribe(
                resPrimaryServer => {
                  console.log('servidor_primario online');
                    resolve(resPrimaryServer);
                }, err => {
                  console.log('servidor_primario offline');
                  this._baseUrl= 'http://tecnoandina-server.ddns.net:1880'
                    reject(err);
                }
            );

        }
    )
}
  
  OSplayerId( OSId) {
    return new Promise((resolve, reject) => {
            let params = {"player_id": OSId}
            //Establecemos cabeceras
            let headers = new HttpHeaders(); //.set('x-access-token','untoken');
            this.http.post(this._baseUrl+'/summit_update_bartender_id', params, {headers: headers}).timeout(4000).subscribe(
                res => {
                    console.log('se recibio respuesta de OSId', res);
                    if (res['success']) {
                        resolve(true)
                    } else {
                        reject('No se puede actualizar OSId');
                    }
                }, err => {
                    console.log('error en OSId', err);
                    reject(err);
                }
            );

        }
    )
}

  getPedidos(){
    return new Promise ((resolve,reject) => { 



      let params = {
        
      };
 
      //Establecemos cabeceras
      let headers = new HttpHeaders()//.set('x-access-token','untoken');

      this.http.get(this._baseUrl+'/get_all_pedidos', {headers: headers}).timeout(10000).subscribe(
        res => {
          console.log('se recibio respuesta de pedidos',res);
          
          
          if (res['success']){
            res['pedidos']//.reverse()
            this.pedidos = res['pedidos']

            this.getNewPedidos();

            resolve(true)
          } else {
            reject('No se puede obtener los pedidos');
          }
          
        
        }, err => {
          console.log('error al obtener pedidos',err);
          
          reject(err);
        }
      );



      let data = this._getPedidos();

      this.pedidos = JSON.parse(JSON.stringify(data))

      resolve(true);
    }
  )
  }

  getNewPedidos(){

    this.newsTimer= setInterval (() => {

      let params = {
        
      };
 
      //Establecemos cabeceras
      let headers = new HttpHeaders()//.set('x-access-token','untoken');

      this.http.get(this._baseUrl+'/summit_get_news', {headers: headers}).timeout(4000).subscribe(
        res => {
          console.log('se recibio respuesta de pedidos nuevos',res);
          
          
          if (res['success']){
            
            res['info']//.reverse()
            this.pedidos = this.pedidos.concat(res['info'])
            
          } else {
            console.log('No se puede obtener los pedidos nuevos');
          }
          
        
        }, err => {
          console.log('error al obtener pedido nuevos',err);
          
        }
      );
    }, 5000)

  }

  
  getPedidoById(pedidoId){
    return new Promise ((resolve,reject) => { 
      console.log('get pedido by id');
      
      let data = this._pedidoById(pedidoId)

      console.log(data);
      
      if(data['success']){
        resolve(data['pedido'])
      } else {
        reject(data['error'])
      }


    }
  )
  }

  setStatus(pedidoId,estado){

    this.general.presentPrompt( (estado==1 ? 'Pedido listo' : 'Entregar pedido'),(estado==1 ? `¿Confirma que desea cambiar a listo el pedido ${this.formatPedidoId(pedidoId)}?`  : `¿Confirma que desea entregar el pedido ${this.formatPedidoId(pedidoId)}?`), 'Confirmar','Cancelar').then(res =>{

      if (res==true){
        
        return new Promise ((resolve,reject) => { 


          let params = [
            {"pedidoId" : pedidoId},
            {"$set" : {"estado": estado} } 
         ];
     
          //Establecemos cabeceras
          let headers = new HttpHeaders()//.set('x-access-token','untoken');
    
          this.http.post(this._baseUrl+'/summit_update_pedido',params, {headers: headers}).timeout(4000).subscribe(
            res => {
              console.log('se recibio respuesta de update',res);
              
              if (res['success']){ 
    
                let i = this.findInArrayByKeyValue(this.pedidos,"pedidoId",pedidoId);
                this.pedidos[i]['estado']= estado;
                resolve(true)
              } else { reject('No se puede obtener actualizar pedido')}
              
            
            }, err => {
              console.log('error al actualizar pedido ',err);
              
            }
          );
    
    /* 
    
          let res = this._setStatus(pedidoId,estado)
    
          if (res['success']){ resolve(true)} else { reject(res['error'])} */
    
    
    
        }
      )

      }
    })
    
  }

  formatPedidoId(pedidoId){
    let pedidoIdString = pedidoId.toString();
    return pedidoIdString.substr(pedidoIdString.length - 3);
}



  

  //########################################################
  //#################### Fake Data #########################
  //########################################################

  private _pedidos = [
    {
      pedidoId: 'p132',
      estado: 0,
      usuario: 'Juan Viera',
      userId: 'u567',
      fecha: new Date(Date.now()),
      cancelado: false,
      tragos: [
        {
          tragoId: 'as12',
          nombre: 'Merlot',
          cant: 1
        },{
          tragoId: 'as14',
          nombre: 'Pisco Sour',
          cant: 1
        }
      ]
    },
    {
      pedidoId: 'p456',
      estado: 0,
      usuario: 'Erick Shuffer',
      userId: 'u321',
      fecha: new Date(Date.now()),
      cancelado: false,
      tragos: [
        {
          tragoId: 'as32',
          nombre: '"Diplomatico 100 años"',
          cant: 2
        }
      ]
    }
  ]

  private tragos = [
    {
      id: 'as12',
      categoria: '12as',
      nombre: 'Merlot',
      descripcion: 'Lorem ipsum',
      imagen: 'url'
    },{
      id: 'as23',
      categoria: '23sd',
      nombre: 'Chivas 21',
      descripcion: 'Lorem ipsum',
      imagen: 'url'
    },{
      id: 'as32',
      categoria: '32df',
      nombre: 'Diplomatico 100 años',
      descripcion: 'Lorem ipsum',
      imagen: 'url'
    },{
      id: 'as21',
      categoria: '21as',
      nombre: 'budweiser',
      descripcion: 'Lorem ipsum',
      imagen: 'url'
    },{
      id: 'as14',
      categoria: '14aq',
      nombre: 'Pisco Sour',
      descripcion: 'Lorem ipsum',
      imagen: 'url'
    },
  ]

  private user = [
    {
    id: 'o21i',
    password: 'tecnoandina123',
    'first-name': 'juan',
    'last-name': 'Viera',
    'email-address':'juan.viera@tecnoandina.cl',
    positions: {
      title: 'Ingeniero de Proyectos',
      company: 'Tecnoandina SpA'
    
    },pedidos: [
      { 
        id: '2ij1',
        estado: 3,
        fecha: new Date(Date.now()),
        tragos: [
          {
            id: 'as12',
            cant: 2,
            nombre: 'Merlot'
          }
        ]
      }
    ]

    },{
      id: 'o12i',
      password: 'tecnoandina123',
      'first-name': 'Erick',
      'last-name': 'Shuffer',
      'email-address':'erick.shuffer@tecnoandina.cl',
      positions: {
        title: 'Gerente de TI',
        company: 'Tecnoandina SpA'
      },pedidos: [
        
      ]

    }
];

  //################################################################
  //##################### Fake Server ##############################
  //################################################################

  _getPedidos(){

    return this._pedidos;
  }

  

  private newPedido = new Observable ( _pedido =>{
    /* setInterval(()=>{
      console.log('generar nuevo pedido');
      
      let user = this.user[Math.floor(Math.random()*this.user.length)];
      let trago = this.tragos[Math.floor(Math.random()*this.tragos.length)]
      let pedido = {
        pedidoId: 'p'+ Math.ceil(Math.random()*1000),
        estado: 0,
        usuario: user['first-name'] + ' ' + user['last-name'],
        userId: user['id'],
        fecha: new Date(Date.now()),
        cancelado: false,
        tragos: [
          {
            tragoId: trago.id,
            nombre: trago.nombre,
            cant: Math.ceil(Math.random()*2)
          }
        ]
      }
  
      console.log(pedido);
      
      this._pedidos.unshift(pedido);
      _pedido.next({msj: 'new', id:  pedido.pedidoId})
  
    },8000)

    setInterval(()=>{
      let pIndex = Math.floor(Math.random()*this._pedidos.length);
  
      console.log('cambiar estado del pedido: ',this._pedidos[pIndex]);
      
      if (this._pedidos[pIndex].estado<3){
        this._pedidos[pIndex].estado ++;
        _pedido.next({msj: 'update', id:  this._pedidos[pIndex].pedidoId});
  
      }
    },15000) */
  } )
  

  _pedidoById(pedidoId){

    console.log('server side, pedido by id',pedidoId);
    
    let i = this.findInArrayByKeyValue(this._pedidos,'pedidoId',pedidoId);

    if (i==-1) return {success: false, error: 404};

    return {success: true, error: 200, pedido: this._pedidos[i]}

  }

  _setStatus(pedidoId,estado){

    console.log('server side, pedido status',pedidoId,estado);


    let i = this.findInArrayByKeyValue(this._pedidos,'pedidoId',pedidoId);

    if (i==-1) return {success: false, error: 404};

    console.log('pedido ',this._pedidos[i]);
    

    this._pedidos[i].estado = estado;

    return {success: true, error: 200, pedido: this._pedidos[i]}

  }


  /* //###############################################
  //#################fake methods #################
  //###############################################


  private socket = this.newPedido.subscribe( 
    data =>{

      console.log('got coms from socket',data);
      

      if ( data['msj']=='new' ){

        this.getPedidoById(data['id']).then( res =>{
          this.pedidos.unshift(res)
        })
        
      } else if (data['msj']=='update'){
        this.getPedidoById(data['id']).then( res =>{
          
          let i = this.findInArrayByKeyValue(this.pedidos,'pedidoId',data['id'])

          if (i==-1){
            this.pedidos.unshift(res)
          } else {
            this.pedidos[i]=res;
          }


        })
      }

    },
    err =>{

    },
    () =>{

    }
   ) */

}
