import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { McReportAddDetailsComponent } from './details/details.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector       : 'mc-report-add',
    templateUrl    : './add.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class McReportAddComponent implements OnInit
{
    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _matDialog: MatDialog,
        private _router: Router
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
        // Launch the modal
        this._matDialog.open(McReportAddDetailsComponent, {
            autoFocus: false,
            disableClose: true,})
            .afterClosed()
            .subscribe(() => {
                // Go up twice because card routes are setup like this; "card/CARD_ID"
                this._router.navigate(['./..'], {relativeTo: this._activatedRoute});
            });
    }
}
