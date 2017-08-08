import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FormValidationService,LookupService, SearchComponentService } from './../../services/index';
import { Subscription } from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import { TypeaheadMatch } from 'ng2-bootstrap/components/typeahead/typeahead-match.class';

//Error Messages
@Component({
    selector: 'errorMessages',
    styleUrls: ['question.scss'],
    template: `<span *ngIf="control.touched && control.errors?.required || isSubmitClicked && control.errors?.required"><span class="text-danger required-error">Required</span></span>
               <span *ngIf="control.touched && control.errors?.maxlength" class="text-danger maxLength-error"><span>Maximum character limit exceeded</span></span>
               <span *ngIf="control.touched && control.errors?.pattern" class="text-danger pattern-error">
                   <span *ngIf="params?.validation?.type == 'email'" class="email-error">Please enter a valid email address</span>
                   <span *ngIf="params?.validation?.type == 'phone'">Please enter a valid phone number</span>
                   <span *ngIf="params?.validation?.type == 'regex'">Invalid format</span>
                   <span *ngIf="params?.validation?.type == 'alphanumeric'">Invalid Input data</span>
               </span>
               <span *ngIf="control.touched && control.errors?.Required || isSubmitClicked && control.errors?.Required" class="text-danger required-error">Required</span>
            `
})
export class ErrorMessages {
    @Input() control: any;
    @Input() params: any;
    private isSubmitClicked;
    subscription: Subscription;
    constructor(private _formValidationService: FormValidationService) { this.subscription = this._formValidationService.isSubmitClicked$.subscribe(item => { this.isSubmitClicked = item; }); }
}

//Help Text Component
@Component({
    selector: 'help-text',
    styleUrls: ['question.scss'],
    template: `<span>
                  <span popover="{{helptext}}"
                        popoverPlacement="bottom"
                        [popoverOnHover]="true"
                        [popoverCloseOnMouseOutside]="true">
                        <span class="helptext">i</span>
                   </span>
               </span>
            `
})

export class HelpTextComponent{
    @Input() helptext: any;
}

