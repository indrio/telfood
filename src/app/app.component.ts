import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { OrderPage } from '../pages/order/order';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';

import { FCM } from '@ionic-native/fcm';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'LoginPage';

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, 
              public statusBar: StatusBar, 
              public splashScreen: SplashScreen, 
              private auth: AuthServiceProvider, 
              private fcm: FCM) {
                  
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
        { title: 'Home', component: HomePage },
        { title: 'Orders', component: OrderPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        
        if (this.platform.is('cordova')) {
            //Notifications
            this.fcm.subscribeToTopic('order');
            this.fcm.getToken().then(token=>{
                console.log(token);
            })
            this.fcm.onNotification().subscribe(data=>{
                if(data.wasTapped){
                    console.log("Received in background");
                } else {
                    console.log("Received in foreground");
                };
            })
            this.fcm.onTokenRefresh().subscribe(token=>{
                console.log(token);
            });
            //end notifications.
        }
        
        this.statusBar.styleDefault();
        this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
  
  logout() {
      console.log('logout');
      this.auth.logout();
  }
}
