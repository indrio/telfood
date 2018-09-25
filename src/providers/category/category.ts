import { Injectable } from '@angular/core';

import { Events } from 'ionic-angular';

import { HttpClient } from '@angular/common/http/';
import { HttpHeaders } from '@angular/common/http';

/*
  Generated class for the CategoryProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CategoryProvider {
    categories: Array<{id: string, title: string, icon: string}> = [];
    
    API_URL = "http://indifood.skytechserver.com/api/public/"
    
    constructor(public events: Events,
                private http: HttpClient) {}
    
    getCategories() {
        this.http.get(this.API_URL+'category').subscribe(data => {
            console.log(data);
            if(data) {
                for (var key in data) {
                    let singleCategory = {
                        id: data[key].id_,
                        title: data[key].title,
                        icon: data[key].icon
                    };
                    
                    this.categories.push(singleCategory);
                }
            }
        
            this.events.publish('categoriesLoaded');
        }, err => {
            console.log(err);
        });
    }

}
