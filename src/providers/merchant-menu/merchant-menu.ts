import { Injectable } from '@angular/core';

import { Events } from 'ionic-angular';

import { HttpClient } from '@angular/common/http/';
import { HttpHeaders } from '@angular/common/http';

import { Storage } from '@ionic/storage';

const MENU_KEY = 'stored_menus';

/*
  Generated class for the MerchantMenuProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MerchantMenuProvider {
    menus: Array<{id: string, merchant_id: string, title: string, description: string, photo: string, price: number}> = [];
    
    API_URL = "http://indifood.skytechserver.com/api/public/"
    
    constructor(public events: Events, 
                private storage: Storage,
                private http: HttpClient) {}

    getMenus(merchant) {
        console.log(merchant);
        this.menus = [];
        
        this.http.get(this.API_URL+'merchant_menu/'+merchant['id']).subscribe(data => {
            //console.log(data);
            if(data) {
                for (var key in data) {
                    let singleMenu = {
                        id: key,
                        merchant_id: data[key].merchant_id,
                        title: data[key].title,
                        description: data[key].description,
                        photo: data[key].photo,
                        price: data[key].price
                    };
                    
                    this.menus.push(singleMenu);
                }
            }
    
            this.events.publish('menusLoaded');
        }, err => {
            console.log(err);
        });
    }
    
    async searchMenu(searchTerm) {
        //console.log(searchTerm);
        this.menus = [];
        
        if(!searchTerm) {
            this.events.publish('menusSearchLoaded');
            return;
        }
        
        let storedMenus = this.storage.get(MENU_KEY).then(result => {
            //console.log('result');
            //console.log(result);
            if(!result || (new Date().getTime() - result.timestamp > ((1*60*60)*1000))) {

                this.http.get(this.API_URL+'merchant_menu').subscribe(data => {
                    console.log(data);
                    if(data) {
                        //var tempMenus = snap.val();
                        var parseMenus = [];

                        for (var key in data) {
                            let singleMenu = {
                                id: key,
                                merchant_id: data[key].merchant_id,
                                title: data[key].title,
                                description: data[key].description,
                                photo: data[key].photo,
                                price: data[key].price
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
    
                    this.events.publish('menusLoaded');
                }, err => {
                    console.log(err);
                });
            }
             else {
                //console.log('result.menus');
                //console.log(result.menus);
                
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
                
                //console.log('this.menus');
                //console.log(this.menus);
                     
                this.events.publish('menusSearchLoaded');
            }
        });
    }
}
