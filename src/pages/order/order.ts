import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Events } from 'ionic-angular';
import { OrderProvider } from '../../providers/order/order';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

/**
 * Generated class for the OrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage {
    
    orders: Array<{
        order_date:number,
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
        status:string
    }>;
    
    constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private loadingCtrl: LoadingController,
              private orderService: OrderProvider,
              private events: Events, 
              private auth: AuthServiceProvider) {
    }
    
    ionViewWillEnter() {
        this.getOrders(this.auth.getUserInfo());
    }
    
    ionViewDidLeave() {
        this.events.unsubscribe('ordersLoaded');
    }
    
    getOrders(loggedUser) {
        let loader = this.loadingCtrl.create({
            content: 'Loading Orders..'
        });
        
        loader.present();
        
        this.orderService.getOrders(loggedUser);
        
        this.events.subscribe('ordersLoaded', () => {
            this.orders = this.orderService.orders;
            loader.dismiss();
        });
    }

}
