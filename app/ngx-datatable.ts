 rows = [
    { policyno: 'PC1', policyholdername: 'Chandra', policytype: 'Auto', company1: 'Swimlane', company2: 'Swimlane', company3: 'Swimlane', company4: 'Swimlane' },
    { policyno: 'PC2', policyholdername: 'Sai', policytype: 'Health', company1: 'Swimlane', company2: 'Swimlane', company3: 'Swimlane', company4: 'Swimlane' },
    { policyno: 'PC3', policyholdername: 'Anitha', policytype: 'Fire', company1: 'Swimlane', company2: 'Swimlane', company3: 'Swimlane', company4: 'Swimlane' },
    { policyno: 'PC4', policyholdername: 'Chandra', policytype: 'Auto', company1: 'Swimlane', company2: 'Swimlane', company3: 'Swimlane', company4: 'Swimlane' },
    { policyno: 'PC5', policyholdername: 'Sai', policytype: 'Health', company1: 'Swimlane', company2: 'Swimlane', company3: 'Swimlane', company4: 'Swimlane' },
    { policyno: 'PC6', policyholdername: 'Anitha', policytype: 'Fire', company1: 'Swimlane', company2: 'Swimlane', company3: 'Swimlane', company4: 'Swimlane' },
  ];
  columns = [
    // { prop: 'name' },
    { prop: 'policyno'},
    { prop: 'policyholdername' },
    { prop: 'policytype' },
    { prop: 'Company1' },
    { prop: 'Company2' },
    { prop: 'Company3' },
    { prop: 'Company4' },
  ];
  selected = [];
  onSelect({ selected }) {
    console.log('Select Event', selected, this.selected);

    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event) {
    console.log('Activate Event', event);
  }
  
  <div style='float:left;width:100%'>
        <ngx-datatable
          style="width: 90%"
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
          <ngx-datatable-column name="Policy No" prop="policyno"></ngx-datatable-column>
          <ngx-datatable-column name="Policy Holder Name" prop="policyholdername"></ngx-datatable-column>
          <ngx-datatable-column name="Policy Type" prop="policytype"></ngx-datatable-column>
          <ngx-datatable-column name="Company1"></ngx-datatable-column>
          <ngx-datatable-column name="Company2"></ngx-datatable-column>
          <ngx-datatable-column name="Company3"></ngx-datatable-column>
          <ngx-datatable-column name="Company4"></ngx-datatable-column>
        </ngx-datatable>
      </div>
