mainPD:any = {};
  pd: any =[];
  panelData = {};

  panelArray: any = [];
  panelKeys: any;
  filteredPanelArray: any = [];
  matchedPanel: any = {};


this.dynamicData['dynamicFields'].PANEL_CONFIG.forEach(element => {
      this.panelKeys = Object.keys(element);
      console.log(this.panelKeys);
    });


    this.dynamicData["dynamicFields"].PANEL_DETAILS.forEach(fields => {

      if (this.panelKeys.includes(fields.SCR_LOC)) {   //this.panelKeys.indexOf(fields.SCR_LOC) > -1
        let panel = fields.SCR_LOC;
        let panels = this.dynamicData['dynamicFields'].PANEL_CONFIG[0][panel];
        panels["PANEL_CONTENT"] = fields;
        this.pd.push(panels);
        // this.matchedPanel[panelElement] = fields;
        this.panelArray.push(fields);
        // console.log(this.matchedPanel);
      }
    });
    console.log(this.pd);

-------------------------------------------------------------------------------------------------
updateIteration(){   
    let iterations= [];
       if(this.selected){          
            this.selected.forEach((elem,index) =>{          
                iterations.push({
                    iteration: index + 1,
                    response: elem.value,
                    responseMetadata:{
                        allowedResponses:[],
                        chosenResponses:[elem]
                    }
            });
            });  
        }   
        if(this.selected.length == 0){
            iterations.push({
                iteration:0,
                response:"",
                responseMetadata:{
                    allowedResponses:[],
                    chosenResponses:[]
                }
            });
        }
        this.controlObject.value.iterations = iterations;       
    }
---------------------------------------------------------------------------------------------------

  GetPositions(): Observable<any> {
    const url1 = 'http://localhost:1944/api/job/GetPositions';
    const url = 'assets/dynamic.json';
    return this.http.get(url).map(
      (res) => {
        const data = res.json();
       // console.log(data);
        return data;
      }
    )
  }
  
  loadPositions() {
    return this.empService.GetPositions().subscribe(data => {
      this.dynamicData = data;
    },
      error => {
        console.log(error)
      });
  }
  
  
  
---------------------------------------------------------------------------------------------------
  
  //// First set - JSON

