import { Injectable } from '@angular/core';

import { Events } from 'ionic-angular';

import { HttpClient } from '@angular/common/http/';
import { HttpHeaders } from '@angular/common/http';

/*
  Generated class for the MerchantProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MerchantProvider {
    merchants: Array<{id: string, name: string, address: string, open_hour: string, icon: string}> = [];
    
    API_URL = "http://indifood.skytechserver.com/api/public/"
    
    constructor(public events: Events,
                private http: HttpClient) {}
    
    getMerchants(category = null) {
        if(category) {
            this.http.get(this.API_URL+'merchant/'+category).subscribe(data => {
                //console.log(data);
                if(data) {
                    for (var key in data) {
                        let singleMerchant = {
                            id: data[key].id_,
                            name: data[key].name,
                            address: data[key].address,
                            open_hour: data[key].open_hour,
                            icon: data[key].icon
                        };
                    
                        this.merchants.push(singleMerchant);
                    }
                }
        
                this.events.publish('merchantsLoaded');
            }, err => {
                console.log(err);
            });
        } else {
            this.http.get(this.API_URL+'merchant').subscribe(data => {
                //console.log(data);
                if(data) {
                    for (var key in data) {
                        let singleMerchant = {
                            id: data[key].id_,
                            name: data[key].name,
                            address: data[key].address,
                            open_hour: data[key].open_hour,
                            icon: data[key].icon
                        };
                    
                        this.merchants.push(singleMerchant);
                    }
                }
        
                this.events.publish('merchantsLoaded');
            }, err => {
                console.log(err);
            });
        }
    }

}
