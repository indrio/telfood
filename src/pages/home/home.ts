import { Component } from '@angular/core';
import { NavController, LoadingController, Events } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { CategoryProvider } from '../../providers/category/category';
import { MerchantProvider } from '../../providers/merchant/merchant';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

    categories: Array<{id: string, title: string, icon: string}>;
    merchants: Array<{id: string, name: string, address: string, open_hour: string, icon: string}>;
    
    searchTerm : string;
    
    constructor(private nav: NavController, 
                private auth: AuthServiceProvider,
                private loadingCtrl: LoadingController,
                private categoryService: CategoryProvider,
                private merchantService: MerchantProvider,
                private events: Events) {
        
    }
    
    ionViewWillEnter() {
        this.getMerchants();
    }
    
    ionViewDidLeave() {
        this.events.unsubscribe('categoriesLoaded');
        this.events.unsubscribe('merchantsLoaded');
    }

/*
    public logout() {
        this.auth.logout().then(succ => {
            this.nav.setRoot('LoginPage')
        });
    }
*/    
    public detailMerchant(event, category) {
        this.nav.push('MerchantsPage', {
            category: category
        });
    }
    
    public merchantMenus(event, merchant) {
        this.nav.push('MerchantsMenusPage', {
            merchant: merchant
        });
    }
    
    public cart() {
        this.nav.push('CartPage');
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
    
    getCategories() {
        
        let loader = this.loadingCtrl.create({
            content: 'Loading Categories..'
        });
        
        loader.present();
        
        this.categoryService.getCategories();
        
        this.events.subscribe('categoriesLoaded', () => {
            this.categories = this.categoryService.categories;
            loader.dismiss();
        });
    }
    
    getMerchants(){
        let loader = this.loadingCtrl.create({
            content: 'Loading Merchants..'
        });
        
        loader.present();
        
        this.merchantService.getMerchants();
        
        this.events.subscribe('merchantsLoaded', () => {
            this.merchants = this.merchantService.merchants;
            loader.dismiss();
        });
    }
    
    search(event) {
        console.log(event);
        this.nav.push('SearchPage', {
            searchTerm: this.searchTerm
        });
    }
    
}
