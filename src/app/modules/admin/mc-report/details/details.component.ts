import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, QueryList, Renderer2, TemplateRef, ViewChild, ViewChildren, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TemplatePortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { debounceTime, Observable, Subject, takeUntil } from 'rxjs';
import { FuseConfirmationService } from '@fuse/services/confirmation';

import { McDailyReport, McReport } from '../model';
import { McReportService } from '../mc-report.service';
import { McReportListComponent } from '../list/list.component';

import { MatAccordion } from '@angular/material/expansion';
import {MatDialog} from '@angular/material/dialog';
import { McReportAddDialogComponent } from '../add/dialog/dialog.component';
@Component({
    selector       : 'mc-report-details',
    templateUrl    : './details.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class McReportDetailsComponent implements OnInit, OnDestroy
{
    @ViewChild('avatarFileInput') private _avatarFileInput: ElementRef;
    @ViewChild('tagsPanel') private _tagsPanel: TemplateRef<any>;
    @ViewChild('tagsPanelOrigin') private _tagsPanelOrigin: ElementRef;

    // @ViewChild(MatAccordion) accordion: MatAccordion;
    @ViewChildren(MatAccordion)
    accordion: QueryList<MatAccordion>;

    mcDailyReport: McDailyReport;

    editMode: boolean = false;

    tagsEditMode: boolean = false;

    private _tagsPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,

        private _fuseConfirmationService: FuseConfirmationService,
        private _renderer2: Renderer2,
        private _router: Router,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef,

        private _mcReportListComponent : McReportListComponent,
        private _mcService: McReportService,

        public dialog: MatDialog,
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
        // Open the drawer
        this._mcReportListComponent.matDrawer.open();

        // Get the contact
        this._mcService.mcDailyReport$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((mcDailyReport: McDailyReport) => {
                // Open the drawer in case it is closed
                this._mcReportListComponent.matDrawer.open();
            
                // Get the contact
                this.mcDailyReport = mcDailyReport;
                console.log(this.mcDailyReport)
            
                // Toggle the edit mode off
                this.toggleEditMode(false);
            
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

        // Dispose the overlays if they are still on the DOM
        if ( this._tagsPanelOverlayRef )
        {
            this._tagsPanelOverlayRef.dispose();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    // Toggle Accordion
    openAll(i:any){
        // console.log(this.accordion.get(i))
        this.accordion.get(i).openAll();
    }

    closeAll(i:any){
        this.accordion.get(i).closeAll();
    }

    /**
     * Close the drawer
     */
    closeDrawer(): Promise<MatDrawerToggleResult>
    {
        return this._mcReportListComponent.matDrawer.close();
    }

    /**
     * Toggle edit mode
     *
     * @param editMode
     */
    toggleEditMode(editMode: boolean | null = null): void
    {
        if ( editMode === null )
        {
            this.editMode = !this.editMode;
        }
        else
        {
            this.editMode = editMode;
        }

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }


    /**
     * Delete the contact
     */
    deleteContact(): void
    {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title  : 'Delete contact',
            message: 'Are you sure you want to delete this contact? This action cannot be undone!',
            actions: {
                confirm: {
                    label: 'Delete'
                }
            }
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {

            // If the confirm button pressed...
            if ( result === 'confirmed' )
            {


                // Mark for check
                this._changeDetectorRef.markForCheck();
            }
        });

    }

    openEdit(report: McReport){
        // Launch the modal
        this.dialog.open(McReportAddDialogComponent, {
            autoFocus: false,
            data:report
        })
            .afterClosed()
            .subscribe(() => {

                // Go up twice because card routes are setup like this; "card/CARD_ID"
                // this._router.navigate(['./..'], {relativeTo: this._activatedRoute});
            });
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
