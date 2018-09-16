import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

export class User {
  username: string;
  password: string;
  user_type: string;
 
  constructor(username: string, password: string, user_type: string) {
    this.username = name;
    this.password = password;
    this.user_type = user_type;
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
  
  public login(credentials) {
      if (credentials.username === null || credentials.password === null) {
          return Observable.throw("Please insert credentials");
      } else {
          return Observable.create(observer => {
              // At this point make a request to your backend to make a real check!
              let access = (credentials.password === "12345" && credentials.username === "6210101");
              this.currentUser = new User(credentials.username, credentials.password, 'merchant');
              observer.next(access);
              observer.complete();
          });
      }
  }
  
  public register(credentials) {
      if (credentials.email === null || credentials.password === null) {
          return Observable.throw("Please insert credentials");
      } else {
          // At this point store the credentials to your backend!
          return Observable.create(observer => {
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
