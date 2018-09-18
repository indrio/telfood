import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

import firebase from 'firebase';

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
    userRef = firebase.database().ref("user");
    
    currentUser: User;
    
    constructor(private storage: Storage) {}
    
  public login(credentials) {
      if (credentials.username === null || credentials.password === null) {
          return Observable.throw("Please insert credentials");
      } else {
          return Observable.create(observer => {
              this.userRef.orderByChild('username').equalTo(credentials.username).once('value', (snap) => {
                  if (snap.val()) {
                      var tempUsers = snap.val();
                      
                      for (var key in tempUsers) {
                          if(tempUsers[key].username == credentials.username && 
                              tempUsers[key].password == credentials.password) {
                                  this.currentUser = new User(
                                      tempUsers[key].username, 
                                      tempUsers[key].password, 
                                      tempUsers[key].user_type,
                                      tempUsers[key].merchant_id
                                  );
                                  
                                  //console.log(this.storage.set(USER_KEY, JSON.stringify(this.currentUser)));
                                      
                                  observer.next(true);
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
              }, function(error) {
                  console.error(error);
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
      /*
      this.storage.get(USER_KEY).then(result => {
          if (result) {
              this.currentUser = JSON.parse(result);
          }
      });
      */
      
      return this.currentUser;
  }
  
  public logout() {
      return Observable.create(observer => {
          this.currentUser = null;
          //this.storage.remove(USER_KEY);
          
          observer.next(true);
          observer.complete();
      });
  }

}
