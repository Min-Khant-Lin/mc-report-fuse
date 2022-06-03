import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { debounceTime, Subject, takeUntil, tap } from 'rxjs';
import { DatePipe } from '@angular/common';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { McReportService } from '../../mc-report.service';
import { McReport } from '../../model';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import 'moment/locale/ja';
import 'moment/locale/fr';

@Component({
    selector       : 'mc-report-add-details',
    styleUrls      :['./dialog.component.scss'],
    templateUrl    : './dialog.component.html',
    providers      :[

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

export class McReportAddDialogComponent implements OnInit, OnDestroy {

    @ViewChild('labelInput') labelInput: ElementRef<HTMLInputElement>;
    mcReportForm: FormGroup;
    todayDate = new Date();
    machines = ['MC', 'MILLAC', 'ラジアル']
    reportType: number = 1;
    fail: boolean = false;
    checked: boolean;
    actionBtn = '登録';

    customerOptions: string[] = ['住友', '日立', 'ティエラ', '末吉'];
    customerFilteredOptions: Observable<string[]>;

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
        // Get value from local storage
        var machineFromLocal = localStorage.getItem('machine');
        var reprotTypeFromLocal = localStorage.getItem('reportType');

        // Prepare the mc report form
        this.mcReportForm = this._formBuilder.group({
            userId:[''],
            userName:[''],
            date:[this.todayDate],
            machine:[machineFromLocal],
            reportType:[reprotTypeFromLocal],
            customerCode:[''],
            material:[''],
            productCode:[''],
            amount:[''],
            fail:[false],
            failAmount:[''],
            failReason:[''],
            mt:[''],
            st:[''],
            cmt:[''],
            checked:[true],
        })

        // Autocomplete userCode
        this.customerFilteredOptions = this.mcReportForm.get('customerCode').valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value)),
        );

        // Get the edit data
        if (this.editData) {
            this.actionBtn = '更新';

            this.mcReportForm.controls['userId'].setValue(this.editData.userId);
            this.mcReportForm.controls['userName'].setValue(this.editData.userName);
            this.mcReportForm.controls['date'].setValue(this.editData.date);
            this.mcReportForm.controls['machine'].setValue(this.editData.machine);
            this.mcReportForm.controls['reportType'].setValue(this.editData.reportType);
            // Set the reportType
            this.reportType = this.editData.reportType;
            
            this.mcReportForm.controls['customerCode'].setValue(this.editData.customerCode);
            this.mcReportForm.controls['material'].setValue(this.editData.material);
            this.mcReportForm.controls['productCode'].setValue(this.editData.productCode);
            this.mcReportForm.controls['amount'].setValue(this.editData.amount);
            this.mcReportForm.controls['fail'].setValue(this.editData.fail);
            // Set the fail fail value
            this.fail = this.editData.fail;

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
        this.mcReportForm.value.date = this._mcService.transformDate(this.mcReportForm.get('date').value)
        
        // Check report Type
        if(this.mcReportForm.value.reportType == 2){
            this.mcReportForm.value.mt = '';
        }
        else if(this.mcReportForm.value.reportType == 3){
            this.mcReportForm.value.customerCode = '';
            this.mcReportForm.value.material = '';
            this.mcReportForm.value.productCode = '';
            this.mcReportForm.value.amount = '';
            this.mcReportForm.value.fail = '';
            this.mcReportForm.value.failAmount = '';
            this.mcReportForm.value.failReason = '';
            this.mcReportForm.value.mt = '';
        }

        // Save at local storage
        localStorage.setItem('machine', this.mcReportForm.get('machine').value)
        localStorage.setItem('reportType', this.mcReportForm.get('reportType').value)

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

    toggleFail() {
        this.fail = !this.fail;
    }

    toggleChecked() {
        this.checked = !this.checked;
        this.mcReportForm.controls['checked'].setValue(this.checked);
    }
    
    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    private _filter(value: string): string[] {
        // console.log(value);
        if(value != null){
            const filterValue = value.toLowerCase();
            return this.customerOptions.filter(option => option.toLowerCase().includes(filterValue));
        }
    }
}
