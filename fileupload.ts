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
 
 
 
 
 
 
 
 
 
 
 
 
 
