import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { environment } from '../config/environment';


@Injectable()
export class FormLoaderService {
    private environmentMap = environment; 
    private environmentUrl;
    constructor(private _http: Http) {
        
    }
    getForm(formCode:string, formVersionCode:string, formSubCode:string, envName:string, userToken:string){
        this.environmentUrl = this.environmentMap[envName];
        let headers = new Headers();
        if(userToken){
            headers.append('Authorization', "Bearer "+userToken);  
        }
        if(formSubCode){
            return this._http.get(`${this.environmentUrl}/formSubmission/submissionCode/${formSubCode}`, { headers: headers }).map(res => res.json());
        }else{
            if(!formVersionCode){
                return this._http.get(`${this.environmentUrl}/form/formCode/${formCode}`, { headers: headers }).map(res => res.json());
            }else{
                return this._http.get(`${this.environmentUrl}/form/formCode/${formCode}/formVersion/${formVersionCode}`, { headers: headers }).map(res => res.json());
            }            
        }
    }
    postForm(formPostData: any, envName:string) {
        this.environmentUrl = this.environmentMap[envName];
        var jsonPostBody = JSON.stringify(formPostData);
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this._http.post(`${this.environmentUrl}/formSubmission`, jsonPostBody, { headers: headers })
            .map(res => res.json());
    }
}
