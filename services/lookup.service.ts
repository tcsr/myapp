import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class LookupService {
    constructor(private _http: Http) { }
    getLookup(lookupApi: string){
        return this._http.get(`${lookupApi}`).map(res => res.json());
    }
}
