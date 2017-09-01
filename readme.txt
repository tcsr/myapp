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
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HeaderComponent },
    { path: 'about', component: TableComponent }
];

export const appRouterModule = RouterModule.forRoot(routes);

app.module.ts:

import { RouterModule } from '@angular/router';
import { appRouterModule } from "./app.routes";

imports: [ appRouterModule ],

--------------------------------
<div *ngFor="let pd of panelData.panelData | orderby: 'PANEL_ORDER'">
  <div class="panel" *ngIf="pd.PANEL_CONTENT" class="borderedPanel">
    <!-- && pd.PANEL_TYPE == 'PANEL' -->
    <div class="panel-head text-center" *ngIf="pd.TITLE">
      <h2 class="panel-title"> {{pd.TITLE}}</h2>
    </div>
    <div class="panel-body rdNav">
      <div *ngIf="pd.PANEL_TYPE == 'PANEL'">
        <div *ngFor="let df of pd.PANEL_CONTENT  | orderby: 'order'" [ngClass]="{'col-md-12': pd.COMP_PER_ROW == 1,'col-md-6': pd.COMP_PER_ROW == 2, 'col-md-4': pd.COMP_PER_ROW == 3, 'col-md-3': pd.COMP_PER_ROW == 4, 'col-md-1': df.type =='label' &&  df.label == '(or)'}"
          class="comp-space">
          <div [ngSwitch]="df.type">
            <div *ngSwitchCase="'textbox'" [style.width.%]="df.compWidth">
              <textbox-component [dynamicData]="df"></textbox-component>
            </div>
            <div *ngSwitchCase="'textarea'" [style.width.%]="df.compWidth">
              <textarea-component [dynamicData]="df"></textarea-component>
            </div>
            <div *ngSwitchCase="'radio'">
              <radio-component [dynamicData]="df"></radio-component>
            </div>
            <div *ngSwitchCase="'date'" [style.width.%]="df.compWidth">
              <date-component [dynamicData]="df"></date-component>
            </div>
            <div *ngSwitchCase="'checkbox'">
              <checkbox-component [dynamicData]="df"></checkbox-component>
            </div>
            <div *ngSwitchCase="'dropdown'" [style.width.%]="df.compWidth">
              <dropdown-component [dynamicData]="df"></dropdown-component>
            </div>
            <div *ngSwitchCase="'label'" class="col-md-1">
              <!--  [ngClass]="{'col-md-1': df.label == (or) }" -->
              <label-component [dynamicData]="df"></label-component>
            </div>
            <div *ngSwitchCase="'empty'" [style.width.%]="df.compWidth">
              <empty-component></empty-component>
            </div>
          </div>
        </div>
      </div>
      <div *ngIf="pd.PANEL_TYPE == 'BTN_PANEL'" class="row btnRow">
        <span *ngFor="let pc of pd.PANEL_CONTENT | orderby:'order'" class="btnRed"> 
                  <button-component [buttonData]="pc"></button-component>
       </span>
      </div>
    </div>

  </div>
</div>


--------------------------------
this.panelData = {
      "panelData": [
        {
          "TITLE": "DGiT-Health Review Data",
          "PANEL_ORDER": "1",
          "COMP_PER_ROW": "4",
          "PANEL_TYPE": "PANEL",
          "HAS_BORDER": "YES",
          "PANEL_CONTENT": [
            {
              type: 'dropdown',
              label: 'User',
              compWidth: "",
              order: 1,
              required: true,
              dropdownData: [
                { value: 'DS4D', displayText: 'DS4D' },
                { value: 'FO9I', displayText: 'FO9I' },
                { value: 'WN7N', displayText: 'WN7N' }
              ]
            }
            ,
            {
              type: 'label',
              label: '(or)',
              compWidth: "",
              order: 2,
              required: false
            },
            {
              type: 'label',
              label: '(or)',
              compWidth: "",
              order: 4,
              required: false
            },
            {
              type: 'textbox',
              label: 'Project',
              compWidth: "",
              order: 5,
              required: false
            },
            {
              type: 'empty',
              label: '',
              compWidth: "",
              order: 7,
              required: false
            },
            {
              type: 'date',
              label: 'Effective Date (Optional)',
              compWidth: "",
              order: 8,
              required: false
            },
            {
              type: 'textbox',
              label: 'Policy Number',
              compWidth: "",
              order: 3,
              required: true
            }
            ,
            {
              type: 'dropdown',
              label: 'Type of Product (Optional)',
              compWidth: "",
              order: 6,
              required: false,
              dropdownData: [
                { value: 'HI', displayText: 'Hospital Income' },
                { value: 'LGC', displayText: 'Long Term Care' },
                { value: 'MS', displayText: 'Medicare Supplement' },
                { value: 'SDI', displayText: 'Short Term Disability Income' },
                { value: 'DII', displayText: 'Disability Income(Issued Age)' },
                { value: 'DSA', displayText: 'Disability Income(Attained Age)' },
                { value: 'SPS', displayText: 'System and policy details' }
              ]
            }
          ]
        },
        {
          "TITLE": "",
          "PANEL_ORDER": "2",
          "COMP_PER_ROW": "3",
          "PANEL_TYPE": "PANEL",
          "HAS_BORDER": "NO",
          "PANEL_CONTENT": ""
        },
        {
          "TITLE": "",
          "PANEL_ORDER": "3",
          "COMP_PER_ROW": "2",
          "PANEL_TYPE": "BTN_PANEL",
          "HAS_BORDER": "NO",
          "PANEL_CONTENT": [
            {
              type: 'button',
              label: 'Review',
              order: 5,
              onClick: 'doReview()'
            },
            {
              type: 'button',
              label: 'Reset',
              order: 6,
              onClick: 'reset()'
            }
          ]
        }
      ]
    };
