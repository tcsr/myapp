Welcome to MyApp
https://jsfiddle.net/udaii/6ssjo51g/#&togetherjs=n5dFm1qG6t


 <a [routerLink]="['/']" [routerLinkActive]="['active']" class=" btn btn-default">Home</a>
  <a [routerLink]="['/about']" [routerLinkActive]="['active']" class=" btn btn-default">About</a>
  <div class="outer-outlet">
    <router-outlet></router-outlet>
  </div>
  
  
app.routes.ts:
  
import { Routes, RouterModule } from '@angular/router';

import { HeaderComponent } from './header/header.component';
import { TableComponent } from './table/table.component';

const routes: Routes = [
  { path: '', component: HeaderComponent },
  { path: 'about', component: TableComponent }
];

export const appRouterModule = RouterModule.forRoot(routes);

app.module.ts:

import { RouterModule } from '@angular/router';
import { appRouterModule } from "./app.routes";

imports: [ appRouterModule ],
