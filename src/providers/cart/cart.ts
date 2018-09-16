import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

const CART_KEY = 'order';

/*
  Generated class for the CartProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CartProvider {
    
    constructor(public events: Events, private storage: Storage) {}
    
    addToCart(product) {
        return this.getCartItems().then(result => {
            if (result && result.cartItems) {
                if (!this.containsObject(product, result.cartItems)) {
                    result.cartItems.push(product);
                    
                    result.totalPrice += (product.price * product.qty);
                    
                    return this.storage.set(CART_KEY, result);
                } else {
                    let index = result.cartItems.findIndex(x => x.id == product.id);
                    //let prevQuantity = parseInt(result.cartItems[index].qty);
                    
                    product.qty = (parseInt(result.cartItems[index].qty) + 1);
                    
                    console.log('product.qty : '+product.qty);
                    
                    //let currentPrice = (parseInt(product.price) * product.qty);
                    //product.price = currentPrice;
                    
                    result.cartItems.splice(index, 1);
                    result.cartItems.push(product);
                    
                    //result.totalPrice += (product.price * product.qty);
                    
                    result.totalPrice += product.price;
                    
                    console.log('result');
                    console.log(result);
                    
                    return this.storage.set(CART_KEY, result);
                }
            } else {
                return this.storage.set(CART_KEY, {
                    cartItems:[product],
                    totalPrice:product.qty * product.price, 
                    delivery_address:'', 
                    delivery_phone:''
                });
            }
        })
    }
    
    async removeFromCart(product) {
        return await this.getCartItems().then(result => {
            if (result && result.cartItems) {
                var productIndex = result.cartItems.findIndex(x => x.id == product.id);
                
                if(result.cartItems[productIndex].qty > 1) {
                    result.cartItems[productIndex].qty--;
                } else {
                    result.cartItems.splice(productIndex, 1);
                }
                
                result.totalPrice -= product.price;
                
                return this.storage.set(CART_KEY, result);
            }
        })
    }
    
    async removeAllCartItems() {
        return await this.storage.remove(CART_KEY).then(res => {
            return res;
        });
    }
    
    containsObject(obj, list): boolean {
        if (!list.length) {
            return false;
        }
        
        if (obj == null) {
            return false;
        }
        var i;
        for (i = 0; i < list.length; i++) {
            if (list[i].id == obj.id) {
                return true;
            }
        }
        return false;
    }
    
    async getCartItems() {
        return await this.storage.get(CART_KEY);
    }
}
