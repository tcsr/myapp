import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector:'errorpage',
    templateUrl: 'error-page.component.html'
})

export class ErrorPageComponent{
    constructor(private router:Router){}
}