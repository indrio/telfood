import { Injectable } from '@angular/core';

import { Events } from 'ionic-angular';

import firebase from 'firebase/app';
import 'firebase/database';

/*
  Generated class for the CategoryProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CategoryProvider {
    categoryRef = firebase.database().ref("category");
    categories: Array<{id: string, title: string, icon: string}> = [];
    
    constructor(public events: Events) {}
    
    getCategories() {
        this.categoryRef.once('value', (snap) => {
            this.categories = [];
            if (snap.val()) {
                var tempCategories = snap.val();
                
                for (var key in tempCategories) {
                    let singleCategory = {
                        id: key,
                        title: tempCategories[key].title,
                        icon: tempCategories[key].icon
                    };
                    
                    this.categories.push(singleCategory);
                }
            }
            this.events.publish('categoriesLoaded');
        });
    }

}
