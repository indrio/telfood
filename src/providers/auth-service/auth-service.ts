import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { HttpClient } from '@angular/common/http/';
import { HttpHeaders } from '@angular/common/http';

import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';


const USER_KEY = 'loggedUser';

export class User {
    username: string;
    password: string;
    user_type: string;
    merchant_id: string;
    
    constructor(username: string, password: string, user_type: string, merchant_id) {
        this.username = username;
        this.password = password;
        this.user_type = user_type;
        this.merchant_id = merchant_id;
    }
}

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthServiceProvider {  
    
    currentUser: User;
    
    API_URL = "http://indifood.skytechserver.com/api/public/"
    
    constructor(public storage: Storage,
                private events: Events,
                private http: HttpClient) {}
    
  public login(credentials) {
      if (credentials.username === null || credentials.password === null) {
          return Observable.throw("Please insert credentials");
      } else {
          return Observable.create(observer => {
              this.http.get(this.API_URL+'user/'+credentials.username).subscribe(data => {
                  
                  if(data['password'] == credentials.password) {
                      this.currentUser = new User(
                          data['username'], 
                          data['password'], 
                          data['user_type'],
                          data['merchant_id']
                      );

                      this.events.publish('userLogged');
                      observer.next(true);
                      observer.complete();
                  } else {
                      observer.next(false);
                      observer.complete();
                  }
              }, err => {
                  console.log(err);

                  observer.next(false);
                  observer.complete();
              });
          });
      }
  }
  
  public updateToken(token) {
      console.log('updateToken');
      console.log(this.currentUser);

      // At this point store the credentials to your backend!
      //return Observable.create(observer => {
          let body = { google_token: token };
          console.log('post token ');
          console.log(body);
          console.log("to : "+this.API_URL+'user/'+this.currentUser.username);
          
          this.http.put(this.API_URL+'user/'+this.currentUser.username, body).subscribe(data => {
              console.log(data);
              console.log('Synchronization succeeded');
              
              //observer.next(true);
              //observer.complete();
          }, err => {
              console.log(err);
              console.log('Synchronization failed');

              //observer.next(false);
              //observer.complete();
          });
          //});
  }
  
  public register(credentials) {
      if (credentials.email === null || credentials.password === null) {
          return Observable.throw("Please insert credentials");
      } else {
          // At this point store the credentials to your backend!
          return Observable.create(observer => {
              let body = {
                  username: credentials.username,
                  password: credentials.password,
                  user_type: 'user'
              }
              this.http.post(this.API_URL+'user', body).subscribe(data => {
                  console.log(data);
                  
                  observer.next(true);
                  observer.complete();
              }, err => {
                  console.log(err);

                  observer.next(false);
                  observer.complete();
              });
              observer.next(true);
              observer.complete();
          });
      }
  }
  
  public getUserInfo() : User {
      return this.currentUser;
  }
  
  public setUserInfo(loggedUser) {
      this.currentUser = loggedUser;
  }
  
  public logout() {
      return this.storage.remove(USER_KEY)
  }

}
