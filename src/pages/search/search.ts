import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Events, ToastController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { MerchantProvider } from '../../providers/merchant/merchant';
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
    
    menus: Array<{
        id: string, 
        title: string, 
        description: string, 
        photo: string, 
        price: number
    }>;

    merchants: Array<{id: string, name: string, address: string, open_hour: string, icon: string}>;
    
    constructor(public nav: NavController, 
                public navParams: NavParams, 
                private loadingCtrl: LoadingController,
                private menuService: MerchantMenuProvider,
                private events: Events,
                private cartService: CartProvider,
                public toastCtrl: ToastController,
                private auth: AuthServiceProvider, 
                private merchantService: MerchantProvider) {
                  
                  this.searchTerm = navParams.get('searchTerm');
    }
    
    ionViewDidLoad() {
      this.getMenus(this.searchTerm);
      this.getMerchants();
    }
    
    ionViewDidLeave() {
        this.events.unsubscribe('menusSearchLoaded');
        this.events.unsubscribe('merchantsLoaded');
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
    

    
    async getMerchants(){
        //console.log('getMerchants');
            
        if(this.merchants) {
            //console.log(this.merchants);
        } else if(!this.merchantService.merchants) {
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
            //console.log('menusSearchLoaded');
            //console.log(this.menuService.menus);
            
            //this.menus = this.menuService.menus;
            
            this.menus = [];
            
            //var parseMenus = [];

            for (var key in this.menuService.menus) {
                //console.log(this.menuService.menus[key]);
                
                let menus_merchant = this.getMerchant(parseInt(this.menuService.menus[key].merchant_id));
                console.log(menus_merchant);
                
                let singleMenu = {
                    id: key,
                    merchant: menus_merchant,
                    title: this.menuService.menus[key].title,
                    description: this.menuService.menus[key].description,
                    photo: this.menuService.menus[key].photo,
                    price: this.menuService.menus[key].price
                };
                
                this.menus.push(singleMenu);
            }
            
            console.log(this.menus);
            
            this.searching = false;
        });
    }
    
    search(event) {
        console.log(event);
        this.getMenus(this.searchTerm);
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
}
