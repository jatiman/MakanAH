import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import { Http, Response } from '@angular/http';

/*
  Generated class for the RemoteServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/


@Injectable()
export class RemoteServiceProvider {
  apiUrl : string = "https://jsonplaceholder.typicode.com";

  constructor(public http: HttpClient) {
    console.log('Hello RemoteServiceProvider Provider');
  }

  getUsers() {
  return new Promise(resolve => {
    this.http.get(this.apiUrl+'/users').subscribe(data => {
      resolve(data);
    }, err => {
      console.log(err);
    });
  });

}
}
