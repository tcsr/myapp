<div style='width:100%'>
        <ngx-datatable
          style="width: 100%"
          class="material"
          [rows]="rows"
          [columnMode]="'force'"
          [headerHeight]="50"
          [footerHeight]="50"
          [rowHeight]="'auto'"
          [limit]="5"
          [selected]="selected"
          [selectionType]="'checkbox'"
          (activate)="onActivate($event)"
          (select)='onSelect($event)'>
          <ngx-datatable-column
            [width]="30"
            [sortable]="false"
            [canAutoResize]="false"
            [draggable]="false"
            [resizeable]="false"
            [headerCheckboxable]="true"
            [checkboxable]="true">
          </ngx-datatable-column>

          <div *ngFor="let clmn of columns">   
            <ngx-datatable-column name="{{clmn.prop}}" prop="{{clmn.prop}}"></ngx-datatable-column>
          </div>
         
        </ngx-datatable>
      </div>


     <table class="table table-bordered table-condensed"> 
        <thead>
          <tr>
            <th>
              <input type="checkbox" />
            </th>
            <th  *ngFor="let clmn of columns">
              {{clmn.prop}}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let row of rows">
            <td><input type="checkbox" /></td>
           <td *ngFor="let col of columns" >{{ col.prop }}{{row + [policyno]}}</td>    
           <!-- col :{ "prop": "policyno" }   -->
          </tr>
        </tbody>
      </table>



import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'table-component',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  constructor() { }

  tableColumns: any[] = [];
  columns: any[] = [];
  column: any = {};
  rows = [
    { policyno: 'PC1', policyholdername: 'Chandra', policytype: 'Auto', company1: 'Swimlane', company2: 'Swimlane', company3: 'Swimlane', company4: 'Swimlane' },
    { policyno: 'PC2', policyholdername: 'Sai', policytype: 'Health', company1: 'Swimlane', company2: 'Swimlane', company3: 'Swimlane', company4: 'Swimlane' },
    { policyno: 'PC3', policyholdername: 'Anitha', policytype: 'Fire', company1: 'Swimlane', company2: 'Swimlane', company3: 'Swimlane', company4: 'Swimlane' },
    { policyno: 'PC4', policyholdername: 'Chandra', policytype: 'Auto', company1: 'Swimlane', company2: 'Swimlane', company3: 'Swimlane', company4: 'Swimlane' },
    { policyno: 'PC5', policyholdername: 'Sai', policytype: 'Health', company1: 'Swimlane', company2: 'Swimlane', company3: 'Swimlane', company4: 'Swimlane' },
    { policyno: 'PC6', policyholdername: 'Anitha', policytype: 'Fire', company1: 'Swimlane', company2: 'Swimlane', company3: 'Swimlane', company4: 'Swimlane' },
  ];

  ngOnInit() {
    this.tableColumns = Object.keys(this.rows[0]);
    this.tableColumns.forEach(element => {
      this.columns.push({
        prop: element
      });
    });
  }

  selected = [];
  onSelect({ selected }) {
    // console.log('Select Event', selected, this.selected);

    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
    console.log(this.selected);
  }

  onActivate(event) {
    console.log('Activate Event', event);
  }
}
