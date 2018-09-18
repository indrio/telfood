import { Component } from '@angular/core';
import { NavController, LoadingController, Events } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { CategoryProvider } from '../../providers/category/category';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

    categories: Array<{id: string, title: string, icon: string}>;
    
    constructor(private nav: NavController, 
                private auth: AuthServiceProvider,
                private loadingCtrl: LoadingController,
                private categoryService: CategoryProvider,
                private events: Events) {
        
    }
    
    ionViewWillEnter() {
        this.getCategories();
    }
    
    ionViewDidLeave() {
        this.events.unsubscribe('categoriesLoaded');
    }

    public logout() {
        this.auth.logout().subscribe(succ => {
            this.nav.setRoot('LoginPage')
        });
    }
    
    public detailMerchant(event, category) {
        this.nav.push('MerchantsPage', {
            category: category
        });
    }
    
    public cart() {
        this.nav.push('CartPage');
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
}
