import { Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import { FormGroup, FormControl} from '@angular/forms';
import {QuestionnaireControls} from './questionnaire-controls';
import { FormValidationService } from './../../services/index';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'question',
    templateUrl: 'question.component.html',
    styleUrls: ['question.scss']
})
export class QuestionComponent {
    @Input() question: any;
    @Input() sectionId: any;
    public responseObject: any = {};
    @Output() formSubmissionResponseData: any = new EventEmitter<any>();
    displayQuestion : boolean = true;
    private controlsWithTrue = [];
    private controls = [];
    readOnlySubscription : Subscription;
    constructor(private _formValidationService:FormValidationService){}
    getResponse(response: any) {
        let iteration = 1; 
        this.responseObject["questionSequenceCode"] = this.question.questionSequenceCode;
        this.responseObject["response"] = response;
        this.responseObject["iteration"] = iteration;
        if(response != null && (typeof response) == "object"){
            for(let i = response.length-1 ; i >= 0; i--){
                this.responseObject["response"] = response[i];
                this.responseObject["iteration"] = i+1;
                if(this.displayQuestion)this.formSubmissionResponseData.emit(this.responseObject);    
            }            
        }else{
            if(this.displayQuestion)this.formSubmissionResponseData.emit(this.responseObject);
        }
    }
    ngOnInit(){
        //Conditional question logic based on behavior
        if(this.question.params.required == 'conditional'){
            let conditions = this.question.params.conditions;
            for(let conditionalIndex in conditions){
                let condition = this.question.params.conditions[conditionalIndex];
                for(let index in condition.questions)
                {
                    let item = condition.questions[index];
                    this.handleBehaviorOfConditionalQuestion(false, condition.behaviors);
                    this.readOnlySubscription = this._formValidationService.isReadOnlyForm$.subscribe(item => {if(item && this.question.response != null) this.displayQuestion = true;});
                    this.controls[index] = this._formValidationService.getFormControlById(item.formSectionCode+'_'+item.order);
                    this.controls[index].valueChanges.subscribe(response =>{
                        this.evaluateConditions(conditions, response, item.questionSequenceCode);    
                    });
                }
            }
        }
                
    }
    
    //method to deal with behaviors
    handleBehaviorOfConditionalQuestion(isConditionsSatisfy:boolean, behaviors:any){
        let questionId = this.sectionId+'_'+this.question.order;
        for(let behaviorIndex in behaviors){
            if(behaviors[behaviorIndex] == "show"){
                (isConditionsSatisfy) ? this.displayQuestion = true : this.displayQuestion = false;
                (this.displayQuestion) ? this._formValidationService.conditionalFormControlActions(questionId, "addToFormGroup") : this._formValidationService.conditionalFormControlActions(questionId, "removefromFormGroup");     
            }
        }               
    }
    
    //evaluate conditions
    evaluateConditions(conditions:any, response:any, questionSequenceCode:any){
        for(let index in conditions){
            let condition = conditions[index];
            for(let quesIndex in condition.questions){
                if(questionSequenceCode == condition.questions[quesIndex].questionSequenceCode) this.checkWhetherConditionsSatify(response, condition.questions[quesIndex], quesIndex, condition.behaviors)    
            }    
        }            
    }
        
    //method for checking whether the conditions satisfy
    checkWhetherConditionsSatify(response: any, questionData:any, index:any, behaviors:any){        
        if(questionData.responses.length > 1){
            let isControlValid = false;
            for(let i =0 ; i < questionData.responses.length ; i++){
                if (response.indexOf(questionData.responses[i]) != -1){ isControlValid = true; break;}   
            }
            if(isControlValid){
                if(!(this.controlsWithTrue.indexOf(index) != -1))this.controlsWithTrue.push(index);    
            }else {
                if(this.controlsWithTrue.indexOf(index) != -1) this.controlsWithTrue.splice(this.controlsWithTrue.indexOf(index), 1)    
            }
        }else{
            if(response.toLowerCase() == questionData.responses[0].toLowerCase()){
                if(!(this.controlsWithTrue.indexOf(index) != -1))this.controlsWithTrue.push(index);    
            }else {
                if(this.controlsWithTrue.indexOf(index) != -1) this.controlsWithTrue.splice(this.controlsWithTrue.indexOf(index), 1)    
            }
        }
        this.handleBehaviorOfConditionalQuestion((this.controlsWithTrue.length == this.controls.length), behaviors);        
    }
}
