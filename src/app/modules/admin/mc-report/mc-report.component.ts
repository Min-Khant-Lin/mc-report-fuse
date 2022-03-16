import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'mc-report',
    templateUrl    : './mc-report.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class McReportComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
