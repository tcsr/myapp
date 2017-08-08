import { Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import {QuestionComponent} from './question.component';
import {FormValidationService} from './../../services/index';
@Component({
	selector: 'form-section',
	templateUrl: 'formsection.component.html',
	styleUrls: ['formsection.scss']
})
export class FormSectionComponent {
    @Input() section: any;
    @Output() formSectionsForRequest: any = new EventEmitter<any>();
    private modifiedSection: any = {};
    public responseGroupForquestion: any = [];
    private formSections: any = {};
    getResponseData(responseGroup: any) {
        if (this.responseGroupForquestion.indexOf(responseGroup) == -1 || responseGroup.iteration > 1) {
            let newIteration = {};
            if(responseGroup.iteration > 1){
                for(let item in responseGroup){
                    newIteration[item]= responseGroup[item];    
                }
                this.responseGroupForquestion.push(newIteration);    
            }else{ this.responseGroupForquestion.push(responseGroup);}
            this.formSections["responses"] = this.responseGroupForquestion;
            this.formSectionsForRequest.emit(this.formSections);
        }        
    }
    ngOnInit(){
        if(this.section.questions[0].iteration){
            for(let item in this.section){
                this.modifiedSection[item] = this.section[item];    
            }
            this.modifiedSection.questions = [];
            for(let item in this.section.questions){
                let question = this.section.questions[item];
                if(question.iteration == 1) {
                    this.modifiedSection.questions.push(question);
                }else {
                    for(let searchItem in this.modifiedSection.questions){
                        let searchQuestion = this.modifiedSection.questions[searchItem];
                        if(searchQuestion.questionSequenceCode == question.questionSequenceCode) searchQuestion.response = searchQuestion.response +','+ question.response;    
                    }    
                } 
            }
        }else{
            this.modifiedSection = this.section;
        }   
    }
}
