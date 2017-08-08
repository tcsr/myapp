import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormSectionComponent } from './formsection.component';
import { FormLoaderService, FormValidationService } from './../../services/index';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'questionnaire-form',
    templateUrl: 'form.component.html',
    styleUrls: ['form.scss']
})

export class FormComponent implements OnInit, OnDestroy {
    @Input('formCode') formCode: string;
    @Input('formVerCode') formVerCode: string;
    @Input('formSubCode') formSubCode: string;
    @Input('envName') envName: string;
    @Output() isFormSubmitted: any = new EventEmitter<any>();
    @Output() isFormError: any = new EventEmitter<any>();
    public myForm: FormGroup;
    public group: any = {};
    private disableButton: boolean = false;
    subscription: Subscription;
    formSubscription: Subscription;
    private formSectionPostData: any = [];
    private formPostData: any = {};
    private form: any = {}; private formVersionCode;
    private errorMessage: string = '';
    private SUBMISSION_ERROR_MESSAGE: string = '* An error has occurred. Please try again.';
    private VALIDATION_ERROR_MESSAGE: string = '* Missing/invalid answers. Please check your answers.';
    private requiredFieldStatement: string = 'Required fields are marked by an asterisk (*)';
    constructor(private _formLoaderService: FormLoaderService, private _formvalidationService: FormValidationService, private _fb: FormBuilder) {
        this.myForm = this._fb.group({});
    }
    ngOnInit() {
        this._formvalidationService.onSubmitClicked(false);
        this.formSubCode ? this._formvalidationService.onReadOnlyForm(true) : this._formvalidationService.onReadOnlyForm(false);
        this.formSubscription = this._formLoaderService.getForm(this.formCode, this.formVerCode, this.formSubCode, this.envName, this.getToken()).subscribe(data => {
            this.form = data;
        });
        this.subscription = this._formvalidationService.addFormControl$.subscribe(group => {
            this.myForm = this._fb.group(group);
            this.myForm.valueChanges.subscribe(data => {
                if (this.myForm.valid) {
                    this.errorMessage = '';
                }
            }
            );
        })
    }

    ngOnDestroy() {
        this.formSubscription.unsubscribe();
        this.subscription.unsubscribe();
        this._formvalidationService.emptyFormControl();
    }

    submit(myForm) {
        let submissionCode;
        this._formvalidationService.onSubmitClicked(true);
        if (this.myForm.valid) {
            this.disableButton = true;
            this._formLoaderService.postForm(this.formPostData, this.envName).subscribe(data => {
                submissionCode = data;
                this.disableButton = false;
                if (submissionCode) {
                    this.isFormSubmitted.emit(submissionCode);
                } else {
                    this.isFormSubmitted.emit(false);
                    this.errorMessage = this.SUBMISSION_ERROR_MESSAGE;
                }
            },
                err => {
                    this.disableButton = false;
                    this.errorMessage = this.SUBMISSION_ERROR_MESSAGE;
                    this.isFormSubmitted.emit(false);
                }
            );
        } else {
            this.errorMessage = this.VALIDATION_ERROR_MESSAGE;
            this.isFormSubmitted.emit(false);
        }
    }

    formSectionsForRequest(formSectionRequest: any) {
        if (this.formSectionPostData.indexOf(formSectionRequest) == -1) {
            this.formSectionPostData.push(formSectionRequest);
            this.formPostData["formSections"] = this.formSectionPostData;
            this.formPostData["formCode"] = this.form.formCode;
            this.formPostData["formVersionCode"] = this.form.formVersionCode;
            this.formPostData["complete"] = true;
        }
    }
    getToken() {
        if (document.cookie) {
            var value = "; " + (document.cookie);
            var parts = value.split("; tokenCookie=");
            if (parts.length == 2)
                return parts.pop().split(";").shift();
        }
        else return "";
    }
}
