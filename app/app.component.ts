import { Component, ViewEncapsulation} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UcHeaderComponent } from './index';
import { environment } from '../environments/environment';
import { TokenAuthService } from './tokenauth.service';

@Component({
  selector: 'survey-app',
  templateUrl: 'app.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./assets/css/project.scss']
})
export class AppComponent{  
    constructor(private _tokenAuthService:TokenAuthService){
        if(environment.ENV == 'prod' || environment.ENV == 'stage'){
            _tokenAuthService.authenticate();
        }
    }
}

@Component({
  selector: 'form-load',
  template: '<questionnaire-form (isFormSubmitted)="isFormSubmitted($event)" (isFormError)="isFormError($event)" [formCode]="formCode" [formVerCode]="formVerCode" [formSubCode]="formSubCode" [envName]="envName"></questionnaire-form>'
})
export class AppLoadComponent{
    formCode: string = "";
    formVerCode: string = "";
    formSubCode: string = "";
    private _token:any = null;
    public envName: any = environment.ENV;

    constructor(private router:Router, private route: ActivatedRoute, private _tokenAuthService:TokenAuthService){
        this.route.params.forEach((params: Params) => {
            this.formCode = params['formCode'];
            this.formVerCode = params['formVerCode'];
            this.formSubCode = params['formSubCode'];         
        })

        var map = {
            "BAU":"1a2b3c4d-1a2b-1a2b-1a2b-a1a2b3c4d5e3",
            "LHA":"1a2b3c4d-1a2b-1a2b-1a2b-a1a2b3c4d5e2",
            "TEST":"90f40712-4566-11e6-9e43-b87a3dc21523",
            "VIEWTEST":"3a63f55f-0f0f-4bd3-8850-2511c6e50aec",
            "VIEWLHA":"bbcd8ea2-1f5e-4b88-943d-3447e00ca031",
            "VIEWBUA":"aff988a9-36ad-4464-a57e-2848afaea140"
        }

        if(map[this.formCode]){
            this.formCode = map[this.formCode];
        }
        if(map[this.formSubCode]){
            this.formSubCode = map[this.formSubCode];
        }
    }

    isFormSubmitted(submissionCode:any){
          if(submissionCode){
              this.router.navigate([ '/confirm', submissionCode.submissionCode ]);
          }
    }
    isFormError(formError:any){
          if(formError){
              this.router.navigate(['/error']);
          }
    }
    
}

@Component({
  selector: 'menu',
  template: `<div class="panel panel-default" style="margin-bottom: 0px;">
                <div class="panel-body" style="margin-left: 100px; font-size: 17px;">
                    <H3 class="text-left"><b>Take Survey</b></H3>
                    <ul>
                        <li><a [routerLink]="['takeSurvey/TEST']">Test Form</a></li>
                        <li><a [routerLink]="['takeSurvey/LHA']">Laboratory Hazard Assessment Form</a></li>
                        <li><a [routerLink]="['takeSurvey/BAU']">Biological Use Authorization Form</a></li>
                    </ul>
                    <H3 class="text-left"><b>View Survey</b></H3>
                    <ul>
                        <li><a [routerLink]="['viewSurvey/VIEWTEST']">Test Form</a></li>
                        <li><a [routerLink]="['viewSurvey/VIEWLHA']">Laboratory Hazard Assessment Form</a></li>
                        <li><a [routerLink]="['viewSurvey/VIEWBUA']">Biological Use Authorization Form</a></li>
                    </ul>
                </div>
            </div>`
})

export class MenuComponent{
   
}
