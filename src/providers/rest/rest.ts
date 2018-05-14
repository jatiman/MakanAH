import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the RestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RestProvider {
  
  public latit:any;
  public longit:any;
  public isKM:any;
  public ctg:any;
  public rslt:any;
  
  apiUrl = 'https://developers.zomato.com/api/v2.1/';

  constructor(public http: HttpClient) {
    console.log('Hello RestProvider Provider');
  }

  getSearch() {
  return new Promise(resolve => {
    this.http.get(this.apiUrl+'search?lat='+this.latit+'&lon='+this.longit+'&radius='+this.isKM+'&establishment_type='+this.ctg+'&order=asc&count=20&sort=real_distance',{
    	headers: new HttpHeaders().set('user-key', 'xxxxxxxxxxxxxxxxxxxxx'),
    }).subscribe(data => {
      resolve(data);
    }, err => {
      console.log(err);
    });
  });
  }

}
