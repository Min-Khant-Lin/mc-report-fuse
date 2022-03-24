import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef } from '@angular/material/dialog';
import { debounceTime, Subject, takeUntil, tap } from 'rxjs';
import { McReportService } from '../../mc-report.service';

@Component({
    selector       : 'mc-report-add-details',
    templateUrl    : './dialog.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush, 
})
export class McReportAddDialogComponent implements OnInit, OnDestroy
{
    @ViewChild('labelInput') labelInput: ElementRef<HTMLInputElement>;
    mcReportForm: FormGroup;

    production = true;
    pass = true;

    // Private
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        public matDialogRef: MatDialogRef<McReportAddDialogComponent>,
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        private _mcService: McReportService,
    )
    {
    }

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
            id:[''],
            userName:[''],
            date:[''],
            machine:[''],
            isProduction:[''],
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
        console.log(this.mcReportForm.value)
        if(this.mcReportForm.valid){
            this._mcService.createMcReport(this.mcReportForm.value).subscribe({
                next:(res)=>{
                    this.mcReportForm.reset();
                    this.matDialogRef.close('save');
                },
                error:()=>{
                    alert('Error while adding report.')
                }
            })
        }
    }

    toggleProduction(){
        this.production = !this.production;
        // if(this.production==false){
        //   this.pass = true
        // }
    }

    togglePass() {
        this.pass = !this.pass;
    }
    
    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

}
