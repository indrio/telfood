//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Events } from 'ionic-angular';
import firebase from 'firebase';

/*
  Generated class for the MerchantProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MerchantProvider {
    merchantRef = firebase.database().ref("merchant");
    merchants: Array<{id: string, name: string, address: string, open_hour: string, icon: string}> = [];
    
    constructor(public events: Events) {}
    
    getMerchants(category) {
        this.merchantRef.orderByChild('category').equalTo(category.id).once('value', (snap) => {
            this.merchants = [];
            if (snap.val()) {
                var tempMerchants = snap.val();
                for (var key in tempMerchants) {
                    let singleMerchant = {
                        id: key,
                        name: tempMerchants[key].name,
                        address: tempMerchants[key].address,
                        open_hour: tempMerchants[key].open_hour,
                        icon: tempMerchants[key].icon
                    };
                    
                    this.merchants.push(singleMerchant);
                }
            }
            this.events.publish('merchantsLoaded');
        });
    }

}
