import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MAT_DATE_FORMATS, MatRippleModule } from '@angular/material/core';
import * as moment from 'moment';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { SharedModule } from 'app/shared/shared.module';
import { McReportRoutes } from './mc-report.routing';
import { McReportComponent } from './mc-report.component';
import { McReportListComponent } from './list/list.component';
import { McReportDetailsComponent } from './details/details.component';
import { McReportAddComponent } from './add/add.component';
import { McReportAddDialogComponent } from './add/dialog/dialog.component';
import { MaterialModule } from '../material.module';

@NgModule({
    declarations: [
        McReportComponent,
        McReportListComponent,
        McReportDetailsComponent,
        McReportAddComponent,
        McReportAddDialogComponent,
    ],
    imports     : [
        RouterModule.forChild(McReportRoutes),
        MaterialModule,
        FuseFindByKeyPipeModule,
        SharedModule
    ],
    providers   : [
        {
            provide : MAT_DATE_FORMATS,
            useValue: {
                parse  : {
                    dateInput: moment.ISO_8601
                },
                display: {
                    dateInput         : 'LL',
                    monthYearLabel    : 'MMM YYYY',
                    dateA11yLabel     : 'LL',
                    monthYearA11yLabel: 'MMMM YYYY'
                }
            }
        }
    ]
})
export class McReportModule
{
}
