import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Events } from 'ionic-angular';
import { OrderProvider } from '../../providers/order/order';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

import { MerchantProvider } from '../../providers/merchant/merchant';

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
    
    merchants: Array<{id: string, name: string, address: string, open_hour: string, icon: string}> = [];
    
    itemExpandHeight: number = 70;
    
    constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private loadingCtrl: LoadingController,
              private orderService: OrderProvider,
              private events: Events, 
              private auth: AuthServiceProvider, 
              private merchantService: MerchantProvider) {
    }
    
    ionViewWillEnter() {
        this.getOrders(this.auth.getUserInfo());
    }
    
    ionViewDidLeave() {
        //this.events.unsubscribe('ordersLoaded');
    }
    
    async getOrders(loggedUser) {
        let loader = this.loadingCtrl.create({
            content: 'Loading Orders..'
        });
        
        loader.present();
        
        this.orderService.getOrders(loggedUser);
        
        this.events.subscribe('ordersLoaded', () => {
            this.orders = this.orderService.orders.sort((a, b) => a.order_date <= b.order_date ? 1 : -1);

            this.getMerchants();
            
            loader.dismiss();
        });
    }
    
    async getMerchants(){
        if(!this.merchantService.merchants) {
            this.merchantService.getMerchants();
        
            this.events.subscribe('merchantsLoaded', () => {
                this.merchants = this.merchantService.merchants;
            });
        } else {
            this.merchants = this.merchantService.merchants;
        }
    }
    
    getMerchant(id) {
        //console.log('id : '+id);
        //console.log(this.merchants);
        
        return this.merchants.find((item) => {
            return item.id == id;
        });
    }
 
    expandItem(order){
        this.orders.map((listOrder) => {
            if(order == listOrder){
                listOrder.expanded = !listOrder.expanded;
            } else {
                listOrder.expanded = false;
            }
 
            return listOrder;
        });
    }

}
