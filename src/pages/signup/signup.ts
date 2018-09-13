import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
    createSuccess = false;
    registerCredentials = { email: '', password: '' };
    
    constructor(private nav: NavController, private auth: AuthServiceProvider, private alertCtrl: AlertController) { }
    
    public login() {
        this.nav.pop();
    }
    
    public register() {
        this.auth.register(this.registerCredentials).subscribe(success => {
            if (success) {
                this.createSuccess = true;
                this.showPopup("Success", "Account created.");
            } else {
                this.showPopup("Error", "Problem creating account.");
            }
        },
        error => {
            this.showPopup("Error", error);
        });
    }

    showPopup(title, text) {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: text,
            buttons: [
                {
                    text: 'OK',
                    handler: data => {
                        if (this.createSuccess) {
                            this.nav.popToRoot();
                        }
                    }
                }
            ]
        });
        alert.present();
    }
}
