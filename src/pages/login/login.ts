import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';
import { HomePage } from '../home/home';
import { OrderPage } from '../order/order';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
    loading: Loading;
    registerCredentials = { username: '', password: '' };
    
    constructor(private nav: NavController, private auth: AuthServiceProvider, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
    }
    
    public createAccount() {
        this.nav.push('SignupPage');
    }
      
    public login(){
        this.showLoading();
        
        this.auth.login(this.registerCredentials).subscribe(allowed => {
            if (allowed) {
                
                console.log(this.auth.getUserInfo());
                
                if(this.auth.getUserInfo().user_type == 'user')
                    this.nav.setRoot(HomePage);
                else if(this.auth.getUserInfo().user_type == 'merchant')
                    this.nav.setRoot(OrderPage);
            } else {
                this.showError("Access Denied");
            }
        },
        error => {
            this.showError(error);
        });
    }

    showLoading() {
        this.loading = this.loadingCtrl.create({
            content: 'Please wait...',
            dismissOnPageChange: true
        });
        this.loading.present();
    }
    
    showError(text) {
        this.loading.dismiss();
        
        let alert = this.alertCtrl.create({
            title: 'Fail',
            subTitle: text,
            buttons: ['OK']
        });
        alert.present();
    }
}
