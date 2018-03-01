import { Injectable } from '@angular/core';
import { Http, Headers, Request, RequestOptions, Response, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/finally';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ErrorService } from '../Service/error-service';
import { Router } from '@angular/router';

@Injectable()
export class CommonServiceService {
  private messageSource = new BehaviorSubject<number>(0);
  private subjectAuth = new BehaviorSubject<any>(0);
  currentMessage = this.messageSource.asObservable();
  private baseUrl = 'http://192.168.6.214:8087/obra';
  //  private baseUrl = 'http://localhost:8087/obra';

  data: any;
  error: any;
  constructor(
    private http: Http, private _loadingBar: SlimLoadingBarService, private errorService: ErrorService, private router: Router) {
  }
  changeMessage(message: number) {
    this.messageSource.next(message);
  }

  sendAuthentication(message: any) {
    this.subjectAuth.next({ any: message });
  }
  clearAuthentication() {
    this.subjectAuth.next(0);
  }
  getAuthentication(): Observable<any> {
    return this.subjectAuth.asObservable();
  }

  get(url: string) {
    url = this.setUserNameParam(url);
    return this.request(url, RequestMethod.Get);
  }

  post(url: string, body: object) {
    url = this.setUserNameParam(url);
    return this.request(url, RequestMethod.Post, body);
  }

  put(url: string, body: object) {
    url = this.setUserNameParam(url);
    return this.request(url, RequestMethod.Put, body);
  }

  delete(url: string) {
    url = this.setUserNameParam(url);
    return this.request(url, RequestMethod.Delete);
  }

  private setUserNameParam(url: string) {
    if (localStorage.getItem('currentUser') !== null) {
      const serviceUrl = new URL(`${this.baseUrl}/${url}`);
      const params = new URLSearchParams(serviceUrl.search);
      params.set('userName', localStorage.getItem('currentUser'));
      url = url.split('?')[0] + '?' + params.toString();
    }
    return url;
  }
  private request(url: string, method: RequestMethod, body?: object) {

    const headers = new Headers();
    const token = localStorage.getItem('token');
    if (token) {
      headers.append('Authorization', token);
    }
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');

    const reqeustOptions = new RequestOptions({
      url: `${this.baseUrl}/${url}`,
      method: method,
      headers: headers,
    });

    if (body) {
      reqeustOptions.body = body;
    }
    const request = new Request(reqeustOptions);
    this.startLoading();
    // console.log(this.errorService);
    return this.http.request(request)
      .map(res => {
        if (res.status !== 200) {
          throw new Error('No comments to retrieve! code status ' + res.status);
        } else {
          return res.json();
        }
      })
      .catch(error => this.handleError(error))
      .finally(() => {
        this.stopLoading();
      });
  }
  private handleError(error: Response | any) {
    this.errorService.updateMessage(error.json());
    return Observable.of(error.json());

  }
  startLoading() {
    this._loadingBar.start(() => {
      // console.log('Loading complete');
    });
  }

  stopLoading() {
    this.completeLoading();
    this._loadingBar.stop();
  }

  completeLoading() {
    this._loadingBar.complete();
  }

  getBaseUrl() {
    return this.baseUrl;
  }
}
