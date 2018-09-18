import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Events, ToastController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { MerchantMenuProvider } from '../../providers/merchant-menu/merchant-menu';
import { CartProvider } from '../../providers/cart/cart';

/**
 * Generated class for the MerchantsMenusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-merchants-menus',
  templateUrl: 'merchants-menus.html',
})
export class MerchantsMenusPage {
    selectedMerchant: any;
    
    menus: Array<{id: string, title: string, description: string, photo: string, price: number}>;
    
    constructor(public nav: NavController, 
                public navParams: NavParams, 
                private loadingCtrl: LoadingController,
                private menuService: MerchantMenuProvider,
                private events: Events,
                private cartService: CartProvider,
                public toastCtrl: ToastController,
                private auth: AuthServiceProvider) {
                  
        this.selectedMerchant = navParams.get('merchant');
    }
    
    ionViewWillEnter() {
      this.getMenus(this.selectedMerchant);
    }
    
    ionViewDidLeave() {
        this.events.unsubscribe('menusLoaded');
    }
    
    public checkShopStatus = function(open_hour) {
        var open_hours = open_hour.split("-");
        var str_open = open_hours[0].split(":");
        var str_close = open_hours[1].split(":");
        
        var open = new Date().setHours(str_open[0], str_open[1]);
        var close = new Date().setHours(str_close[0], str_close[1]);
        var currentTime = new Date().getTime();
        
        if (currentTime >= open && currentTime <= close) {
            return true;
        }
        
        return false;
    }
    
    public cart() {
        this.nav.push('CartPage');
    }
    
    public addToCart(menu) {
        let cartItem = {
            id: menu.id, 
            merchant_id: menu.merchant_id,
            title: menu.title, 
            description: menu.description, 
            photo: menu.photo, 
            qty : 1, 
            price: menu.price,
            notes: ''
        };
        
        this.cartService.addToCart(cartItem).then((val) => {
            if(val != null)
                this.presentToast(`${menu.title} has been added to cart`);
            else 
                this.presentToast(`You can't order product from different tenant.`);
        });
    }
    
    presentToast(message) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            showCloseButton: true,
            closeButtonText: 'Close'
        });
 
        toast.onDidDismiss(() => {
            //this.nav.push('CartPage');
        });
        toast.present();
    }
    
    getMenus(merchant) {
        let loader = this.loadingCtrl.create({
            content: 'Loading Menu Merchants..'
        });
        
        loader.present();
        
        this.menuService.getMenus(merchant);
        
        this.events.subscribe('menusLoaded', () => {
            this.menus = this.menuService.menus;
            loader.dismiss();
        });
    }
}
