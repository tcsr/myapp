
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable()
export class TokenAuthService {
    private _token: any = null;
    private name = "authtoken";
    public envURL: any = environment.URL;
    
    authenticate() {
        this._token = this.getTokenCookie(document.cookie, this.name);
        if (!this._token) {
            this.redirect();
        }        
    }

    redirect() {
        window.location.href = this.envURL;
    }

    getTokenCookie(cookie: any, name: any) {
        var value = "; " + cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2)
        return parts.pop().split(";").shift();
    }
}