{"DYNAMIC_DATA":[{"PANEL_TYPE":"Panel","PANEL_ORDER":"2","PANEL_CONTENT":[{"NESTED_PANELS":[{"PANEL_ORDER":"4","PANEL_TYPE":"Panel","PANEL_CONTENT":[{"NESTED_PANELS":[{"PANEL_TYPE":"Button_Panel","PANEL_ORDER":"5","PANEL_CONTENT":[{"NESTED_PANELS":[]},{"COMPNT_VAL":"","NXT_SCRN_SEQ":"0.1","COMP_DATA":"0.1","ORDER":"1","COMP_TYPE":"Button","COMP_STATE":"","COMP_NAME":"fab_fab_btn","SCRN_SEQ":"0.00","SCR_LOC":"BTN_PANEL_01","COMP_LABL":"Fabrication"},{"COMPNT_VAL":"","NXT_SCRN_SEQ":"","COMP_DATA":"","ORDER":"2","COMP_TYPE":"Button","COMP_STATE":"","COMP_NAME":"fab_reset_btn","SCRN_SEQ":"0.00","SCR_LOC":"BTN_PANEL_01","COMP_LABL":"Review"}],"SCR_LOC":"PANEL_04","HAS_BORDER":"NO","PANEL_TITLE":"DGiT-Health Data Fabrication","PANEL_ID":"BTN_PANEL_01","COMP_PER_ROW":"2"}]},{"NXT_SCRN_SEQ":{"DISABILITY INCOME(ATTAINED AGE)":"6","MEDICARE SUPPLEMENT":"3","SHORT TERM DISABILITY INCOME":"4","SYSTEM AND POLICY DETAILS":"7","HOSPITAL INCOME":"1","DISABILITY INCOME(ISSUED AGE)":"5","SELECT":"X","LONG TERM CARE":"2"},"COMP_DATA":[{"VALUE":"SELECT","DISPLAY":"SELECT"},{"VALUE":"HOSPITAL INCOME","DISPLAY":"HOSPITAL INCOME"},{"VALUE":"LONG TERM CARE","DISPLAY":"LONG TERM CARE"},{"VALUE":"MEDICARE SUPPLEMENT","DISPLAY":"MEDICARE SUPPLEMENT"},{"VALUE":"SHORT TERM DISABILITY INCOME","DISPLAY":"SHORT TERM DISABILITY INCOME"},{"VALUE":"DISABILITY INCOME(ISSUED AGE)","DISPLAY":"DISABILITY INCOME(ISSUED AGE)"},{"VALUE":"DISABILITY INCOME(ATTAINED AGE)","DISPLAY":"DISABILITY INCOME(ATTAINED AGE)"},{"VALUE":"SYSTEM AND POLICY DETAILS","DISPLAY":"SYSTEM AND POLICY DETAILS"}],"REQUIRED":"true","COMP_TYPE":"Drop_Down","ORDER":"1","COMP_NAME":"PROD_TYPE","COMP_STATE":"E","SCR_LOC":"PANEL_04","SCRN_SEQ":"0.00","COMP_LABL":"Type of Product *"},{"COMPNT_VAL":"","NXT_SCRN_SEQ":"","COMP_DATA":"","REQUIRED":"true","COMP_TYPE":"Text_Box","ORDER":"2","COMP_NAME":"N_F_PLC","COMP_STATE":"E","SCR_LOC":"PANEL_04","SCRN_SEQ":"0.00","COMP_LABL":"Number of Policies *"},{"NXT_SCRN_SEQ":{"California - 05":""},"COMP_DATA":[{"VALUE":"California - 05","DISPLAY":"California - 05"}],"REQUIRED":"true","COMP_TYPE":"Drop_Down","ORDER":"3","COMP_NAME":"State","COMP_STATE":"E","SCR_LOC":"PANEL_04","SCRN_SEQ":"0.00","COMP_LABL":"State*"},{"COMPNT_VAL":"","NXT_SCRN_SEQ":"","COMP_DATA":"","REQUIRED":"true","COMP_TYPE":"Date_Picker","ORDER":"4","COMP_NAME":"fab_date","COMP_STATE":"E","SCR_LOC":"PANEL_04","SCRN_SEQ":"0.00","COMP_LABL":"Effective Date*"}],"PANEL_TITLE":"DGiT-Health Data Fabrication","HAS_BORDER":"YES","SCR_LOC":"PANEL_02","PANEL_ID":"PANEL_04","COMP_PER_ROW":"2"},{"PANEL_ORDER":"3","PANEL_TYPE":"Panel","PANEL_CONTENT":[{"NESTED_PANELS":[]},{"COMPNT_VAL":"","NXT_SCRN_SEQ":"0","COMP_DATA":"0","COMP_TYPE":"Menu","COMP_NAME":"Menu_1","COMP_STATE":"E","SCR_LOC":"PANEL_03","SCRN_SEQ":"0.00","COMP_LABL":"Fabricate"},{"COMPNT_VAL":"","NXT_SCRN_SEQ":"1","COMP_DATA":"1","COMP_TYPE":"Menu","COMP_NAME":"Menu_2","COMP_STATE":"E","SCR_LOC":"PANEL_03","SCRN_SEQ":"0.00","COMP_LABL":"Review Data"}],"PANEL_TITLE":"","HAS_BORDER":"NO","SCR_LOC":"PANEL_02","PANEL_ID":"PANEL_03","COMP_PER_ROW":"1"}]}],"SCR_LOC":"","HAS_BORDER":"NO","PANEL_TITLE":"","PANEL_ID":"PANEL_02","COMP_PER_ROW":"2"},{"PANEL_TYPE":"Panel","PANEL_ORDER":"1","PANEL_CONTENT":[{"NESTED_PANELS":[]},{"COMPNT_VAL":"Project - R20784, R02 - TCWD/IMSH1/WGB/DDFHW0D. Haplex: WZG/DDFHW0C. ROFI: NEWB. LANE: GROUP4-WZG","NXT_SCRN_SEQ":"","COMP_DATA":"","COMP_TYPE":"ENV_LINK","COMP_STATE":"E","COMP_NAME":"StateCd","SCRN_SEQ":"0.00","SCR_LOC":"PANEL_01","COMP_LABL":"Selected Environment :"}],"SCR_LOC":"","HAS_BORDER":"NO","PANEL_TITLE":"","PANEL_ID":"PANEL_01","COMP_PER_ROW":"1"}]}


//// Second set panel ( TABLE + buttons )

