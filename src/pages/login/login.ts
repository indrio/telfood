import { Component } from '@angular/core';
import { IonicPage, Platform, NavController, AlertController, LoadingController, Loading, Events } from 'ionic-angular';
import { HomePage } from '../home/home';
import { OrderPage } from '../order/order';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { Storage } from '@ionic/storage';

import { FCM } from '@ionic-native/fcm';

const USER_KEY = 'loggedUser';

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
    
    constructor(public platform: Platform,
                private nav: NavController, 
                private auth: AuthServiceProvider, 
                private alertCtrl: AlertController, 
                private loadingCtrl: LoadingController,
                public storage: Storage,
                private fcm: FCM,
                private events: Events) {}
    
    ionViewWillEnter() {
        this.fcm.subscribeToTopic('marketing');
        
        this.isUserLogged().then(result => {
            console.log(result);
            
            if(result) {
                let user = JSON.parse(result);
                
                this.auth.setUserInfo(user);

                this.events.publish('userLogged');
                
                if(user.user_type == 'user')
                    this.nav.setRoot(HomePage);
                else if(user.user_type == 'merchant')
                    this.nav.setRoot(OrderPage);
            }
        });
    }
    
    public createAccount() {
        this.nav.push('SignupPage');
    }
      
    public login(){
        this.showLoading();
        
        this.auth.login(this.registerCredentials).subscribe(allowed => {
            if (allowed) {
                this.storage.set(USER_KEY, JSON.stringify(this.auth.getUserInfo()));
                
                if(this.auth.getUserInfo().user_type == 'user') {
                    this.nav.setRoot(HomePage);
                }
                else if(this.auth.getUserInfo().user_type == 'merchant') {
                    if(this.platform.is('cordova')) {
                        this.fcm.getToken().then(token => {
                            console.log('token : '+token);
                        
                            this.auth.updateToken(token);
                        });
                    
                        this.fcm.onNotification().subscribe(data => {
                            if(data.wasTapped){
                                console.log("Received in background");
                                console.log(data);
                            } else {
                                console.log("Received in foreground");
                                console.log(data);
                            };
                        });
                      }
                    
                    this.nav.setRoot(OrderPage);
                }
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
    
    isUserLogged() {
        return this.storage.get(USER_KEY);
    }
    
}
