import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Events } from 'ionic-angular';
import { MerchantMenuProvider } from '../../providers/merchant-menu/merchant-menu';

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
              private events: Events) {
                  
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
    
    getMenus(merchant) {
        console.log(merchant);
        let loader = this.loadingCtrl.create({
            content: 'Loading Menu Merchants..'
        });
        
        
        loader.present();
        
        this.menuService.getMenus(merchant);
        
        this.events.subscribe('menusLoaded', () => {
            this.menus = this.menuService.menus;
        
            console.log(this.menus);
            
            /*
            if(this.merchants.length>0){
                this.promoImagesLoaded =true;
            }
            */
            loader.dismiss();
        });
    }
}
