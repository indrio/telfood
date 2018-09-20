import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Events, ToastController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { MerchantMenuProvider } from '../../providers/merchant-menu/merchant-menu';
import { CartProvider } from '../../providers/cart/cart';

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
    searchTerm: any;
    searching: any = false;
    
    menus: Array<{id: string, title: string, description: string, photo: string, price: number}>;
    
    constructor(public nav: NavController, 
                public navParams: NavParams, 
                private loadingCtrl: LoadingController,
                private menuService: MerchantMenuProvider,
                private events: Events,
                private cartService: CartProvider,
                public toastCtrl: ToastController,
                private auth: AuthServiceProvider) {
                  
                  this.searchTerm = navParams.get('searchTerm');
    }
    
    ionViewDidLoad() {
      this.getMenus(this.searchTerm);
    }
    
    ionViewDidLeave() {
        this.events.unsubscribe('menusSearchLoaded');
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
    
    getMenus(searchTerm) {
        this.searching = true;
        
        this.menuService.searchMenu(searchTerm);
        
        this.events.subscribe('menusSearchLoaded', () => {
            console.log('menusSearchLoaded');
            console.log(this.menuService.menus);
            
            this.menus = this.menuService.menus;
            this.searching = false;
        });
    }
    
    search(event) {
        console.log(event);
        this.getMenus(this.searchTerm);
    }
}
