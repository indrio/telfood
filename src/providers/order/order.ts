import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http/';
import { HttpHeaders } from '@angular/common/http';

import { Events } from 'ionic-angular';

import firebase from 'firebase/app';
import 'firebase/database';

/*
  Generated class for the OrderProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class OrderProvider {
    orderRef = firebase.database().ref("order");
    userRef = firebase.database().ref("user");
    merchantRef = firebase.database().ref("merchant");
    
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

  constructor(public events: Events,
              private http: HttpClient) { }

  
  getOrders(user) {
      console.log('user');
      console.log(user);
      if(user && user.user_type == 'user') {
          this.orderRef.orderByChild('username').equalTo(user.username).once('value', (snap) => {
              this.orders = [];
              if (snap.val()) {
                  var tempOrders = snap.val();
              
                  for (var key in tempOrders) {
                      let singleOrder = {
                          id: key,
                          order_date: tempOrders[key].order_date,
                          merchant_id: tempOrders[key].merchant_id,
                          username: tempOrders[key].username,
                          cartItems: tempOrders[key].cartItems,
                          totalPrice: tempOrders[key].totalPrice,
                          delivery_address: tempOrders[key].delivery_address,
                          delivery_phone: tempOrders[key].delivery_phone,
                          status: tempOrders[key].status,
                          expanded:false
                      };
                  
                      this.orders.push(singleOrder);
                  }
              }
              this.events.publish('ordersLoaded');
          });
      } else if(user.merchant_id != null) {
          this.orderRef.orderByChild('merchant_id').equalTo(parseInt(user.merchant_id)).once('value', (snap) => {
              this.orders = [];
              if (snap.val()) {
                  var tempOrders = snap.val();
              
                  for (var key in tempOrders) {
                      let singleOrder = {
                          id: key,
                          order_date: tempOrders[key].order_date,
                          merchant_id: tempOrders[key].merchant_id,
                          username: tempOrders[key].username,
                          cartItems: tempOrders[key].cartItems,
                          totalPrice: tempOrders[key].totalPrice,
                          delivery_address: tempOrders[key].delivery_address,
                          delivery_phone: tempOrders[key].delivery_phone,
                          status: tempOrders[key].status,
                          expanded:false
                      };
                  
                      this.orders.push(singleOrder);
                  }
              }
              this.events.publish('ordersLoaded');
          });
      }
  }
  
  submitOrder(order) {
      console.log('order');
      console.log(order);
      
      this.userRef.orderByChild('merchant_id').equalTo(parseInt(order.merchant_id)).once('value', (snap) => {
          if (snap.val()) {
              console.log(snap.val());
              
              this.orderRef.push(order).then(function() {
                  console.log('Synchronization succeeded');
              });
          }

          var orderMerchants = snap.val();
          console.log('orderMerchants');
          console.log(orderMerchants);
          
          this.sendNotification(orderMerchants, order);
          this.events.publish('orderSubmited');
      });
  }
  
  setStatus(order_id, status) {
      this.orderRef.child(order_id).child('status').set(status)
      .then(function() {
          //console.log('Synchronization succeeded');
      })
      .catch(function(error) {
          //console.log('Synchronization failed');
      }); 
      
      this.events.publish('statusOrderupdated');
  }
  
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
}
