import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Http, Headers, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class SearchComponentService {

    constructor(private _http: Http) { }
    
      getSearchNames(searchApi: string,searchName: string) {
         return this._http.get(`${searchApi}/${searchName}`)
          .map(res => {
           let displayNames = [];
           let results = res.json().options;
          		for(let item in results){
          			displayNames[item] = results[item].display;
          		}
          		return displayNames;
          });
    }
}