{"DYNAMIC_DATA":[{"PANEL_TYPE":"Panel","PANEL_ORDER":"1","PANEL_CONTENT":[{"NESTED_PANELS":[{"PANEL_ORDER":"2","PANEL_TYPE":"Panel","PANEL_CONTENT":[{"NESTED_PANELS":[]},{"COMPNT_VAL":"2","NXT_SCRN_SEQ":"","COMP_DATA":"","COMP_TYPE":"Label","ORDER":"1","COMP_NAME":"Fab_Lbl_Plc_Count","COMP_STATE":"E","SCR_LOC":"PANEL_06","SCRN_SEQ":"0.00","COMP_LABL":"Policy Count"}],"PANEL_TITLE":"","HAS_BORDER":"YES","SCR_LOC":"PANEL_05","PANEL_ID":"PANEL_06","COMP_PER_ROW":"1"},{"PANEL_ORDER":"3","PANEL_TYPE":"Button_Panel","PANEL_CONTENT":[{"NESTED_PANELS":[]},{"COMPNT_VAL":"","NXT_SCRN_SEQ":"","COMP_DATA":"","COMP_TYPE":"Button","COMP_NAME":"fab_test_btn","COMP_STATE":"","SCR_LOC":"BTN_PANEL_02","SCRN_SEQ":"0.00","COMP_LABL":"Update"}],"PANEL_TITLE":"DGiT-Health Data Fabrication","HAS_BORDER":"NO","SCR_LOC":"PANEL_05","PANEL_ID":"BTN_PANEL_02","COMP_PER_ROW":"1"}]},{"COMPNT_VAL":"","SCROLLABLE":"NA","ORDER":"1","ROOT_SEARCH":"true","SCR_LOC":"PANEL_05","SELECTABLE":"true","COMP_LABL":"","SORTABLE":"[PolicyNumber|AgreementIndexId]","NXT_SCRN_SEQ":"","COMP_DATA":"","COMP_TYPE":"BASIC_TABLE","COMP_NAME":"FAB_TABLE","COMP_STATE":"E","SCRN_SEQ":"0.00","NAVIGATABLE":"true","ROW_PER_PAGE":"10"}],"SCR_LOC":"","HAS_BORDER":"YES","PANEL_TITLE":"Fabrication Result","PANEL_ID":"PANEL_05","COMP_PER_ROW":"1"}]}


//// Second set of panel - Table

{"DYNAMIC_DATA":[{"PANEL_TYPE":"Panel","PANEL_ORDER":"1","PANEL_CONTENT":[{"NESTED_PANELS":[{"PANEL_ORDER":"2","PANEL_TYPE":"Panel","PANEL_CONTENT":[{"NESTED_PANELS":[]},{"COMPNT_VAL":"2","NXT_SCRN_SEQ":"","COMP_DATA":"","COMP_TYPE":"Label","ORDER":"1","COMP_NAME":"Fab_Lbl_Plc_Count","COMP_STATE":"E","SCR_LOC":"PANEL_06","SCRN_SEQ":"0.00","COMP_LABL":"Policy Count"}],"PANEL_TITLE":"","HAS_BORDER":"YES","SCR_LOC":"PANEL_05","PANEL_ID":"PANEL_06","COMP_PER_ROW":"1"}]},{"COMPNT_VAL":"","SCROLLABLE":"NA","ORDER":"1","ROOT_SEARCH":"true","SCR_LOC":"PANEL_05","SELECTABLE":"true","COMP_LABL":"","SORTABLE":"[PolicyNumber|AgreementIndexId]","NXT_SCRN_SEQ":"","COMP_DATA":"","COMP_TYPE":"BASIC_TABLE","COMP_NAME":"FAB_TABLE","COMP_STATE":"E","SCRN_SEQ":"0.00","NAVIGATABLE":"true","ROW_PER_PAGE":"10"}],"SCR_LOC":"","HAS_BORDER":"YES","PANEL_TITLE":"Fabrication Result","PANEL_ID":"PANEL_05","COMP_PER_ROW":"1"}]}


------------------------------------------------------------------
 http://plnkr.co/edit/e1SxsnrxrW6adoHotai9?p=preview

import {Component} from 'angular2/core';
import {PanelView} from './tree-view.component';

