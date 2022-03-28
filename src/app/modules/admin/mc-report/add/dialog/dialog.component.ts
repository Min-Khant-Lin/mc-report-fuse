import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { debounceTime, Subject, takeUntil, tap } from 'rxjs';
import { McReportService } from '../../mc-report.service';
import { McReport } from '../../model';

import { DatePipe } from '@angular/common';
import {
    MAT_MOMENT_DATE_FORMATS,
    MomentDateAdapter,
    MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  } from '@angular/material-moment-adapter';
  import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
  import 'moment/locale/ja';
  import 'moment/locale/fr';

const now = new Date();
const machineList = ['MC', 'MILLAC', 'ラジアル']
@Component({
    selector       : 'mc-report-add-details',
    styleUrls      :['./dialog.component.scss'],
    templateUrl    : './dialog.component.html',
    providers      :[
        DatePipe,

        {provide: MAT_DATE_LOCALE, useValue: 'ja-JP'},

        // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
        // `MatMomentDateModule` in your applications root module. We provide it at the component level
        // here, due to limitations of our example generation script.
        {
          provide: DateAdapter,
          useClass: MomentDateAdapter,
          deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
        },
        {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},

    ],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush, 
})
export class McReportAddDialogComponent implements OnInit, OnDestroy
{
    @ViewChild('labelInput') labelInput: ElementRef<HTMLInputElement>;
    mcReportForm: FormGroup;
    machines = machineList
    reportType = 0;
    pass = true;
    actionBtn = '登録';

    // Private
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _mcService: McReportService,
        
        public matDialogRef: MatDialogRef<McReportAddDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public editData: McReport,
        private _changeDetectorRef: ChangeDetectorRef,
        private datePipe: DatePipe,
    )
    {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {   

        // Prepare the mc report form
        this.mcReportForm = this._formBuilder.group({
            userName:[''],
            date:[now],
            machine:[''],
            reportType:[''],
            customerCode:[''],
            material:[''],
            productCode:[''],
            amount:[''],
            passFail:[''],
            failAmount:[''],
            failReason:[''],
            mt:[''],
            st:[''],
            cmt:[''],
            checked:[''],
        })

        // Get the initital value
        var machine = localStorage.getItem("machine")
        if(machine){
            this.mcReportForm.controls['machine'].setValue(machine);
        }

        // Get the edit data
        if (this.editData) {
            this.actionBtn = '更新';
            this.mcReportForm.controls['userName'].setValue(this.editData.userName);
            this.mcReportForm.controls['date'].setValue(this.editData.date);
            this.mcReportForm.controls['machine'].setValue(this.editData.machine);
            this.mcReportForm.controls['reportType'].setValue(this.editData.reportType);
            this.mcReportForm.controls['customerCode'].setValue(this.editData.customerCode);
            this.mcReportForm.controls['material'].setValue(this.editData.material);
            this.mcReportForm.controls['productCode'].setValue(this.editData.productCode);
            this.mcReportForm.controls['amount'].setValue(this.editData.amount);
            this.mcReportForm.controls['passFail'].setValue(this.editData.passFail);
            this.mcReportForm.controls['failAmount'].setValue(this.editData.failAmount);
            this.mcReportForm.controls['failAmount'].setValue(this.editData.failAmount);
            this.mcReportForm.controls['failReason'].setValue(this.editData.failReason);
            this.mcReportForm.controls['mt'].setValue(this.editData.mt);
            this.mcReportForm.controls['st'].setValue(this.editData.st);
            this.mcReportForm.controls['cmt'].setValue(this.editData.cmt);
            this.mcReportForm.controls['checked'].setValue(this.editData.checked);
        }
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    addMcReport(){
        // Change date format of form
        this.mcReportForm.value.date = this.datePipe.transform(this.mcReportForm.get('date').value, 'yyyy-MM-dd')

        if(!this.editData){
            console.log(this.mcReportForm.value)
            if(this.mcReportForm.valid){
                this._mcService.createMcReport(this.mcReportForm.value)
                .subscribe({
                    next:(res)=>{
                        this.mcReportForm.reset();
                        this.matDialogRef.close('save');
                    },
                    error:()=>{
                        alert('Error while adding report.');
                    }
                })
            }
        }else{
            this.updateMcReport();
        }
    }

    updateMcReport(){
        console.log(this.mcReportForm.value)
        if(this.mcReportForm.valid){
            this._mcService.updateMcReport(this.editData.id, this.mcReportForm.value)
            .subscribe({
                next:(res)=>{
                    this.mcReportForm.reset();
                    this.matDialogRef.close('update');
                },
                error:()=>{
                    alert('Error while updating report.');
                }
            })
        }
    }

    changeReportType(event: any){
        this.reportType = event.value;
    }

    saveAtLocalStorage(event:any){
        localStorage.setItem("machine", event.value);
    }
    // toggleProduction(){
    //     this.production = !this.production;
    //     // if(this.production==false){
    //     //   this.pass = true
    //     // }
    // }

    togglePass() {
        this.pass = !this.pass;
    }
    
    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

}
