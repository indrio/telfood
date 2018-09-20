import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import firebase from 'firebase/app';
import 'firebase/database';

import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';


const USER_KEY = 'loggedUser';

export class User {
    key: string = null;
    username: string;
    password: string;
    user_type: string;
    merchant_id: string;
    
    constructor(key: string, username: string, password: string, user_type: string, merchant_id) {
        this.key = key;
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
    
    constructor(public storage: Storage,
                private events: Events) {}
    
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
                                      key, 
                                      tempUsers[key].username, 
                                      tempUsers[key].password, 
                                      tempUsers[key].user_type,
                                      tempUsers[key].merchant_id
                                  );

                                  this.events.publish('userLogged');
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
  
  public updateToken(token) {
      console.log(this.currentUser);
      
      this.userRef.child(this.currentUser.key).update({google_token:token})
      .then(function() {
          console.log('Synchronization succeeded');
      })
      .catch(function(error) {
          console.log('Synchronization failed');
      }); 
  }
  
  public register(credentials) {
      if (credentials.email === null || credentials.password === null) {
          return Observable.throw("Please insert credentials");
      } else {
          // At this point store the credentials to your backend!
          return Observable.create(observer => {
              this.userRef.push(new User(
                                      null,
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
  
  public getMerchantUserByMerchantId(merchantId) {
      //TODO
      return "dE0P5qCIvgE:APA91bGtGL7CHNlP8ZzynhSjMDuQMaItI14T-nL08rETcEfN52KM_vYy40GvKqlCrN1NcHDFDPX966uldVqbm_bxa3emis1FadxqqPeVpNSefFr7kWCk3lVe45MEaWJPLVRrQYrpG8yH";
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
