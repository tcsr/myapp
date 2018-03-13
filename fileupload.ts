 <input type="file" #fileInput />
 <button (click)="uploadFile()" >Upload File </button>

 import { ElementRef } from '@angular/core';

 @ViewChild('fileInput') fileInput: ElementRef;

 uploadFile() {
     let file = this.fileInput.nativeElement.files[0];
     let formData = new FormData();
     formData.append("scrSeq","12345");
     formData.append("policyCSVFile",file);
     this.dgitService.uploadFile(formData).subscribe();
 }


 uploadFile(formData):Observable<any>{
    return this.http.post("http://localhost:8080/uploadPolicies",formData).map(
      (res) => {
        const data = res.json();
       // console.log(data);
        return data;
      }
    )
  }

 --------------------------------------------------------------
 var jobPostingData = $scope.job;
 transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append("jobpostingdata", angular.toJson(data.jobpostingdata));
                    for (var i = 0; i < data.files.length; i++) {
                        formData.append("file" + i, data.files[i]);
                    }
                    return formData;
                }
   data: { jobpostingdata: jobPostingData, files: $scope.files }
-----------------------------------------------------------------
 
 $scope.downloadfile = function (jobid) {
        $http({
            method: 'GET',
            url: baseurl + 'docs/DownloadFile/' + jobid,
            responseType: 'arraybuffer'
        }).success(function (data, status, headers) {
            headers = headers();
            var filename = headers['x-filename'];
            var contentType = headers['content-type'];
            var linkElement = document.createElement('a');
            try {
                var blob = new Blob([data], { type: contentType });
                var url = window.URL.createObjectURL(blob);

                linkElement.setAttribute('href', url);
                linkElement.setAttribute("download", filename);

                var clickEvent = new MouseEvent("click", {
                    "view": window,
                    "bubbles": true,
                    "cancelable": false
                });
                linkElement.dispatchEvent(clickEvent);
            } catch (ex) {
                console.log(ex);
            }
        }).error(function (data) {
            console.log(data);
        });
    }
 
-----------------------------------------------
   [HttpPost]
        public HttpResponseMessage DownloadFilesFromDb(Upload upload)
        {
            HttpResponseMessage response = new HttpResponseMessage();

            _query = "SELECT Document,Docname FROM JOB_DOCS WHERE JSId = '" + upload.JSId + "' and [Lineno]= '" + upload.Lineno + "'";
            _dt = _repository.GetDataFromDB(_query);

            byte[] documentBinary = (byte[])_dt.Rows[0]["Document"];
            string docname = _dt.Rows[0]["Docname"].ToString();

            FileStream fStream = new FileStream(HttpContext.Current.Server.MapPath("~/uploads/") + "\\" + docname, FileMode.Create);
            fStream.Write(documentBinary, 0, documentBinary.Length);
            fStream.Close();
            fStream.Dispose();
            string path = HttpContext.Current.Server.MapPath("~/uploads/") + "\\" + docname;

            FileInfo file = new FileInfo(path);

            if (file.Exists)
            {
                response.Content = new ByteArrayContent(documentBinary.ToArray());
                response.Content.Headers.Add("x-filename", docname);
                //  response.Headers.Add("Content-Length", file.Length.ToString());
                response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
                response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
                response.Content.Headers.ContentDisposition.FileName = docname;
                response.StatusCode = HttpStatusCode.OK;
            }

            return response;
        }
 
 --------------------------------------
  
  number.directive.ts

import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[OnlyNumber]'
})
export class OnlyNumber {

  constructor(private el: ElementRef) { }

  @Input() OnlyNumber: boolean;

  @HostListener('keydown', ['$event']) onKeyDown(event) {
    let e = <KeyboardEvent> event;
    if (this.OnlyNumber) {
      if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A
        (e.keyCode == 65 && e.ctrlKey === true) ||
        // Allow: Ctrl+C
        (e.keyCode == 67 && e.ctrlKey === true) ||
        // Allow: Ctrl+X
        (e.keyCode == 88 && e.ctrlKey === true) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)) {
          // let it happen, don't do anything
          return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
      }
  }
}

-------------------------------------------------------------------
in main.module.ts:

import { OnlyNumber } from './number.directive';

declarations: [OnlyNumber]
 
Usage:
<input OnlyNumber="true" type="text" class="form-control"/>

-------------------------------------------------------------------
 
 
  <form [formGroup]="myForm">
      <label for="name">Name</label>
      <input formControlName="name" id="name" class=" from-control" />
      <label for="email">Email</label>
      <input formControlName="email" id="email" />
      <span *ngIf="myForm?.controls?.email?.errors?.required" style="color: red;">
        Required
      </span>
      <span *ngIf="myForm?.controls?.email?.errors?.email" style="color: red;">
        Enter Valid Email
      </span>
      <label for="profile">Profile Description</label>
      <textarea formControlName="profile" id="profile"></textarea>
      <button type="submit" (click)="saveUser(myForm)">Submit</button>
    </form>
	
	
  private myForm: FormGroup = new FormGroup({});
  constructor(private fb: FormBuilder){ }

  ngOnInit() {
    this.myForm = this.fb.group({
      'name': ['', Validators.required],
      'email': ['', [Validators.required, Validators.email]],
      'profile': ['', [Validators.required, Validators.minLength(10)]]
    })
  }
  saveUser(form){
    console.log(form)
  }

-----------------------------------
 
  https://stackoverflow.com/questions/14850553/javascript-regex-for-password-containing-at-least-8-characters-1-number-1-uppe/14850765
  https://stackoverflow.com/questions/2370015/regular-expression-for-password-validation


<div class="panel panel-default">
  <div class="panel-body center-block centerNav col-xs-12 col-sm-12 col-md-12 col-lg-6">
    Panel Content.
  </div>
</div>

.panel.panel-default {
    border: 0px !important;
    padding: 0 10px;
    border-radius: 4px; 
    -webkit-box-shadow: none;
    box-shadow: none;
}
.panel-body.center-block.centerNav {
    border:solid 1px #ddd;
    float:none;
}
 
 
 
 
 
 
 
 
 
 
