Welcome to MyApp

https://bootsnipp.com/snippets/DOeka

https://stackoverflow.com/questions/40567687/angular-2-insert-a-component-into-the-dom-of-another-component

http://plnkr.co/edit/7jJJhkcgqk4YdjFOXTGF?p=preview

https://plnkr.co/edit/JHpIHR43SvJd0OxJVMfV?p=preview

1. The ViewContainerRef

https://blog.angularindepth.com/exploring-angular-dom-abstractions-80b3ebcfc02

https://dzone.com/articles/building-angular-2-components-on-the-fly-a-dialog

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
===============================================================
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DgitService } from './../../services/dgit.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'panel-component',
  templateUrl: './panel.component.html'
})
export class PanelComponent implements OnInit {

  panelData: any;
  result: any;
  dynamicData: any;


  panelArray: any = [];
  panelKeys: any;
  filteredPanelArray: any = [];
 matchedPanel: any = {};

  constructor(private _dgitService: DgitService) {
    this._dgitService.getData()
      .subscribe(data => {
        this.result = data;
      })
   // console.log(this.result);
  }

  ngOnInit() {

    this.panelData = {
      "panelData": [
        {
          "TITLE": "DGiT-Health Data Fabrication",
          "PANEL_ORDER": "1",
          "COMP_PER_ROW": "2",
          "PANEL_TYPE": "PANEL",
          "HAS_BORDER": "YES",
          "PANEL_CONTENT": [
            {
              type: 'dropdown',
              label: 'Type of Product',
              compWidth: 60,
              order: 1,
              required: true,
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
            ,
            {
              type: 'date',
              label: 'Effective Date',
              compWidth: 30,
              order: 4,
              required: true
            },
            {
              type: 'empty',
              label: '',
              compWidth: "",
              order: 2,
              required: false
            }
            ,
            {
              type: 'dropdown',
              label: 'State',
              compWidth: 40,
              order: 3,
              required: true,
              dropdownData: [
                { value: '05', displayText: 'California - 05' },
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
              label: 'Fabricate',
              order: 5,
              onClick: 'doFabrication()'
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


    this.dynamicData = {
      "dynamicFields": {
        "PANEL_DETAILS": [
          { "NXT_SCRN_SEQ": "", "COMP_DATA": "", "COMP_TYPE": "Label", "COMP_STATE": "E", "COMP_NAME": "", "SCRN_SEQ": "0.00", "SCR_LOC": "Banner", "COMP_LABL": "" },
          { "NXT_SCRN_SEQ": "", "COMP_DATA": "", "COMP_TYPE": "Image", "COMP_STATE": "E", "COMP_NAME": "", "SCRN_SEQ": "0.00", "SCR_LOC": "Banner", "COMP_LABL": "" },
          { "NXT_SCRN_SEQ": "", "COMP_DATA": "", "COMP_TYPE": "Label", "COMP_STATE": "E", "COMP_NAME": "", "SCRN_SEQ": "0.00", "SCR_LOC": "Banner", "COMP_LABL": "" },
          { "NXT_SCRN_SEQ": "", "COMP_DATA": "", "COMP_TYPE": "Label", "COMP_STATE": "E", "COMP_NAME": "user", "SCRN_SEQ": "0.00", "SCR_LOC": "Banner", "COMP_LABL": "" },
          { "NXT_SCRN_SEQ": "", "COMP_DATA": "", "COMP_TYPE": "Image", "COMP_STATE": "E", "COMP_NAME": "home", "SCRN_SEQ": "0.00", "SCR_LOC": "Banner", "COMP_LABL": "" },
          { "NXT_SCRN_SEQ": "", "COMP_DATA": "", "COMP_TYPE": "Image", "COMP_STATE": "E", "COMP_NAME": "logout", "SCRN_SEQ": "0.00", "SCR_LOC": "Banner", "COMP_LABL": "" },
          { "NXT_SCRN_SEQ": "", "COMP_DATA": "", "COMP_TYPE": "ENV_LINK", "COMP_STATE": "E", "COMP_NAME": "StateCd", "SCRN_SEQ": "0.00", "SCR_LOC": "PANEL_01", "COMP_LABL": "Selected Environment :" },

          { "NXT_SCRN_SEQ": "0", "COMP_DATA": "0", "COMP_TYPE": "Menu", "COMP_STATE": "E", "COMP_NAME": "Menu_1", "SCRN_SEQ": "0.00", "SCR_LOC": "PANEL_03", "COMP_LABL": "Fabricate" },
          { "NXT_SCRN_SEQ": "1", "COMP_DATA": "1", "COMP_TYPE": "Menu", "COMP_STATE": "E", "COMP_NAME": "Menu_2", "SCRN_SEQ": "0.00", "SCR_LOC": "PANEL_03", "COMP_LABL": "Review Data" },

          {
            "NXT_SCRN_SEQ": {
              "DISABILITY INCOME(ATTAINED AGE)": "6",
              "SYSTEM AND POLICY DETAILS": "7",
              "SHORT TERM DISABILITY INCOME": "4",
              "MEDICARE SUPPLEMENT": "3",
              "HOSPITAL INCOME": "1",
              "DISABILITY INCOME(ISSUED AGE)": "5",
              "SELECT": "X", "LONG TERM CARE": "2"
            },
            "COMP_DATA": [
              {
                "VALUE": "Hospital Income",
                "DISPLAY": "Hospital Income"
              },
              {
                "VALUE": "LGC",
                "DISPLAY": "Long Term Care"
              },
              {
                "VALUE": "MS",
                "DISPLAY": "Medicare Supplement"
              },
              {
                "VALUE": "SDI",
                "DISPLAY": "Short Term Disability Income"
              },
              {
                "VALUE": "DII",
                "DISPLAY": "Disability Income(Issued Age)"
              },
              {
                "VALUE": "DSA",
                "DISPLAY": "Disability Income(Attained Age)"
              },
              {
                "VALUE": "SPS",
                "DISPLAY": "System and policy details"
              }
            ],
            "COMP_TYPE": "Drop_Down",
            "COMP_STATE": "E",
            "COMP_NAME": "PROD_TYPE",
            "SCRN_SEQ": "0.00",
            "SCR_LOC": "PANEL_04",
            "COMP_LABL": "Type of Product *"
          },
          { "NXT_SCRN_SEQ": "", "COMP_DATA": "", "COMP_TYPE": "Text_Box", "COMP_STATE": "E", "COMP_NAME": "N_F_PLC", "SCRN_SEQ": "0.00", "SCR_LOC": "PANEL_04", "COMP_LABL": "Number of Policies *" },
          { "NXT_SCRN_SEQ": "", "COMP_DATA": [{ "VALUE": "California - 05", "DISPLAY": "California - 05" }], "COMP_TYPE": "Drop_Down", "COMP_STATE": "E", "COMP_NAME": "State", "SCRN_SEQ": "0.00", "SCR_LOC": "PANEL_04", "COMP_LABL": "State*" },
          { "NXT_SCRN_SEQ": "", "COMP_DATA": "", "COMP_TYPE": "Date_Picker", "COMP_STATE": "E", "COMP_NAME": "fab_date", "SCRN_SEQ": "0.00", "SCR_LOC": "PANEL_04", "COMP_LABL": "Effective Date*" },
          { "NXT_SCRN_SEQ": "", "COMP_DATA": "", "COMP_TYPE": "Button", "COMP_STATE": "", "COMP_NAME": "fab_fab_btn", "SCRN_SEQ": "0.00", "SCR_LOC": "PANEL_05", "COMP_LABL": "Fabrication" },
          { "NXT_SCRN_SEQ": "", "COMP_DATA": "", "COMP_TYPE": "Button", "COMP_STATE": "", "COMP_NAME": "fab_reset_btn", "SCRN_SEQ": "0.00", "SCR_LOC": "PANEL_05", "COMP_LABL": "Review" }
        ],
        "PANEL_CONFIG": [
          {
            "PANEL_05": {
              "PANEL_ORDER": "5",
              "COMP_TYPE": "Button_Panel",
              "COMP_NAME": "PANEL_05",
              "HAS_BORDER": "NO",
              "SCR_LOC": "PANEL_04",
              "COMP_ALIGN": "CN",
              "COMP_PER_ROW": "2",
              "TITLE": "DGiT-Health Data Fabrication"
            },
            "PANEL_02": {
              "PANEL_ORDER": "2",
              "COMP_TYPE": "Panel",
              "COMP_NAME": "PANEL_02",
              "HAS_BORDER": "NO",
              "SCR_LOC": "",
              "COMP_ALIGN": "LR",
              "COMP_PER_ROW": "2",
              "TITLE": ""
            },
            "PANEL_01": {
              "PANEL_ORDER": "1",
              "COMP_TYPE": "Panel",
              "COMP_NAME": "PANEL_01",
              "HAS_BORDER": "NO",
              "SCR_LOC": "",
              "COMP_ALIGN": "LR",
              "COMP_PER_ROW": "1",
              "TITLE": ""
            },
            "PANEL_04": {
              "PANEL_ORDER": "4",
              "COMP_TYPE": "Panel",
              "COMP_NAME": "PANEL_04",
              "HAS_BORDER": "YES",
              "SCR_LOC": "",
              "COMP_ALIGN": "LR",
              "COMP_PER_ROW": "2",
              "TITLE": "DGiT-Health Data Fabrication"
            },
            "PANEL_03": {
              "PANEL_ORDER": "3",
              "COMP_TYPE": "Panel",
              "COMP_NAME": "PANEL_03",
              "HAS_BORDER": "NO",
              "SCR_LOC": "PANEL_02",
              "COMP_ALIGN": "LR",
              "COMP_PER_ROW": "1", "TITLE": ""
            }
          }
        ]
      }
    };

    console.log(this.dynamicData);

    this.dynamicData['dynamicFields'].PANEL_CONFIG.forEach(element => {
      this.panelKeys = Object.keys(element);
       console.log(this.panelKeys);
    });

    this.dynamicData["dynamicFields"].PANEL_DETAILS.forEach(fields => {
      this.panelKeys.forEach(panelElement => {
        if (fields.SCR_LOC == panelElement) {

         
          this.matchedPanel[panelElement] = fields;
          this.panelArray.push(this.matchedPanel);
         // console.log(this.matchedPanel);
        }
      });
    });
    console.log(this.matchedPanel);
  }


  onSelectionChanged(result: any) {
    console.log(result);

    this.panelData = {
      "panelData": [
        {
          "TITLE": "DGiT-Health Data Fabrication",
          "PANEL_ORDER": "1",
          "COMP_PER_ROW": "2",
          "PANEL_TYPE": "PANEL",
          "HAS_BORDER": "YES",
          "PANEL_CONTENT": [
            {
              type: 'dropdown',
              label: 'Type of Product',
              compWidth: 60,
              order: 1,
              required: true,
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
            ,
            {
              type: 'date',
              label: 'Effective Date',
              compWidth: 30,
              order: 4,
              required: true
            },
            {
              type: 'textbox',
              label: 'Number of Policies',
              compWidth: 30,
              order: 2,
              required: true
            }
            ,
            {
              type: 'dropdown',
              label: 'State',
              compWidth: 40,
              order: 3,
              required: true,
              dropdownData: [
                { value: '05', displayText: 'California - 05' },
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
              label: 'Fabricate',
              order: 5,
              onClick: 'doFabrication'
            },
            {
              type: 'button',
              label: 'Reset',
              order: 6,
              onClick: 'reset'
            }
          ]
        }
      ]
    };
  }

}
