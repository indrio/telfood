//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Events } from 'ionic-angular';
import firebase from 'firebase';

/*
  Generated class for the MerchantMenuProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MerchantMenuProvider {
    menuRef = firebase.database().ref("merchant_menu");
    menus: Array<{id: string, title: string, description: string, photo: string, price: number}> = [];

    constructor(public events: Events) {}

    getMenus(merchant) {
        this.menuRef.orderByChild('merchant_id').equalTo(merchant.id).once('value', (snap) => {
            this.menus = [];
            if (snap.val()) {
                var tempMenus = snap.val();
                for (var key in tempMenus) {
                    let singleMenu = {
                        id: key,
                        title: tempMenus[key].title,
                        description: tempMenus[key].description,
                        photo: tempMenus[key].photo,
                        price: tempMenus[key].price
                    };
                    
                    this.menus.push(singleMenu);
                }
            }
            this.events.publish('menusLoaded');
        });
    }
}
