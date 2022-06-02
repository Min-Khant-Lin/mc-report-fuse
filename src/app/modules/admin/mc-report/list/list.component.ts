import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { filter, fromEvent, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';

import { McReportService } from '../mc-report.service';
import { McDailyReport } from '../model';

@Component({
    selector       : 'mc-report-list',
    templateUrl    : './list.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class McReportListComponent implements OnInit, OnDestroy
{
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;

    mcDailyReports$: Observable<McDailyReport[]>;
    selectedMcDailyReport: McDailyReport;
    mcDailyReportCount: number = 0;

    dateForm: FormGroup;
    userNameFilter:string = '';

    drawerMode: 'side' | 'over';

    todayDate = new Date;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        @Inject(DOCUMENT) private _document: any,
        private _formBuilder: FormBuilder,
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
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
        this.dateForm = this._formBuilder.group({
            filterDate: [this._mcService.transformDate(this.todayDate)],
        });

        // this._mcService.getMcDailyReports().subscribe();
        this.mcDailyReports$ = this._mcService.mcDailyReports$;
        console.log(this.mcDailyReports$)

        // this._mcService.mcDailyReports$
        // .pipe(takeUntil(this._unsubscribeAll))
        // .subscribe((mcDailyReports: McDailyReport[]) => {
        
        //     // Get the contact
        //     this.mcDailyReports = mcDailyReports;
        //     var a :number = 0;
        //     for(var i of this.mcDailyReports){
        //         // console.log(report)
        //         for(var report of i['reports']){
        //             // console.log(report);
        //             var index: number = 1;
        //             for(var detail of report['detail']){
        //                 if(index==1){
        //                     this.mcDailyReportCheck[a] = detail['checked']
        //                     index++;
        //                 }
        //                 console.log(detail)
        //                 this.mcDailyReportCheck[a] = this.mcDailyReportCheck[a] && detail['checked']
        //             }
        //             console.log(this.mcDailyReportCheck)
        //         }
        //         a++;
        //     }
        //     // console.log(this.mcDailyReports)
        
        // });
        
        // Filter by Date
        this.dateForm
            .get('filterDate')
            .valueChanges.subscribe((filterDate)=>{
                // Change date format of form
                filterDate = this._mcService.transformDate(filterDate);
                // this._mcService.getMcDailyReportsByDate(filterDate).subscribe();

                this._mcService.getMcDailyReports(filterDate).subscribe();
            })
                
                
        // Subscribe to MatDrawer opened change
        this.matDrawer.openedChange.subscribe((opened) => {
            if ( !opened )
            {
                // Remove the selected contact when drawer closed
                // this.selectedContact = null;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            }
        });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {
                // Set the drawerMode if the given breakpoint is active
                if ( matchingAliases.includes('lg') )
                {
                    this.drawerMode = 'side';
                }
                else
                {
                    this.drawerMode = 'over';
                }
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
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

    /**
     * On backdrop clicked
     */
    onBackdropClicked(): void
    {
        // Go back to the list
        this._router.navigate(['./'], {relativeTo: this._activatedRoute});

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
