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
