import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, ResponseContentType } from '@angular/http';
//import 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class DashboardService {
    private data: any;
    private isUploadFile: boolean = false;
    private downloadFile: boolean = false;
    private fileType: any;
    private contentType: any;
    private accept: any;
    private selectedIDs: any;

    //private baseURL = "http://172.16.12.134:8082/etrade/api/controller/getData";
    //private baseURL = "http://localhost:8082/etrade/api/controller/getData";
    // private baseURL = "http://localhost:8082/etrade/api/controller/" + this.method;
    //private baseURL = "http://localhost:8082/etrade/api/controller/uploadData";

    //private baseURL = "http://172.16.11.83:8082/etrade/api/controller/getData";
    private auth_Token: String = "MkM3NDMwNjQ4NjJDMEUyOTFDRTMwQzI4NDQ2MDJFQkNBOTg0MWQzNzAtZWFiNC00MDU1LTg3NDQtZTAwMDQxYTdhNzgy";
    private service_Name: String = "dashboardData";

    constructor(private http: Http) { }

    createAuthorizationHeader(headers: Headers) {
        headers.append('Access-Control-Allow-Origin', '*');

        if (this.isUploadFile || this.downloadFile) {
            this.contentType = "multipart/form-data; boundary=AaB03x";
            // this.contentType = undefined;
            this.accept = "application/json";
        } else {
            this.contentType = "application/json";
            this.accept = "application/json";
        }

        headers.append('Content-Type', this.contentType);
        headers.append('Accept', this.accept);

        headers.append('X-Requested-With', 'XMLHttpRequest');
        headers.append('X-Authorization', 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJyYW1rdW1hciIsInNjb3BlcyI6WyJCYW5rIFVzZXIiXSwiaXNzIjoiSFRDIiwiaWF0IjoxNTAxODMwODc1LCJleHAiOjE1MDIwNDY4NzV9.GrM2IMn4_Uj9lNMCd_9n1yKjPGi4EFMgd9hDkbYQ_IBguCpXKgbhtgXgp2fzJqnh_jrqybJK_xyrJ0KjEg1tQw');

    }

    headerParams(requestName, sectionName, pageNo, filterFlag, formData) {

        if ("EXPORT" === this.config.CURRENT_TAB.toUpperCase()) {
            if (("GENERATEEBRCXML" == requestName.toUpperCase()) || ("GENERATEPDF" == requestName.toUpperCase()) || ("EFIRCADVICE" == requestName.toUpperCase()) || ("ADTRANSFER" == requestName.toUpperCase()) || ("EFIRC" == requestName.toUpperCase()) || ("RAISEEFIRC" == requestName.toUpperCase()) || ("BILLTRANSFERREQUEST" == requestName.toUpperCase()) || ("EBRC" == requestName.toUpperCase()) || ("DELETEBILLTRANSFERREQUEST" == requestName.toUpperCase())) {
                this.service_Name = "serviceRequestData";
            } else if (("EXPORTBILL" == requestName.toUpperCase()) || ("EBRCISSUANCE" == requestName.toUpperCase()) || ("EFIRCISSUANCE" == requestName.toUpperCase())) {
                this.service_Name = "reports";
            } else if (("SHIPPINGBILLSFORPAYMENTEXTENSION" == requestName.toUpperCase()) || ("VIEWPAYMENTEXTENSION" == requestName.toUpperCase()) || ("RAISEPAYMENTEXTENSION" == requestName.toUpperCase()) || ("CANCELPAYMENTEXTENSION" === requestName.toUpperCase())) {
                this.service_Name = "billManagementRequest";
            } else if (("IRMEXTENSIONMASTERDATA" == requestName.toUpperCase()) || ("VIEWIRMEXTDETAILS" == requestName.toUpperCase()) || ("RAISEIRMEXTENSION" == requestName.toUpperCase()) || ("CANCELIRMEXTENSION" == requestName.toUpperCase())) {
                this.service_Name = "remittanceManagementRequest";
            }
            else {
                this.service_Name = "dashboardData";
            }
        } else if ("IMPORT" === this.config.CURRENT_TAB.toUpperCase()) {
            if (("EFIRCADVICE" == requestName.toUpperCase()) || ("ADTRANSFER" == requestName.toUpperCase()) || ("EFIRC" == requestName.toUpperCase()) || ("RAISEEFIRC" == requestName.toUpperCase()) || ("BILLTRANSFERREQUEST" == requestName.toUpperCase()) || ("EBRC" == requestName.toUpperCase()) || ("DELETEBILLTRANSFERREQUEST" == requestName.toUpperCase())) {
                this.service_Name = "serviceRequestData";
            } else if (("IRMAGINGDATA" == requestName.toUpperCase()) || ("BOE" == requestName.toUpperCase()) || ("ORMAGING" == requestName.toUpperCase()) || ("ORM" == requestName.toUpperCase()) || ("BOEAGING" == requestName.toUpperCase()) || ("BOEAGINGDATA" == requestName.toUpperCase()) || ("ORMAGINGDATA" == requestName.toUpperCase()) || ("BOEBYSTATUS" == requestName.toUpperCase()) || ("ORMBYSTATUS" == requestName.toUpperCase())) {

                this.service_Name = "idisDashboardData";
            }
            else if (("EXPORTBILL" == requestName.toUpperCase()) || ("EBRCISSUANCE" == requestName.toUpperCase()) || ("EFIRCISSUANCE" == requestName.toUpperCase())) {

                this.service_Name = "reports";
            }
            else {
                this.service_Name = "dashboardData";
            }
        }


        this.data = {
            "EtradeRequest":
            {
                "authToken": this.auth_Token,
                "serviceName": this.service_Name,
                "pageRequest":
                {
                    "requestName": requestName,
                    "queryString": sectionName,
                    "startsWith": pageNo,
                    "filter": {},
                    "raiseEFIRCRequest": {},
                    "adTransferRequest": {},
                    "adTransferIdsForDel": [],
                    "fileType": ""
                    //"file": {}
                }
            }

        };

        if (filterFlag) {
            this.data.EtradeRequest.pageRequest.filter = formData;

            this.data.EtradeRequest.pageRequest.raiseEFIRCRequest = {};
            this.data.EtradeRequest.pageRequest.adTransferRequest = {};
            this.data.EtradeRequest.pageRequest.adTransferIdsForDel = [];
        }

        if ("BILLTRANSFERREQUEST" == requestName.toUpperCase()) {
            this.data.EtradeRequest.pageRequest.adTransferRequest = formData;

            this.data.EtradeRequest.pageRequest.filter = {};
            this.data.EtradeRequest.pageRequest.adTransferIdsForDel = [];
            this.data.EtradeRequest.pageRequest.raiseEFIRCRequest = {};
        }

        if ("RAISEEFIRC" == requestName.toUpperCase()) {
            this.data.EtradeRequest.pageRequest.raiseEFIRCRequest = formData;

            this.data.EtradeRequest.pageRequest.filter = {};
            this.data.EtradeRequest.pageRequest.adTransferRequest = {};
            this.data.EtradeRequest.pageRequest.adTransferIdsForDel = [];
        }

        if ("DELETEBILLTRANSFERREQUEST" == requestName.toUpperCase()) {
            this.data.EtradeRequest.pageRequest.adTransferIdsForDel = formData;

            this.data.EtradeRequest.pageRequest.filter = {};
            this.data.EtradeRequest.pageRequest.adTransferRequest = {};
            this.data.EtradeRequest.pageRequest.raiseEFIRCRequest = {};
        }

        if ("BILLTRANSFERREQUEST" == requestName.toUpperCase() && this.isUploadFile) {
            //this.data.EtradeRequest.pageRequest.file = formData;
            this.data.file = formData;

            this.data.EtradeRequest.pageRequest.adTransferIdsForDel = [];
            this.data.EtradeRequest.pageRequest.filter = {};
            this.data.EtradeRequest.pageRequest.adTransferRequest = {};
            this.data.EtradeRequest.pageRequest.raiseEFIRCRequest = {};
        }

        if (this.downloadFile) {
            this.data.EtradeRequest.pageRequest.fileType = this.fileType;
        }

        if (this.selectedIDs && "GENERATEPDF" !== requestName.toUpperCase() && "GENERATEEBRCXML" !== requestName.toUpperCase()) {
            this.data.EtradeRequest.pageRequest.selectedItem = this.selectedIDs;
        }

        if (this.selectedIDs && "GENERATEPDF" === requestName.toUpperCase() && "GENERATEEBRCXML" !== requestName.toUpperCase()) {
            this.data.EtradeRequest.pageRequest.efircAdviceIdForPDFGen = this.selectedIDs;
        }

        if (this.selectedIDs && "GENERATEPDF" !== requestName.toUpperCase() && "GENERATEEBRCXML" === requestName.toUpperCase()) {
            this.data.EtradeRequest.pageRequest.eBRCIdForXMLGen = this.selectedIDs;
        }

        if (this.selectedIDs && "RAISEPAYMENTEXTENSION" === requestName.toUpperCase()) {
            this.data.EtradeRequest.pageRequest.paymentExtension = formData;
        }

        if (this.selectedIDs && "RAISEIRMEXTENSION" === requestName.toUpperCase()) {
            console.log("formDate:::" + formData)
            this.data.EtradeRequest.pageRequest.paymentExtension = formData;
        }

        if (formData && "VIEWPAYMENTEXTENSION" === requestName.toUpperCase()) {
            this.data.EtradeRequest.pageRequest.idsForPaymentExtensionList = formData;            
        }
   
        if (formData && "CANCELPAYMENTEXTENSION" === requestName.toUpperCase()) {
            this.data.EtradeRequest.pageRequest.idsForPaymentExtensionList = formData.idForPaymentExtdetails;
            this.data.EtradeRequest.pageRequest.idForPaymentExtCancellation = formData.idForPaymentExtCancellation;
        }
        if (formData && "VIEWIRMEXTDETAILS" === requestName.toUpperCase()) {
            this.data.EtradeRequest.pageRequest.idsForIrmExtensionList = formData;            
        }

        if (formData && "CANCELIRMEXTENSION" === requestName.toUpperCase()) {
            this.data.EtradeRequest.pageRequest.idsForIrmExtensionList = formData.idForIRMExtdetails;
            this.data.EtradeRequest.pageRequest.idForIrmCancellation = formData.idForIRMExtCancellation;
        }
//idForPaymentExtCancellation
        //console.log("headerParams\n" + JSON.stringify(this.data, null, '\t') + "\n");

        return this.data;
    }

    //Main Service
    InviteService(requestName, sectionName, pageNo, filterFlag, formData) {
        let headers = new Headers;
        this.createAuthorizationHeader(headers);

        //console.log("Headers\n"+ JSON.stringify(headers,null,'\t') + "\n");

        var methodName = "";
        var options: any;

        if (this.isUploadFile) {
            methodName = "uploadData";
            options = new RequestOptions({ headers: headers });
        } else if (this.downloadFile) {
            methodName = "downloadData";
            options = new RequestOptions({ responseType: ResponseContentType.Blob });
        } else {
            methodName = "getData";
            options = new RequestOptions({ headers: headers });
        }

        var baseURL = "http://localhost:8082/etrade/api/controller/" + methodName;
        //var baseURL = "http://172.16.11.83:8082/etrade/api/controller/" + methodName;

        // console.log("\n---------- * ---------- * --------\n");
        // console.log(formData.get('uploads'));

        //let options = new RequestOptions({ headers: headers });


        return this.http.post(baseURL, this.headerParams(requestName, sectionName, pageNo, filterFlag, formData), options)
            //return this.http.post(baseURL, formData)
            //return this.http.post(baseURL, formData, options)
            .map(response => {
                //response.json();
                //console.log("I CAN SEE DATA HERE: ", response.json());

                this.clearValue();

                return response.json();
            }).catch((error: any) => {

                this.clearValue();

                //if (error.status === 400) {
                return Observable.of(JSON.parse(error._body));
                //}
            });
    }


    // private SPINNER_CNT: number = 0;
    // private SPINNER_SHOWHIDE: boolean = false;


    private config = {
        CURRENT_TAB: "EXPORT",
        SPINNER_CNT: 0,
        SPINNER_SHOWHIDE: false,
        EXPORT_BILL_PARAM: "",
        IMPORT_BILL_PARAM: "",
        EXPORT_BILL_AGING_PARAM_TITLE: "",
        EXPORT_BILL_AGING_PARAM_CATEGORY: "",
        INWARD_REMITTANCE_PARAM: "",
        INWARD_REMITTANCE_AGING_PARAM_TITLE: "",
        INWARD_REMITTANCE_AGING_PARAM_CATEGORY: "",
        EXPORT_BILL_TRANSFER: "",
        EXPORT_FIRCADVICE: "",
        EXPORT_BRCADVICE: "",
        REMITTANCEREFERENCENUMBER: "",
        OUTWARD_REMITTANCE_AGING_PARAM_TITLE: "",
        OUTWARD_REMITTANCE_AGING_PARAM_CATEGORY: "",
        OUTWARD_REMITTANCE_PARAM: "",
    };

    //Setting URL Parameter
    setConfig(option, value) {
        this.config[option] = value;
    }

    //Getting URL Parameter
    getConfig() {
        return this.config;
    }


    private exportAgency = [
        {
            id: 1,
            name: "CUSTOMS"
        },
        {
            id: 2,
            name: "SEZ"
        },
        {
            id: 3,
            name: "STPI"
        }
    ];


    get_exportAgency() {
        return this.exportAgency;
    }


    private exportType = [
        {
            id: 1,
            name: "GOODS"
        },
        {
            id: 2,
            name: "SOFTWARE"
        }
    ];

    get_exportType() {
        return this.exportType;
    }



    //Clear Value
    clearValue() {
        this.isUploadFile = false;
        this.downloadFile = false;
        this.fileType = "";
        this.selectedIDs = [];
    }


    //Export Bills - Chart Service
    billService() {
        let requestName: string = "ROD", sectionName: string = "", pageNo: string = "", filterFlag: string = "", formData: string = "";

        return this.InviteService(requestName, sectionName, pageNo, filterFlag, formData);
    }

    //Export-Bills Aging - Chart Service
    billAgingService() {
        let requestName: string = "BILLAGING", sectionName: string = "", pageNo: string = "", filterFlag: string = "", formData: string = "";

        return this.InviteService(requestName, sectionName, pageNo, filterFlag, formData);
    }

    //Export-Inward Remittances - Chart Service
    inwardRemittancesService() {
        let requestName: string = "IRM", sectionName: string = "", pageNo: string = "", filterFlag: string = "", formData: string = "";

        return this.InviteService(requestName, sectionName, pageNo, filterFlag, formData);
    }

    //Export-Inward Remittances Aging - Chart Service
    inwardRemittancesAgingService() {
        let requestName: string = "IRMAGING", sectionName: string = "", pageNo: string = "", filterFlag: string = "", formData: string = "";

        return this.InviteService(requestName, sectionName, pageNo, filterFlag, formData);
    }


    //Export Bills - Legend Data Service
    get_ExportBills_LegendData(requestName, value, pageNo) {
        let filterFlag: boolean = false;
        let formData = "";

        return this.InviteService(requestName, value, pageNo, filterFlag, formData);
    }

    //Export Bills Aging - Item Data Service
    get_ExportBillsAging_ItemData(title, category, pageNo) {
        let filterFlag: boolean = false;
        let formData = "";

        return this.InviteService(title, category, pageNo, filterFlag, formData);
    }

    //Inward Remittances - Legend Data Service
    get_InwardRemittance_LegendData(requestName, value, pageNo) {
        let filterFlag: boolean = false;
        let formData = "";

        return this.InviteService(requestName, value, pageNo, filterFlag, formData);
    }

    //Inward Remittances Aging - Item Data Service
    get_InwardRemittanceAging_ItemData(title, category, pageNo) {
        let filterFlag: boolean = false;
        let formData = "";

        return this.InviteService(title, category, pageNo, filterFlag, formData);
    }

    download_File(title, fileType, sectionName, selectedIDs) {
        let filterFlag: boolean = false;
        let formData = "", pageNo = 1;
        this.downloadFile = true;
        this.fileType = fileType;
        this.selectedIDs = selectedIDs;

        return this.InviteService(title, sectionName, pageNo, filterFlag, formData);
    }

    //Export Bills - Fileter Search Section
    // get_FilterSearch(requestName, sectionName, formData) {
    get_FilterSearch(requestName, sectionName, formData, pageNo) {
        // let pageNo = 1;
        let filterFlag = true;

        return this.InviteService(requestName, sectionName, pageNo, filterFlag, formData);
    }


    //Export - Bill Transfer Data    
    serviceRequestData(requestName, sectionName, formData, pageNo) {
        let filterFlag = true;

        return this.InviteService(requestName, sectionName, pageNo, filterFlag, formData);
    }
    get_ImportBillsAging_ItemData(title, category, pageNo) {
        let filterFlag: boolean = false;
        let formData = "";

        return this.InviteService(title, category, pageNo, filterFlag, formData);
    }

    //Outward Remittances Aging - Item Data Service
    get_OutwardRemittanceAging_ItemData(title, category, pageNo) {
        let filterFlag: boolean = false;
        let formData = "";
        return this.InviteService(title, category, pageNo, filterFlag, formData);
    }
    get_OutwardRemittance_LegendData(requestName, value, pageNo) {
        let filterFlag: boolean = false;
        let formData = "";

        return this.InviteService(requestName, value, pageNo, filterFlag, formData);
    }


    //Export - Bill Transfer Request Data    
    billTransferRequest(requestName, sectionName, formData, pageNo) {
        let filterFlag = false;

        return this.InviteService(requestName, sectionName, pageNo, filterFlag, formData);
    }


    //Export - Delete Bill Transfer Request
    deleteBillTransferRequest(requestName, sectionName, formData, pageNo) {
        let filterFlag = false;

        return this.InviteService(requestName, sectionName, pageNo, filterFlag, formData);
    }


    //Export - raiseEFIRC Data    
    raiseEFIRC(requestName, sectionName, formData, pageNo) {
        let filterFlag = false;

        return this.InviteService(requestName, sectionName, pageNo, filterFlag, formData);
    }


    //AD Transfer - Upload File
    adTransfer_Upload(formData: FormData) {

        this.isUploadFile = true;

        let filterFlag = false;
        var requestName = "billTransferRequest", sectionName = "", pageNo = 1;

        // console.log("\n---------- ---------- --------\n");
        // console.log(formData.get('uploads'));

        return this.InviteService(requestName, sectionName, pageNo, filterFlag, formData);
    }


    //Payment Extension
    getPaymentExtensionData(requestName, sectionName, formData, pageNo) {
        let filterFlag: boolean = false;
        //let formData = "";

        return this.InviteService(requestName, sectionName, pageNo, filterFlag, formData);
    }
    // getInwardRemittanceExtensionData(requestName, sectionName, formData, pageNo) {
    //     let filterFlag: boolean = false;
    //     //let formData = "";

    //     return this.InviteService(requestName, sectionName, pageNo, filterFlag, formData);
    // }

    raiseExtend(requestName, sectionName, formData, pageNo) {
        let filterFlag = false;

        return this.InviteService(requestName, sectionName, pageNo, filterFlag, formData);
    }

    getViewExtensionData(requestName, sectionName, formData, pageNo) {
        let filterFlag: boolean = false;
        // console.log("requestName:::"+requestName)

        return this.InviteService(requestName, sectionName, pageNo, filterFlag, formData);
    }

    deleteViewExtension(requestName, sectionName, formData, pageNo) {
        let filterFlag: boolean = false;
        //let formData = "";

        return this.InviteService(requestName, sectionName, pageNo, filterFlag, formData);
    }


    //Import Bills - Legend Data Service
    get_ImportBills_LegendData(requestName, value, pageNo) {
        let filterFlag: boolean = false;
        let formData = "";

        return this.InviteService(requestName, value, pageNo, filterFlag, formData);
    }

    //import Bills - Chart Service
    importBillService() {
        let requestName: string = "BOE", sectionName: string = "", pageNo: string = "", filterFlag: string = "", formData: string = "";

        return this.InviteService(requestName, sectionName, pageNo, filterFlag, formData);
    }
    importBillAgingService() {
        let requestName: string = "BOEAGING", sectionName: string = "", pageNo: string = "", filterFlag: string = "", formData: string = "";

        return this.InviteService(requestName, sectionName, pageNo, filterFlag, formData);
    }
    importInwardRemittancesAgingService() {
        let requestName: string = "ORMAGING", sectionName: string = "", pageNo: string = "", filterFlag: string = "", formData: string = "";

        return this.InviteService(requestName, sectionName, pageNo, filterFlag, formData);
    }

    importInwardRemittancesService() {
        let requestName: string = "ORM", sectionName: string = "", pageNo: string = "", filterFlag: string = "", formData: string = "";

        return this.InviteService(requestName, sectionName, pageNo, filterFlag, formData);
    }

    //ImportBillingagingChart
    get_ImportAging_ItemData(title, category, pageNo) {
        let filterFlag: boolean = false;
        let formData = "";
        return this.InviteService(title, category, pageNo, filterFlag, formData);
    }

}