@Component({
	selector: 'my-app',
	directives: [PanelView],
	template: `
	<h1>Nested Panels</h1>
	<panel-view [panelData]='dynamicData'></panel-view>
	`
})
export class AppComponent { 
  dynamicData = [
    {
      "PANEL_TYPE": "Panel",
      "PANEL_ORDER": "2",
      "PANEL_CONTENT": [
        {
          "NESTED_PANELS": [
            {
              "PANEL_ORDER": "4",
              "PANEL_TYPE": "Panel",
              "PANEL_CONTENT": [
                {
                  "NESTED_PANELS": [
                    {
                      "PANEL_TYPE": "Button_Panel",
                      "PANEL_ORDER": "5",
                      "PANEL_CONTENT": [
                        {
                          "NESTED_PANELS": []
                        },
                        {
                          "COMPNT_VAL": "",
                          "NXT_SCRN_SEQ": "0.1",
                          "COMP_DATA": "0.1",
                          "ORDER": "1",
                          "COMP_TYPE": "Button",
                          "COMP_STATE": "",
                          "COMP_NAME": "fab_fab_btn",
                          "SCRN_SEQ": "0.00",
                          "SCR_LOC": "BTN_PANEL_01",
                          "COMP_LABL": "Fabrication"
                        },
                        {
                          "COMPNT_VAL": "",
                          "NXT_SCRN_SEQ": "",
                          "COMP_DATA": "",
                          "ORDER": "2",
                          "COMP_TYPE": "Button",
                          "COMP_STATE": "",
                          "COMP_NAME": "fab_reset_btn",
                          "SCRN_SEQ": "0.00",
                          "SCR_LOC": "BTN_PANEL_01",
                          "COMP_LABL": "Review"
                        }
                      ],
                      "SCR_LOC": "PANEL_04",
                      "HAS_BORDER": "NO",
                      "PANEL_TITLE": "DGiT-Health Data Fabrication",
                      "PANEL_ID": "BTN_PANEL_01",
                      "COMP_PER_ROW": "2"
                    }
                  ]
                },
                {
                  "NXT_SCRN_SEQ": {
                    "DISABILITY INCOME(ATTAINED AGE)": "6",
                    "MEDICARE SUPPLEMENT": "3",
                    "SHORT TERM DISABILITY INCOME": "4",
                    "SYSTEM AND POLICY DETAILS": "7",
                    "HOSPITAL INCOME": "1",
                    "DISABILITY INCOME(ISSUED AGE)": "5",
                    "SELECT": "X",
                    "LONG TERM CARE": "2"
                  },
                  "COMP_DATA": [
                    {
                      "VALUE": "SELECT",
                      "DISPLAY": "SELECT"
                    },
                    {
                      "VALUE": "HOSPITAL INCOME",
                      "DISPLAY": "HOSPITAL INCOME"
                    },
                    {
                      "VALUE": "LONG TERM CARE",
                      "DISPLAY": "LONG TERM CARE"
                    },
                    {
                      "VALUE": "MEDICARE SUPPLEMENT",
                      "DISPLAY": "MEDICARE SUPPLEMENT"
                    },
                    {
                      "VALUE": "SHORT TERM DISABILITY INCOME",
                      "DISPLAY": "SHORT TERM DISABILITY INCOME"
                    },
                    {
                      "VALUE": "DISABILITY INCOME(ISSUED AGE)",
                      "DISPLAY": "DISABILITY INCOME(ISSUED AGE)"
                    },
                    {
                      "VALUE": "DISABILITY INCOME(ATTAINED AGE)",
                      "DISPLAY": "DISABILITY INCOME(ATTAINED AGE)"
                    },
                    {
                      "VALUE": "SYSTEM AND POLICY DETAILS",
                      "DISPLAY": "SYSTEM AND POLICY DETAILS"
                    }
                  ],
                  "REQUIRED": "true",
                  "COMP_TYPE": "Drop_Down",
                  "ORDER": "1",
                  "COMP_NAME": "PROD_TYPE",
                  "COMP_STATE": "E",
                  "SCR_LOC": "PANEL_04",
                  "SCRN_SEQ": "0.00",
                  "COMP_LABL": "Type of Product *"
                },
                {
                  "COMPNT_VAL": "",
                  "NXT_SCRN_SEQ": "",
                  "COMP_DATA": "",
                  "REQUIRED": "true",
                  "COMP_TYPE": "Text_Box",
                  "ORDER": "2",
                  "COMP_NAME": "N_F_PLC",
                  "COMP_STATE": "E",
                  "SCR_LOC": "PANEL_04",
                  "SCRN_SEQ": "0.00",
                  "COMP_LABL": "Number of Policies *"
                },
                {
                  "NXT_SCRN_SEQ": {
                    "California - 05": ""
                  },
                  "COMP_DATA": [
                    {
                      "VALUE": "California - 05",
                      "DISPLAY": "California - 05"
                    }
                  ],
                  "REQUIRED": "true",
                  "COMP_TYPE": "Drop_Down",
                  "ORDER": "3",
                  "COMP_NAME": "State",
                  "COMP_STATE": "E",
                  "SCR_LOC": "PANEL_04",
                  "SCRN_SEQ": "0.00",
                  "COMP_LABL": "State*"
                },
                {
                  "COMPNT_VAL": "",
                  "NXT_SCRN_SEQ": "",
                  "COMP_DATA": "",
                  "REQUIRED": "true",
                  "COMP_TYPE": "Date_Picker",
                  "ORDER": "4",
                  "COMP_NAME": "fab_date",
                  "COMP_STATE": "E",
                  "SCR_LOC": "PANEL_04",
                  "SCRN_SEQ": "0.00",
                  "COMP_LABL": "Effective Date*"
                }
              ],
              "PANEL_TITLE": "DGiT-Health Data Fabrication",
              "HAS_BORDER": "YES",
              "SCR_LOC": "PANEL_02",
              "PANEL_ID": "PANEL_04",
              "COMP_PER_ROW": "2"
            },
            {
              "PANEL_ORDER": "3",
              "PANEL_TYPE": "Panel",
              "PANEL_CONTENT": [
                {
                  "NESTED_PANELS": []
                },
                {
                  "COMPNT_VAL": "",
                  "NXT_SCRN_SEQ": "0",
                  "COMP_DATA": "0",
                  "COMP_TYPE": "Menu",
                  "COMP_NAME": "Menu_1",
                  "COMP_STATE": "E",
                  "SCR_LOC": "PANEL_03",
                  "SCRN_SEQ": "0.00",
                  "COMP_LABL": "Fabricate"
                },
                {
                  "COMPNT_VAL": "",
                  "NXT_SCRN_SEQ": "1",
                  "COMP_DATA": "1",
                  "COMP_TYPE": "Menu",
                  "COMP_NAME": "Menu_2",
                  "COMP_STATE": "E",
                  "SCR_LOC": "PANEL_03",
                  "SCRN_SEQ": "0.00",
                  "COMP_LABL": "Review Data"
                }
              ],
              "PANEL_TITLE": "",
              "HAS_BORDER": "NO",
              "SCR_LOC": "PANEL_02",
              "PANEL_ID": "PANEL_03",
              "COMP_PER_ROW": "1"
            }
          ]
        }
      ],
      "SCR_LOC": "",
      "HAS_BORDER": "NO",
      "PANEL_TITLE": "",
      "PANEL_ID": "PANEL_02",
      "COMP_PER_ROW": "2"
    },
    {
      "PANEL_TYPE": "Panel",
      "PANEL_ORDER": "1",
      "PANEL_CONTENT": [
        {
          "NESTED_PANELS": []
        },
        {
          "COMPNT_VAL": "Project - R20784, R02 - TCWD/IMSH1/WGB/DDFHW0D. Haplex: WZG/DDFHW0C. ROFI: NEWB. LANE: GROUP4-WZG",
          "NXT_SCRN_SEQ": "",
          "COMP_DATA": "",
          "COMP_TYPE": "ENV_LINK",
          "COMP_STATE": "E",
          "COMP_NAME": "StateCd",
          "SCRN_SEQ": "0.00",
          "SCR_LOC": "PANEL_01",
          "COMP_LABL": "Selected Environment :"
        }
      ],
      "SCR_LOC": "",
      "HAS_BORDER": "NO",
      "PANEL_TITLE": "",
      "PANEL_ID": "PANEL_01",
      "COMP_PER_ROW": "1"
    }
  ];
}

