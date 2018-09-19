import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Events } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { MerchantProvider } from '../../providers/merchant/merchant';

/**
 * Generated class for the MerchantsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-merchants',
  templateUrl: 'merchants.html',
})
export class MerchantsPage {
    selectedCategory: any;
    
    merchants: Array<{id: string, name: string, address: string, open_hour: string, icon: string}>;
    
    constructor(public nav: NavController, 
                public navParams: NavParams, 
                private loadingCtrl: LoadingController,
                private merchantService: MerchantProvider,
                private events: Events,
                private auth: AuthServiceProvider ) {
        
        this.selectedCategory = navParams.get('category');
    }
    
    ionViewWillEnter() {
        this.getMerchants(this.selectedCategory);
    }
    
    ionViewDidLeave() {
        this.events.unsubscribe('merchantsLoaded');
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
    
    getMerchants(category) {
        let loader = this.loadingCtrl.create({
            content: 'Loading Merchants..'
        });
        
        
        loader.present();
        
        this.merchantService.getMerchants(category);
        
        this.events.subscribe('merchantsLoaded', () => {
            this.merchants = this.merchantService.merchants;
            
            /*
            if(this.merchants.length>0){
                this.promoImagesLoaded =true;
            }
            */
            loader.dismiss();
        });
    }
}
