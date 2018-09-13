import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
    username = '';
    email = '';
    
    constructor(private nav: NavController, private auth: AuthServiceProvider) {
        //let info = this.auth.getUserInfo();
        //this.username = info['name'];
        //this.email = info['email'];
    }

    public logout() {
        this.auth.logout().subscribe(succ => {
            this.nav.setRoot('LoginPage')
        });
    }
}
