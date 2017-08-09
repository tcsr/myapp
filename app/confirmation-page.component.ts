import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import {Location} from '@angular/common';

@Component({
    selector:'confirmpage',
    templateUrl: 'confirmation-page.component.html'
})

export class ConfirmationPageComponent{
    subCode:any = null;
    constructor(private router:Router, private route: ActivatedRoute, private _location:Location){
        this.route.params.forEach((params: Params) => {
            this.subCode = params['subCode'];
        });
    }
}
