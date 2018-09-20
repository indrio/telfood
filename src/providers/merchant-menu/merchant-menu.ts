import { Injectable } from '@angular/core';

import { Events } from 'ionic-angular';

import firebase from 'firebase/app';
import 'firebase/database';

import { Storage } from '@ionic/storage';

const MENU_KEY = 'stored_menus';

/*
  Generated class for the MerchantMenuProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MerchantMenuProvider {
    menuRef = firebase.database().ref("merchant_menu");
    menus: Array<{id: string, title: string, description: string, photo: string, price: number}> = [];

    constructor(public events: Events, private storage: Storage) {}

    getMenus(merchant) {
        this.menuRef.orderByChild('merchant_id').equalTo(merchant.id).once('value', (snap) => {
            this.menus = [];
            if (snap.val()) {
                var tempMenus = snap.val();
                for (var key in tempMenus) {
                    let singleMenu = {
                        id: key,
                        merchant_id: tempMenus[key].merchant_id,
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
    
    async searchMenu(searchTerm) {
        console.log(searchTerm);
        this.menus = [];
        
        if(!searchTerm) {
            this.events.publish('menusSearchLoaded');
            return;
        }
        
        let storedMenus = this.storage.get(MENU_KEY).then(result => {
            console.log('result');
            console.log(result);
            if(!result || (new Date().getTime() - result.timestamp > ((1*60*60)*1000))) {
                this.menuRef.once('value', (snap) => {
                    console.log(snap);
                    if (snap.val()) {
                        var tempMenus = snap.val();
                        var parseMenus = [];

                        for (var key in tempMenus) {
                            let singleMenu = {
                                id: key,
                                merchant_id: tempMenus[key].merchant_id,
                                title: tempMenus[key].title,
                                description: tempMenus[key].description,
                                photo: tempMenus[key].photo,
                                price: tempMenus[key].price
                            };
                            
                            if(singleMenu.title.search(new RegExp(searchTerm,"i")) > -1) {
                                this.menus.push(singleMenu);
                            }
                    
                            parseMenus.push(singleMenu);
                        }
                        
                        this.storage.set(MENU_KEY, {
                            'timestamp': new Date().getTime(),
                            'menus': JSON.stringify(parseMenus)
                        });
                    }

                    this.events.publish('menusSearchLoaded');
                });
            }
             else {
                console.log('result.menus');
                console.log(result.menus);
                
                var tempMenus = JSON.parse(result.menus).filter((item) => {
                    return item.title.search(new RegExp(searchTerm,"i")) > -1;
                });

                for (var key in tempMenus) {
                    let singleMenu = {
                        id: key,
                        merchant_id: tempMenus[key].merchant_id,
                        title: tempMenus[key].title,
                        description: tempMenus[key].description,
                        photo: tempMenus[key].photo,
                        price: tempMenus[key].price
                    };
            
                    this.menus.push(singleMenu);
                }
                
                console.log('this.menus');
                console.log(this.menus);
                     
                this.events.publish('menusSearchLoaded');
            }
        });
    }
}
