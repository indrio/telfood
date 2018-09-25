import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http/';
import { HttpHeaders } from '@angular/common/http';

import { Events } from 'ionic-angular';

/*
  Generated class for the OrderProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class OrderProvider {
    //orderRef = firebase.database().ref("order");
    //userRef = firebase.database().ref("user");
    //merchantRef = firebase.database().ref("merchant");
    
    orders: Array<{
        order_date:number,
        merchant_id:string,
        username:string,
        cartItems:Array<{
            id: string, 
            title: string, 
            description: string, 
            photo: string, 
            qty : number, 
            price: number,
            notes:string
        }>,
        totalPrice:number, 
        delivery_address:string, 
        delivery_phone:string,
        status:string,
        expanded:boolean
    }>;
    
    API_URL = "http://indifood.skytechserver.com/api/public/"
    
  constructor(public events: Events,
              private http: HttpClient) { }

  
  getOrders(user) {
      //console.log('user');
      //console.log(user);
      if(user && user.user_type == 'user') {
          this.http.get(this.API_URL+'orders/username/'+user.username).subscribe(data => {
              //console.log(data);
              this.orders = [];
              if(data) {
                  for (var key in data) {
                      let singleOrder = {
                          id: data[key].id_,
                          order_date: data[key].order_date,
                          merchant_id: data[key].merchant_id,
                          username: data[key].username,
                          cartItems: data[key].cartItems,
                          totalPrice: data[key].totalPrice,
                          delivery_address: data[key].delivery_address,
                          delivery_phone: data[key].delivery_phone,
                          status: data[key].status,
                          expanded:false
                      };
                  
                      this.orders.push(singleOrder);
                  }
              }
              //console.log(this.orders);
              
              this.events.publish('ordersLoaded');
          }, err => {
              console.log(err);
          });
      } else if(user.merchant_id != null) {
          this.http.get(this.API_URL+'orders/merchant_id/'+user.merchant_id).subscribe(data => {
              //console.log(data);
              this.orders = [];
              if(data) {
                  for (var key in data) {
                      let singleOrder = {
                          id: data[key].id_,
                          order_date: data[key].order_date,
                          merchant_id: data[key].merchant_id,
                          username: data[key].username,
                          cartItems: data[key].cartItems,
                          totalPrice: data[key].totalPrice,
                          delivery_address: data[key].delivery_address,
                          delivery_phone: data[key].delivery_phone,
                          status: data[key].status,
                          expanded:false
                      };
                  
                      this.orders.push(singleOrder);
                  }
              }
    
              this.events.publish('ordersLoaded');
          }, err => {
              console.log(err);
          });
      }
  }
  
  submitOrder(order) {
      //console.log('order');
      //console.log(order);
      
      for (var i = 0; i < order.cartItems.length; i++) {
          delete order.cartItems[i].id;
          delete order.cartItems[i].merchant_id;
      }

      //console.log(order);

      this.http.post(this.API_URL+'order', order, { headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }).subscribe(data => {
          //console.log(data);

          this.http.get(this.API_URL+'user/merchant/'+order.merchant_id).subscribe(merchantUser => {
              if(merchantUser) {
                  for (var key in merchantUser) {
                      //console.log(merchantUser[key]);
                      //console.log(merchantUser[key].google_token);
          
                      if(merchantUser[key].google_token) {
                          let body = {
                              notification:{
                                  title: "New Order",
                                  body: "You have new order from "+order.username,
                                  sound: "default",
                                  click_action: "FCM_PLUGIN_ACTIVITY",
                                  icon: "fcm_push_icon"
                              },
                                to: merchantUser[key].google_token,
                                priority: "high",
                                restricted_package_name: ""
                            }
        
                            console.log('body');
                            console.log(body);
        
                            let options = new HttpHeaders().set('Content-Type','application/json');
                            this.http.post("https://fcm.googleapis.com/fcm/send",body,{
                                headers: options.set('Authorization', 'key=AIzaSyB_Uri3TyhXANQlt75nWujMByipC1yigi0'),
                            }).subscribe(response => {
                                console.log('orderSubmited');
                            });
                        }
                  }

                  this.events.publish('orderSubmited');
              }
          }, err => {
              console.log(err);
          });
      }, err => {
          console.log(err);
      });
  }
  
  setStatus(order_id, status) {
      /*
      this.orderRef.child(order_id).child('status').set(status)
      .then(function() {
          //console.log('Synchronization succeeded');
      })
      .catch(function(error) {
          //console.log('Synchronization failed');
      }); 
      
      this.events.publish('statusOrderupdated');
      */
  }
  
  /*
  sendNotification(merchantUser, order) {  
          console.log('merchantUser');
          console.log(merchantUser.google_token);

          for (var key in merchantUser) {
              console.log(merchantUser[key]);
              console.log(merchantUser[key].google_token);
          
              if(merchantUser[key].google_token) {
              let body = {
                  notification:{
                      title: "New Order",
                      body: "You have new order from "+order.username,
                      sound: "default",
                      click_action: "FCM_PLUGIN_ACTIVITY",
                      icon: "fcm_push_icon"
                  },
                    to: merchantUser[key].google_token,
                    priority: "high",
                    restricted_package_name: ""
                }
        
                console.log('body');
                console.log(body);
        
                let options = new HttpHeaders().set('Content-Type','application/json');
                this.http.post("https://fcm.googleapis.com/fcm/send",body,{
                    headers: options.set('Authorization', 'key=AIzaSyB_Uri3TyhXANQlt75nWujMByipC1yigi0'),
                }).subscribe();
                }
          }
  }
  */
}