/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
-------------------------------------------------------------------------------------------
import {Component, Input} from 'angular2/core';

@Component ({
  selector: 'panel-view',
  directives: [PanelView],
  template: `
  <div>
    <div *ngFor="#panel of panelData">
      <div>
        {{panel.PANEL_TYPE}}
        {{panel.PANEL_ORDER}}
        {{panel.COMPNT_VAL}}
      </div>
      <panel-view [panelData]="panel.PANEL_CONTENT"></panel-view>
      <br>
    </div>
</div>
  `
})
export class PanelView {
  @Input() panelData: [];
}
  
--------------------------------------------------
<div *ngFor="let pd of dynamicData | orderby: 'PANEL_ORDER'">
  {{pd | json}}
  <br><br><br>
  <div *ngFor="let pc of pd.PANEL_CONTENT">
    <div *ngIf="pc.NESTED_PANELS?.length > 0">
      <panel-component [dynamicData]="pc.NESTED_PANELS"></panel-component>
    </div>
    PC:{{pc | json}}
    <br><br><br>
  </div>
</div>

----------------------------------
import {Component, Input} from 'angular2/core';

@Component ({
  selector: 'tree-view',
  directives: [TreeView],
  template: `
  <ul>
    <li *ngFor="#node of treeData">
      {{node.PANEL_ID}}
      <ul>
      <li *ngFor="#nodeval of node.PANEL_CONTENT">
      {{ nodeval.COMP_NAME }}
      <tree-view [treeData]="nodeval.NESTED_PANELS"></tree-view>
      </li>
      </ul>
    </li>
</ul>
  `
})
export class TreeView {
  @Input() treeData: [];
}
======
	<div *ngFor="let panel of dynamicData " class="row col-md-12">
  <!-- <pre>   {{panel |json}}  </pre> -->

  <!-- <pre>{{panel | json}}</pre> -->

  <div *ngFor="let panelval of panel.PANEL_CONTENT" style="margin-left:10px;" [ngClass]="{'col-md-12': panel.COMP_PER_ROW == 1,'col-md-6': panel.COMP_PER_ROW == 2, 'col-md-4': panel.COMP_PER_ROW == 3, 'col-md-3': panel.COMP_PER_ROW == 4}"
  class="comp-space">

    <!-- <div *ngIf="panel.PANEL_TYPE == 'Panel'" > -->
      <!-- <pre> {{panelval | json}} </pre> -->
      <div [ngSwitch]="panelval.COMP_TYPE">
          <div *ngSwitchCase="'Text_Box'" [style.width.%]="panelval.compWidth">
            <textbox-component [dynamicData]="panelval"></textbox-component>
          </div>
          <div *ngSwitchCase="'textarea'" [style.width.%]="panelval.compWidth">
            <textarea-component [dynamicData]="panelval"></textarea-component>
          </div>
          <div *ngSwitchCase="'radio'">
            <radio-component [dynamicData]="panelval"></radio-component>
          </div>
          <div *ngSwitchCase="'Date_Picker'" [style.width.%]="panelval.compWidth">
            <date-component [dynamicData]="panelval"></date-component>
          </div>
          <div *ngSwitchCase="'checkbox'">
            <checkbox-component [dynamicData]="panelval"></checkbox-component>
          </div>
          <div *ngSwitchCase="'Drop_Down'" [style.width.%]="panelval.compWidth">
            <dropdown-component [dynamicData]="panelval"></dropdown-component>
          </div>
          <div *ngSwitchCase="'label'" [style.width.%]="panelval.compWidth">
            <label-component [dynamicData]="panelval"></label-component>
          </div>
          <div *ngSwitchCase="'empty'" [style.width.%]="panelval.compWidth">
            <empty-component></empty-component>
          </div>
        </div>
    <!-- </div> -->
        
    <div *ngIf="panel.PANEL_TYPE == 'Button_Panel' && panelval.COMP_LABL">
        <!-- <pre> {{panelval | json}} </pre> -->
        <button-component [dynamicData]="panelval"></button-component>
    </div>


    <div>
      <div *ngIf="panelval.COMP_TYPE=='ENV_LINK'" class="row">
        <div class="col-md-9">
          <div style="margin: 8px 0;">
            <envLink-Component [envLinkData]="panelval"></envLink-Component>
          </div>
        </div>
      </div>

      <div class="col-md-3" *ngIf="panelval.COMP_TYPE=='Menu'">
        <menu-component [menuData]='panelval'></menu-component>
      </div>

      <!-- <div *ngIf="panelval.COMP_LABL && panelval.COMP_TYPE!='Menu'">
        {{panelval.COMP_LABL}}
      </div> -->
    </div>

    <panel-component [dynamicData]="panelval.NESTED_PANELS"></panel-component>
  </div>
</div>
