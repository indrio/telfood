import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Events } from 'ionic-angular';
import firebase from 'firebase';

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
    userRef = firebase.database().ref("user");
    
    currentUser: User;
    
  public login(credentials) {
      if (credentials.username === null || credentials.password === null) {
          return Observable.throw("Please insert credentials");
      } else {
          return Observable.create(observer => {
              this.userRef.orderByChild('username').equalTo(credentials.username).once('value', (snap) => {
                  if (snap.val()) {
                      var tempMerchants = snap.val();
                      for (var key in tempMerchants) {
                          if(tempMerchants[key].username == credentials.username && 
                              tempMerchants[key].password == credentials.password) {
                                  observer.next(true);
                                  this.currentUser = new User(
                                      tempMerchants[key].username, 
                                      tempMerchants[key].password, 
                                      tempMerchants[key].user_type,
                                      tempMerchants[key].merchant_id
                                  );
                                  
                                  observer.complete();
                           } else {
                               observer.next(false);
                               observer.complete();
                          }
                      }
                  } else {
                      observer.next(false);
                      observer.complete();
                  }
              });
          });
      }
  }
  
  public register(credentials) {
      if (credentials.email === null || credentials.password === null) {
          return Observable.throw("Please insert credentials");
      } else {
          // At this point store the credentials to your backend!
          return Observable.create(observer => {
              this.userRef.push(new User(
                                      credentials.username, 
                                      credentials.password, 
                                      'user',
                                      ''
                                  ));
              observer.next(true);
              observer.complete();
          });
      }
  }
  
  public getUserInfo() : User {
      return this.currentUser;
  }
  
  public logout() {
      return Observable.create(observer => {
          this.currentUser = null;
          observer.next(true);
          observer.complete();
      });
  }

}
