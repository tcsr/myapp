import { Injectable } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
@Injectable()
export class FormValidationService {

    buildFormControlwithValidationMessages(order,question) {

        if (question.type == 'text' || question.type == "textarea" || question.type == "email") {
            return this.textValidation(order,question);
        }

        if (question.type == "date") return this.dateValidation(order,question);

        if (question.type == "radio") return this.radioValidation(order,question);

        if (question.type == "checkbox") return this.checkBoxValidation(order,question);

        if (question.type == "dropdown") return this.dropdownValidation(order, question);
        
        if (question.type == "search") return this.searchValidation(order, question);
        
        
    }

    //Validation for Dropdown Component
    dropdownValidation(order, question) {
        let validationArray: any = [];
        let formControl: any = {};

        if (question.params) {
            if (question.params.required && question.params.required == "yes" || question.params.required == 'conditional' && question.params.conditions[0].required == "yes") {
                validationArray.push(this.dropBoxRequired);
            }
        }
        formControl = new FormControl('', Validators.compose(validationArray));
        this.addFormControlService(order, formControl);
        return formControl;
    }
    dropBoxRequired(control: FormControl) {
        return (control.value != "" && control.value != null) ? null : { Required: true }
    }

    //Validation for CheckBox Component
    checkBoxValidation(order,question) {
        let validationArray: any = [];
        let formControl: any = {};

        if (question.params) {
            if (question.params.required && question.params.required == "yes" || question.params.required == 'conditional' && question.params.conditions[0].required == "yes") {
                validationArray.push(this.checkBoxRequired);
            }
        }
        formControl = new FormControl('', Validators.compose(validationArray));
        this.addFormControlService(order, formControl);
        return formControl;
    }
    checkBoxRequired(control: FormControl) {
        return control.value != "" ? null : { Required: true }
    }


    //Validation of Radio Component
    radioValidation(order,question) {
        let validationArray: any = [];
        let formControl: any = {};

        if (question.params) {
            if (question.params.required && question.params.required == "yes" || question.params.required == 'conditional' && question.params.conditions[0].required == "yes") {
                validationArray.push(this.radioRequired);
            }
        }
        formControl = new FormControl('', Validators.compose(validationArray));
        this.addFormControlService(order, formControl);
        return formControl;
    }
    radioRequired(control: FormControl) {
        return control.value != "" ? null : { Required: true }
    }

    //Validation for Date Component
    dateValidation(order,question) {
        let validationArray: any = [];
        let formControl: any = {};

        if (question.params) {
            validationArray.push(this.validDateCheck);
            if (question.params.required && question.params.required == "yes" || question.params.required == 'conditional' && question.params.conditions[0].required == "yes") {
                validationArray.push(this.dateRequired);
            }
        }
        formControl = new FormControl('', Validators.compose(validationArray));
        this.addFormControlService(order, formControl);
        return formControl;
    }
    validDateCheck(control: FormControl) {
        let value = control.value.toString();
        let dateString = (value.length <= 10) ? value : new Date(control.value);
        let dateToValid = (value.length > 10) ? (dateString.getMonth()+1 +'-'+ dateString.getDate() +'-'+  dateString.getFullYear()) : value;
        return (FormValidationService.isValidDate(dateToValid) || control.value == '') ? null : { validDateCheck: true }
    }
    
    private static isValidDate(dateString:any)
    {
        if(!dateString) return false;
        // First check for the pattern
        if(!dateString.match(/^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/))
            return false;
    
        // Parse the date parts to integers
        var parts = dateString.split("-");
        var day = parseInt(parts[1], 10);
        var month = parseInt(parts[0], 10);
        var year = parseInt(parts[2], 10);
    
        // Check the ranges of month and year
        if(year < 1000 || year > 3000 || month == 0 || month > 12)
            return false;
    
        var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
    
        // Adjust for leap years
        if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
            monthLength[1] = 29;
    
        // Check the range of the day
        return day > 0 && day <= monthLength[month - 1];
    };
    
    dateRequired(control: FormControl) {
        return control.value != '' ? null : { Required: true }
    }

    //Validation for Text,Email,Password, Component
    textValidation(order,question) {
        let validationArray: any = [];
        let formControl: any = {};
        if (question.params) {
            if (question.params.required && question.params.required == 'yes' || question.params.required == 'conditional' && question.params.conditions[0].required == "yes") {
                validationArray.push(Validators.required);
            }
            if (question.params.charLimit) {
                validationArray.push(Validators.maxLength(question.params.charLimit));
            }
        }
        //Email validation
        if (question.params && question.params.validation && question.params.validation.type == 'email') {
            validationArray.push(Validators.pattern("^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$"));
        }
        //regex validation
        if (question.params && question.params.validation && question.params.validation.type == 'regex') {
            validationArray.push(Validators.pattern(question.params.validation.pattern));
        }
        //Alpha numeric validation
        if (question.params && question.params.validation && question.params.validation.type == 'alphanumeric') {
            validationArray.push(Validators.pattern("^[a-zA-Z0-9]*$"));
        }
        //Phone validation    
        if (question.params && question.params.validation && question.params.validation.type == 'phone') {
            validationArray.push(Validators.pattern("^(([1-9]{1}[0-9]{2}))[-]([0-9]{3})[-]([0-9]{4})$"));
        };
        formControl = new FormControl('', Validators.compose(validationArray));
        this.addFormControlService(order, formControl);
        return formControl;
    }

    //Building Form Group which will be added to form in Form Component
    private group: any = {};
    private conditionalGroup:any = {};
    private addFormControl = new BehaviorSubject<any>(Object);
    public addFormControl$ = this.addFormControl.asObservable();
    addFormControlService(order: any, newControl: FormControl) {
        this.group[order] = newControl;
        this.addFormControl.next(this.group);
    }
    emptyFormControl() {
        this.group = {};
    }
    getFormControlById(id:any){
        return this.group[id];    
    }
    conditionalFormControlActions(id:any,action:string){
        if(action == "addToFormGroup"){
            if(!this.group[id]) this.group[id] = this.conditionalGroup[id];
            this.addFormControl.next(this.group);    
        }else if(action == "removefromFormGroup"){
            if(!this.conditionalGroup[id]) this.conditionalGroup[id] = this.group[id];
            if(this.group[id])this.group[id].setValue("");
            delete this.group[id];
            this.addFormControl.next(this.group);     
        }     
    }

    // Sending the boolean value to all controls based on whether the submit button has been clicked fromm form HTML
    private isSubmitClicked = new BehaviorSubject<boolean>(false);
    public isSubmitClicked$ = this.isSubmitClicked.asObservable();
    onSubmitClicked(isclicked: boolean) {
        this.isSubmitClicked.next(isclicked);
    }
    
    // Sending the boolean value to all controls based on whether the submit button has been clicked fromm form HTML
    private isReadOnlyForm = new BehaviorSubject<boolean>(false);
    public isReadOnlyForm$ = this.isReadOnlyForm.asObservable();
    onReadOnlyForm(isclicked: boolean) {
        this.isReadOnlyForm.next(isclicked);
    }
    
    //Validation for Search Component
    searchValidation(order, question) {
        let validationArray: any = [];
        let formControl: any = {};

        if (question.params) {
            if (question.params.required && question.params.required == "yes") {
                validationArray.push(this.searchBoxRequired);
            }
        }
        formControl = new FormControl('', Validators.compose(validationArray));
        this.addFormControlService(order, formControl);
        return formControl;
    }
    searchBoxRequired(control: FormControl) {
        return (control.value != "" && control.value != null) ? null : { Required: true }
    }
}