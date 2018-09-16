import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { CartProvider } from '../../providers/cart/cart';
import { OrderProvider } from '../../providers/order/order';

/**
 * Generated class for the CartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {
    order:{
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
        delivery_phone:string
    };
    
    constructor(public nav: NavController, 
              public navParams: NavParams, 
              private alertCtrl: AlertController,
              private cartService: CartProvider,
              private orderService: OrderProvider) {
                  
                  this.order = {
                      cartItems:[],
                      totalPrice:0, 
                      delivery_address:'', 
                      delivery_phone:''
                  };
        
                  this.getCartItems();
        
                  console.log('order :');
                  console.log(this.order);
        
                  this.sumTotal();
                  
    }

    /*
    ionViewWillEnter() {
        this.order = {
            cartItems:[],
            totalPrice:0, 
            delivery_address:'', 
            delivery_phone:''
        };
        
        this.getCartItems();
        
        console.log('order :');
        console.log(this.order);
        
        this.sumTotal();
    }
    */
    
  
  public decrement(item) {
      if(item.qty > 0) {
          this.order.cartItems.find(x => x.id == item.id).qty--;
      
          this.cartService.removeFromCart(item);
          this.sumTotal();
      }
  }
  
  public increment(item) {
      this.order.cartItems.find(x => x.id == item.id).qty++;
          
      this.cartService.addToCart(item);
      this.sumTotal();
  }
  
  getCartItems() {
      this.cartService.getCartItems().then(result => {
          console.log('result');
          console.log(result);
          
            if (result) {
                this.order = result;
            }
            
            console.log('this.order');
            console.log(this.order);
            
        });
      
      /*
      this.order.cartItems = [
          {
              id: '001',
              title: 'Martabak Manis Standar',
              description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam id est eget mi lacinia varius.',
              photo: 'martabak',
              qty: 1,
              price: 20000,
              notes:''
          },
          {
              id: '002',
              title: 'Martabak Manis Keju',
              description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam id est eget mi lacinia varius.',
              photo: 'martabak',
              qty: 1,
              price: 30000,
              notes:''
          }
      ];
      */
  }
  
  sumTotal() {
      var total = 0;

      for(var i = 0; i < this.order.cartItems.length; i++){
          var item = this.order.cartItems[i];
          total += (item.price * item.qty);
      }
      
      this.order.totalPrice = total;
      
      return total;
  }
  
  public presentPrompt(item) {
      let alert = this.alertCtrl.create({
          title: 'Notes',
          inputs: [
              {
                  name: 'notes',
                  placeholder: 'Write a notes to seler'
              }
          ],
          buttons: [
              {
                  text: 'Cancel',
                  role: 'cancel',
                  handler: data => {
                      console.log('Cancel clicked');
                  }
              },
              {
                  text: 'Save',
                  handler: data => {
                      item.notes = data.notes;
                  }
              }
          ]
      });
      
      alert.present();
  }
  
  public showConfirm(order) {
      console.log(order);
      const confirm = this.alertCtrl.create({
          title: 'You sure to order ?',
          message: 'Do you sure to order '+order.cartItems.length+' items ?',
          buttons: [
              {
                  text: 'Cancel',
                  handler: () => {
                      console.log('Cancel clicked');
                  }
              },
              {
                  text: 'Confirm',
                  handler: () => {
                      console.log('Confirm clicked');
                      
                      this.doOrder(order);
                  }
              }
          ]
      });
      confirm.present();
  }
  
  public doOrder(order) {
      console.log(order);
  }

}