//Text box Component
@Component({
    selector: 'text-component',
    styleUrls: ['question.scss'],
    template: ` <div [class.has-error]="control.touched &&!control.valid || isSubmitClicked &&!control.valid && !isReadOnly" [attr.id]="sectionId+'_'+questiondata.order+'_div'">
                   <label class="question-label" [attr.for]="sectionId+'_'+questiondata.order">
                        <span class="asterix-space">{{(questiondata.params && questiondata.params.required == 'yes')?'*' : ''}}</span>
                        <span [innerHTML]="questiondata.questionText"></span>
                        <help-text *ngIf="!isReadOnly && questiondata.helpText" [helptext]="questiondata.helpText"></help-text>
                    </label><br/>
                    <input *ngIf="questiondata.params?.validation?.type != 'phone'" class="form-control" [formControl]="control" [attr.type]="questiondata.type" [(ngModel)]="response" [attr.name]="sectionId+'_'+questiondata.order" [attr.id]="sectionId+'_'+questiondata.order" [attr.maxlength]="questiondata.params.charLimit" [readOnly]="isReadOnly">
                    <input *ngIf="questiondata.params?.validation?.type == 'phone'" class="form-control" [textMask]="{mask: mask}"  [formControl]="control" [attr.type]="questiondata.type" [(ngModel)]="response" [attr.name]="sectionId+'_'+questiondata.order" [attr.id]="sectionId+'_'+questiondata.order" [readOnly]="isReadOnly">
                    <errorMessages *ngIf="!isReadOnly" [control]='control' [params]='questiondata.params'></errorMessages>
                    <br/>
                </div><br/>
              `
})
export class TextBoxComponent implements OnInit,OnDestroy {
    @Input() questiondata: any;
    @Output() formSubmissionQuestionData: any = new EventEmitter<any>();
    control: any;
    @Input() sectionId: any;
    private isSubmitClicked;
    subscription: Subscription;
    readOnlySubscription: Subscription;
    private isReadOnly;
    response = "";
    public mask = [/[1-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    constructor(private _formValidationService: FormValidationService) { }
    ngOnInit() {
        this.control = this._formValidationService.buildFormControlwithValidationMessages(this.sectionId+'_'+this.questiondata.order,this.questiondata);
        this.readOnlySubscription = this._formValidationService.isReadOnlyForm$.subscribe(item => {this.isReadOnly = item; this.response = this.questiondata.response;  if(this.isReadOnly)this.control.disable(true);})
        this.subscription = this._formValidationService.isSubmitClicked$.subscribe( item => {this.isSubmitClicked = item;
        (this.questiondata.params.validation != null && (this.questiondata.params.validation.type == "phone")?((this.response)?this.formSubmissionQuestionData.emit(this.response.split('-').join("")):''):this.formSubmissionQuestionData.emit(this.response));
        });    
    }
    
    ngOnDestroy() {
        this.readOnlySubscription.unsubscribe();
        this.subscription.unsubscribe();
    }
}

//Text Area Component
@Component({
    selector: 'textarea-component',
    styleUrls: ['question.scss'],
    template: ` <div [class.has-error]="control.touched &&!control.valid || isSubmitClicked &&!control.valid && !isReadOnly" [attr.id]="sectionId+'_'+questiondata.order+'_div'">
                    <label class="question-label" [attr.for]="sectionId+'_'+questiondata.order">
                        <span class="asterix-space">{{(questiondata.params && questiondata.params.required == 'yes')?'*' : ''}}</span>
                        <span [innerHTML]="questiondata.questionText"></span>
                        <help-text *ngIf="!isReadOnly && questiondata.helpText" [helptext]="questiondata.helpText"></help-text>
                    </label><br/>
                    <textarea class="form-control" [(ngModel)]="response" [formControl]="control" [attr.name]="sectionId+'_'+questiondata.order" [attr.id]="sectionId+'_'+questiondata.order" [attr.maxlength]="questiondata.params.charLimit" [readOnly]="isReadOnly"></textarea>
                    <errorMessages *ngIf="!isReadOnly" [control]='control' [params]='questiondata.params'></errorMessages>
                    <br/>
                </div><br/>
                 `
})

export class TextArearBoxComponent implements OnInit,OnDestroy {
    @Input() questiondata: any;
    @Output() formSubmissionQuestionData: any = new EventEmitter<any>();
    control: any;
    @Input() sectionId: any;
    private isSubmitClicked;
    subscription: Subscription;
    readOnlySubscription: Subscription;
    private isReadOnly;
    response = "";
    constructor(private _formValidationService: FormValidationService) { }
    ngOnInit() {
        this.control = this._formValidationService.buildFormControlwithValidationMessages(this.sectionId+'_'+this.questiondata.order,this.questiondata);
        this.readOnlySubscription = this._formValidationService.isReadOnlyForm$.subscribe(item => {this.isReadOnly = item; this.response = this.questiondata.response;  if(this.isReadOnly)this.control.disable(true);})
        this.subscription = this._formValidationService.isSubmitClicked$.subscribe(item => { this.isSubmitClicked = item; this.formSubmissionQuestionData.emit(this.response);});
    }

    ngOnDestroy() {
        this.readOnlySubscription.unsubscribe();
        this.subscription.unsubscribe();
    }
}


//Date Component
@Component({
    selector: 'date-component',
    styleUrls: ['question.scss'],
    template: ` <div class="dateComponent" [class.has-error]="(control.touched &&!control.valid || isSubmitClicked && !control.valid) && control.errors?.Required && !isReadOnly" [attr.id]="sectionId+'_'+questiondata.order+'_div'">
                    <label class="question-label" [attr.for]="sectionId+'_'+questiondata.order">
                        <span class="asterix-space">{{(questiondata.params && questiondata.params.required == 'yes')?'*' : ''}}</span>
                        <span [innerHTML]="questiondata.questionText"></span>
                        <help-text *ngIf="!isReadOnly && questiondata.helpText" [helptext]="questiondata.helpText"></help-text>
                    </label><br/>
                    <div>
                        <div>
                            <div class='input-group date col-sm-2'>
                                <input type='text' placeholder="mm-dd-yyyy" [textMask]="{mask: mask}" class='form-control' [formControl]="control" [readOnly]="isReadOnly" [attr.id]="sectionId+'_'+questiondata.order">
                                <span class="input-group-addon" (click)="calendarClick($event)">
                                    <span class="glyphicon glyphicon-calendar"></span>
                                </span>
                            </div>
                            <datepicker class="calendar" *ngIf= "openDatePicker" [ngModel]="response" (selectionDone)="dateSelected($event)" [showWeeks]=false (click)="onDatePickerClick($event)"></datepicker>
                        </div>
                    </div>           
                    <errorMessages *ngIf="!isReadOnly" [control]='control' [params]='questiondata.params'></errorMessages>
                    <div *ngIf="control.dirty && !control.valid && !control.errors?.Required && !isReadOnly" class="text-danger validDate-error"><span>Please enter a valid date</span></div>                    
                </div><br/><br/>`  ,
    host: {
    '(document:click)': 'onDocumentClick($event)',
  } 
})

export class DateComponent implements OnInit,OnDestroy {
    @Input() questiondata: any;
    @Output() formSubmissionQuestionData: any = new EventEmitter<any>();
    control: any;
    @Input() sectionId: any;
    private isSubmitClicked;
    subscription: Subscription;
    readOnlySubscription: Subscription;
    private isReadOnly;
    response:any= "";
    private openDatePicker:boolean = false;
    public mask = [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    constructor(private _formValidationService: FormValidationService) {
    }
    ngOnInit() {
        this.control = this._formValidationService.buildFormControlwithValidationMessages(this.sectionId+'_'+this.questiondata.order,this.questiondata);
        this.readOnlySubscription = this._formValidationService.isReadOnlyForm$.subscribe(item => {
            this.isReadOnly = item;
            if(this.isReadOnly)this.control.setValue(this.formatDate(new Date(this.questiondata.response)));
             if(this.isReadOnly)this.control.disable(true)
        });
        this.subscription = this._formValidationService.isSubmitClicked$.subscribe(item => { 
            this.isSubmitClicked = item;
            this.formSubmissionQuestionData.emit(this.control.value);
        });
    }
    formatDate(date){
        let month = (date.getMonth()+1 < 10) ? ('0'+(date.getMonth()+1)) : date.getMonth()+1;
        let day = (date.getDate() < 10) ? ('0'+(date.getDate())) : date.getDate();
        return (month +'-'+ day +'-'+ date.getFullYear());
    }
    onDatePickerClick(event){
        event.stopPropagation();
    }
    onDocumentClick(event){
        this.openDatePicker = false;        
    }
    dateSelected(event){
        this.control.setValue(this.formatDate(event));
        this.openDatePicker = false;
    }
    calendarClick(event){        
        if(this.isReadOnly)return false;
        event.stopPropagation();
        (!this.control.valid) ? this.response = "" : this.response = this.control.value;
        this.openDatePicker = !this.openDatePicker;
    }
    
    ngOnDestroy() {
        this.readOnlySubscription.unsubscribe();
        this.subscription.unsubscribe();
    }
}

//Radio Component
@Component({
    selector: 'radio-component',
    styleUrls: ['question.scss'],
    template: ` <div [class.has-error]="control.touched &&!control.valid && !isReadOnly" [attr.id]="sectionId+'_'+questiondata.order+'_div'">
                    <label class="question-label" [attr.for]="sectionId+'_'+questiondata.order">
                        <span class="asterix-space">{{(questiondata.params && questiondata.params.required == 'yes')?'*' : ''}}</span>
                        <span class="asterix-space">{{(questiondata.params.required == 'conditional' && questiondata.params.conditions[0].required == 'yes')?'*' : ''}}</span>
                        <span [innerHTML]="questiondata.questionText"></span>
                        <help-text *ngIf="!isReadOnly && questiondata.helpText" [helptext]="questiondata.helpText"></help-text>
                    </label>
                    <div class="radio radio-space" *ngFor="let option of questiondata.allowedResponses; let i=index">
                        <label class="radio-chkbx-label"><input type="radio" [checked]="option == response" (click)="onClick($event)" [attr.name]="sectionId+'_'+questiondata.order" [attr.id]="sectionId+'_'+questiondata.order+'_'+i" [attr.value]="option" [disabled]="isReadOnly" >{{option}}</label>
                    </div>
                    <errorMessages *ngIf="!isReadOnly" [control]='control' [params]='questiondata.params'></errorMessages>
                    <br/>
                </div><br/>
                 `
})
    
export class RadioComponent implements OnInit,OnDestroy {
    @Input() questiondata: any;
    @Output() formSubmissionQuestionData: any = new EventEmitter<any>();
    control: any;
    @Input() sectionId: any;
    private isSubmitClicked;
    subscription: Subscription;    
    readOnlySubscription: Subscription;
    private isReadOnly;
    response = "";
    constructor(private _formValidationService: FormValidationService) { }
    ngOnInit() {
        this.control = this._formValidationService.buildFormControlwithValidationMessages(this.sectionId+'_'+this.questiondata.order,this.questiondata);
        this.readOnlySubscription = this._formValidationService.isReadOnlyForm$.subscribe(item => {this.isReadOnly = item; this.response = this.questiondata.response;  if(this.isReadOnly)this.control.disable(true);})
        this.subscription = this._formValidationService.isSubmitClicked$.subscribe(item => { this.isSubmitClicked = item; this.formSubmissionQuestionData.emit(this.response);});
        this.control.valueChanges.subscribe(item => this.response = item);
    }
    onClick($event) {
        this.response = $event.target.value;
        this.control.setValue(this.response);
    }
    ngOnDestroy() {
        this.readOnlySubscription.unsubscribe();
        this.subscription.unsubscribe();
    } 
}

//Checkbox Component
@Component({
    selector: 'checkbox-component',
    styleUrls: ['question.scss'],
    template: ` <div [class.has-error]="control.touched &&!control.valid && !isReadOnly" [attr.id]="sectionId+'_'+questiondata.order+'_div'">
                    <label class="question-label" [attr.for]="sectionId+'_'+questiondata.order+'_'+option">
                        <span class="asterix-space">{{(questiondata.params && questiondata.params.required == 'yes')?'*' : ''}}</span>
                        <span class="asterix-space">{{(questiondata.params.required == 'conditional' && questiondata.params.conditions[0].required == 'yes')?'*' : ''}}</span>
                        <span [innerHTML]="questiondata.questionText"></span>
                        <help-text *ngIf="!isReadOnly && questiondata.helpText" [helptext]="questiondata.helpText"></help-text>
                    </label>
                    <div class="checkbox" *ngFor="let option of questiondata.allowedResponses; let i=index">
                        <label class="radio-chkbx-label"><input type="checkbox" [checked]="response.indexOf(option)!=-1" (change)="onChange($event,option)" [attr.name]="option" [attr.value]="option" [attr.id]="sectionId+'_'+questiondata.order+'_'+i" [disabled]="isReadOnly" >{{option}}</label>
                    </div>
                    <errorMessages *ngIf="!isReadOnly" [control]='control' [params]='questiondata.params'></errorMessages>
                    <br/>
                </div><br/>
                 `
})
    
export class CheckboxComponent implements OnInit,OnDestroy {
    @Input() questiondata: any;
    @Output() formSubmissionQuestionData: any = new EventEmitter<any>();
    control: any;
    @Input() sectionId: any;
    private isSubmitClicked;
    subscription: Subscription;    
    readOnlySubscription: Subscription;
    private isReadOnly;
    responseArrayValues: string;
    response = [];
    constructor(private _formValidationService: FormValidationService) { }
    ngOnInit() {
        this.control = this._formValidationService.buildFormControlwithValidationMessages(this.sectionId+'_'+this.questiondata.order,this.questiondata);
        this.readOnlySubscription = this._formValidationService.isReadOnlyForm$.subscribe(item => {this.isReadOnly = item; if(this.questiondata.response)this.response = this.questiondata.response.split('|');  if(this.isReadOnly)this.control.disable(true);})
        this.subscription = this._formValidationService.isSubmitClicked$.subscribe(item => { this.isSubmitClicked = item;this.response=this.response.filter(Boolean);this.formSubmissionQuestionData.emit(this.response.join("|"));});
        this.control.valueChanges.subscribe(item => {if(!item)this.response = [];});
    }
    onChange($event, option) {
        if ($event.target.checked) {
            if (this.questiondata.params.exclusive != null && option == this.questiondata.params.exclusive) {
                this.response.splice(this.questiondata);
                this.response.push(option);
            } else {
                this.response.push(option);
                if (this.response[0] == this.questiondata.params.exclusive) {
                    this.response.splice(this.response.indexOf(this.response[0]), 1);
                }
            }
        } else {
            this.response.splice(this.response.indexOf(option), 1);
        }
        this.response.length == 0 ? this.control.setValue("") : this.control.setValue(this.response);
        this.control.markAsTouched(true);
    }
    ngOnDestroy() {
        this.readOnlySubscription.unsubscribe();
        this.subscription.unsubscribe();
    }
}

//Information Component
@Component({
    selector: 'info-component',
    styleUrls: ['question.scss'],
    template: `<div>
                  <label  class="question-label">
                    <span>{{questiondata.questionText}}</span>
                    <help-text *ngIf="!isReadOnly && questiondata.helpText" [helptext]="questiondata.helpText"></help-text>
                    <br/>
                   </label>
               </div>
               <br/><br/>
              `
})
export class InformationComponent {
    @Input() questiondata: any;
    readOnlySubscription: Subscription;
    private isReadOnly;
    constructor(private _formValidationService: FormValidationService) { }
    ngOnInit() {
        this.readOnlySubscription = this._formValidationService.isReadOnlyForm$.subscribe(item => { this.isReadOnly = item;})
    }
}

//DropdownboxComponent
@Component({
    selector: 'dropdown-component',
    styleUrls: ['question.scss'],
    template: ` <div [class.has-error]="control.touched &&!control.valid || isSubmitClicked && control.errors?.Required && !isReadOnly" [attr.id]="sectionId+'_'+questiondata.order+'_div'">
                    <label class="question-label" [attr.for]="sectionId+'_'+questiondata.order+'_'+option">
                        <span class="asterix-space">{{(questiondata.params && questiondata.params.required == 'yes')?'*' : ''}}</span>
                        <span [innerHTML]="questiondata.questionText"></span>
                        <help-text *ngIf="!isReadOnly && questiondata.helpText" [helptext]="questiondata.helpText"></help-text>
                    </label>
                         <div class="row"> 
                            <div class="col-sm-3">
                                <div class="btn-group">
                                     <select *ngIf="!questiondata.params.lookupApi" class="form-control drop-width" role="menu" value="{{response}}"   [(ngModel)]="response" [formControl]="control" >
                                        <option value="">Select</option> 
                                        <option *ngFor="let option of questiondata.allowedResponses; let i=index"  [attr.value]="option">{{option}}</option>
                                    </select>  
                                     <select  *ngIf="questiondata.params.lookupApi" class="form-control drop-width" [(ngModel)]="response" [formControl]="control">
                                        <option value="">Select</option>
                                        <option  *ngFor="let lookup of lookup.options;" [ngValue]="lookup.value">{{lookup.display}}</option>
                                    </select>
                                </div>
                            </div>
                         </div>
                             <errorMessages *ngIf="!isReadOnly" [control]='control' [params]='questiondata.params'></errorMessages>
                         <br/>
                  </div> <br/>
                 `
})
    
export class DropdownComponent implements OnInit,OnDestroy {
    @Input() questiondata: any;
    @Output() formSubmissionQuestionData: any = new EventEmitter<any>();
    control: any;
    @Input() sectionId: any;
    private isSubmitClicked;
    subscription: Subscription;
    readOnlySubscription: Subscription;
    lookUpSubscription: Subscription;
    private isReadOnly;
    response = "";
    lookup={};
    lookupApi="";
    constructor(private _formValidationService: FormValidationService,private _lookupService: LookupService) { }
    ngOnInit() {
        this.control = this._formValidationService.buildFormControlwithValidationMessages(this.sectionId+'_'+this.questiondata.order,this.questiondata);
        this.readOnlySubscription = this._formValidationService.isReadOnlyForm$.subscribe(item => {this.isReadOnly = item; this.response = this.questiondata.response; if(this.isReadOnly)this.control.disable(true);})
        this.subscription = this._formValidationService.isSubmitClicked$.subscribe(item => { 
            this.isSubmitClicked = item;
            this.formSubmissionQuestionData.emit(this.response);
        });
        this.lookupApi=this.questiondata.params.lookupApi;
        if ( this.questiondata.params.lookupApi ) {
            this.lookUpSubscription = this._lookupService.getLookup( this.lookupApi ).subscribe( data => {
                this.lookup = data;
                if(!this.response) this.response = data.defaultOption;
            });
        }
    }
    ngOnDestroy() {
        this.readOnlySubscription.unsubscribe();
        this.subscription.unsubscribe();
        if(this.questiondata.params.lookupApi)
        {
          this.lookUpSubscription.unsubscribe();
        }
    }
}    

//Attachment Component
@Component({
    selector: 'attachment-component',
    styleUrls: ['question.scss'],
    template: `	<label class="question-label" [attr.for]="sectionId+'_'+questiondata.order+'_'+option">
               	 	<span class="asterix-space">{{(questiondata.params && questiondata.params.required == 'yes')?'*' : ''}}</span>
             		<span>{{questiondata.questionText}}</span>
              	</label>
            	<div class="file">
              		<input type="file"  ngFileSelect  [options]="options" (onUpload)="handleUpload($event)">
             	</div>
              `
})
    
export class AttchmentComponent {
    @Input() questiondata: any;
    @Output() formSubmissionQuestionData: any = new EventEmitter<any>();
    control: any;
    @Input() sectionId: any;
    private isSubmitClicked;
    subscription: Subscription;
    readOnlySubscription: Subscription;
    private isReadOnly;
    response = "";
    uploadFile: any;
    options: Object = {
    	url:'http://localhost:4200/upload'
    };
    constructor(private _formValidationService: FormValidationService) { }

    // handle upload    
    handleUpload(data): void {
	    if (data && data.response) {
	      data = JSON.parse(data.response);
	      this.uploadFile = data;
	     }
    }
    ngOnInit() {
        this.control = this._formValidationService.buildFormControlwithValidationMessages(this.sectionId+'_'+this.questiondata.order,this.questiondata);
        this.readOnlySubscription = this._formValidationService.isReadOnlyForm$.subscribe(item => {this.isReadOnly = item; this.response = this.questiondata.response; if(this.isReadOnly)this.control.disable(true);})
        this.subscription = this._formValidationService.isSubmitClicked$.subscribe(item => { this.isSubmitClicked = item;this.formSubmissionQuestionData.emit(this.response); });
	}
	ngOnDestroy() {
        this.readOnlySubscription.unsubscribe();
        this.subscription.unsubscribe();
    }
}
//Search Component
@Component({
    selector: 'search-component',
    styleUrls: ['question.scss'],
    template: `<div [class.has-error]="control.touched &&!control.valid || isSubmitClicked && control.errors?.Required && !isReadOnly" [attr.id]="sectionId+'_'+questiondata.order+'_div'">
                 <label class="question-label" [attr.for]="sectionId+'_'+questiondata.order+'_'+option">
                      <span class="asterix-space">{{(questiondata.params && questiondata.params.required == 'yes')?'*' : ''}}</span>
                      <span>{{questiondata.questionText}}</span>
                 </label>
                     <div class="show-list" *ngFor="let item of selected">
                        <div>
                            <span [class.fixed-width]='!isReadOnly'>{{item}}</span>
                            <a (click)="remove(item)" *ngIf="!isReadOnly"><i class="glyphicon glyphicon-remove"></i></a>
                        </div>
                    </div>
               
                       <div class="search">
                        <input class="form-control" 
                              [(ngModel)]="selectedName"
                              [typeahead]="dataSource"
                              (typeaheadNoResults)="changeTypeaheadNoResults($event)"
                              (typeaheadOnSelect)="typeaheadOnSelect($event)"
                              [typeaheadOptionsLimit]="10"
                              [typeaheadOptionField]="'display'"
                              [typeaheadMinLength]="2"
                              placeholder="Search Names"
                              [readonly] = "disableButton" [disabled]="isReadOnly">
                          </div>
                       <div class="validation-text">
                        <span *ngIf="typeaheadNoResults" > No results found. </span>
                        <span *ngIf="noOfResults"> Max number of entries reached. </span>
                        <span *ngIf="duplicateResult"> Duplicate records found. </span>
                      </div>
                      <errorMessages *ngIf="!isReadOnly" [control]='control' [params]='questiondata.params'></errorMessages>
                         <br/>
                  </div> <br/>
                   `
})
    
export class SearchComponent {
    @Input() questiondata: any;
    @Output() formSubmissionQuestionData: any = new EventEmitter<any>();
    control: any;
    @Input() sectionId: any;
    private isSubmitClicked;
    subscription: Subscription;
    readOnlySubscription: Subscription;
    private isReadOnly;
    response = [];
    searchResults: Array<any>= [];
    dataSource:Observable<any>;
    selectedName:string = '';
    searchApi="";
    selected = [];
    typeaheadNoResults:boolean = false;
    disableButton:boolean = false;
    noOfResults:boolean = false;
    duplicateResult:boolean = false;
    constructor(private _formValidationService: FormValidationService,private _searchComponentService: SearchComponentService) {
      this.dataSource = Observable.create((observer:any) => {
      observer.next(this.selectedName);
      }).mergeMap((token:string) => this.getSearchNameAsObservable(token));
    }
    
	ngOnInit() {
        this.control = this._formValidationService.buildFormControlwithValidationMessages(this.sectionId+'_'+this.questiondata.order,this.questiondata);
        this.readOnlySubscription = this._formValidationService.isReadOnlyForm$.subscribe(item => {this.isReadOnly = item; if(this.questiondata.response){this.selected = this.questiondata.response.split(',');} })
        this.subscription = this._formValidationService.isSubmitClicked$.subscribe(item => { this.isSubmitClicked = item;this.formSubmissionQuestionData.emit(this.response); });
	}
	
   typeaheadOnSelect(e: TypeaheadMatch): void {
       if (this.selected.indexOf(e.value) == -1) {
         if (this.selected.length <= 9) {
            this.selected.push(e.value);
            this.noOfResults = false;
            this.disableButton = false;
            this.duplicateResult = false;
        } else {
            this.noOfResults = true;
            this.disableButton = true;
        }
        this.response = this.selected;
        this.selectedName = '';
     } else {
        this.selectedName = '';
        this.duplicateResult = true;
     }
      this.selected.length == 0 ? this.control.setValue("") : this.control.setValue(this.response);
    }
   remove(item) {
       this.selected.splice(this.selected.indexOf(item), 1);
       if (this.selected.length <= 9) {
           this.disableButton = false;
       }
       this.response = this.selected;
       this.noOfResults = false;
       this.duplicateResult = false;
       this.selected.length == 0 ? this.control.setValue("") : this.control.setValue(this.response);
   }
   getSearchNameAsObservable(token:string):Observable<any> {
      this.searchApi = this.questiondata.params.searchApi;
      return this._searchComponentService.getSearchNames(this.searchApi,token);
    }
   changeTypeaheadNoResults(e:boolean):void {
      this.typeaheadNoResults = e;
   }
   ngOnDestroy() {
        this.readOnlySubscription.unsubscribe();
        this.subscription.unsubscribe();
    }
}        
        
export const QuestionnaireControls: any[] = [
    TextBoxComponent, TextArearBoxComponent, RadioComponent, DateComponent, CheckboxComponent,InformationComponent, DropdownComponent,HelpTextComponent,AttchmentComponent,SearchComponent
];