import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
// import { MatButtonModule } from '@angular/material/button';
// import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DATE_FORMATS, MatRippleModule } from '@angular/material/core';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatDividerModule } from '@angular/material/divider';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatIconModule } from '@angular/material/icon';
// import { MatInputModule } from '@angular/material/input';
// import { MatMenuModule } from '@angular/material/menu';
// import { MatNativeDateModule } from '@angular/material/core';
// import { MatMomentDateModule } from '@angular/material-moment-adapter';
// import { MatProgressBarModule } from '@angular/material/progress-bar';
// import { MatRadioModule } from '@angular/material/radio';
// import { MatSelectModule } from '@angular/material/select';
// import { MatSidenavModule } from '@angular/material/sidenav';
// import { MatTableModule } from '@angular/material/table';
// import { MatTooltipModule } from '@angular/material/tooltip';
import * as moment from 'moment';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { SharedModule } from 'app/shared/shared.module';

import { McReportRoutes } from './mc-report.routing';
import { McReportComponent } from './mc-report.component';
import { McReportListComponent } from './list/list.component';
import { McReportDetailsComponent } from './details/details.component';
import { McReportAddComponent } from './add/add.component';
import { McReportAddDetailsComponent } from './add/details/details.component';


import { MaterialModule } from '../material.module';
@NgModule({
    declarations: [
        McReportComponent,
        McReportListComponent,
        McReportDetailsComponent,
        McReportAddComponent,
        McReportAddDetailsComponent,
    ],
    imports     : [
        RouterModule.forChild(McReportRoutes),
        // MatButtonModule,
        // MatCheckboxModule,
        // MatDatepickerModule,
        // MatDividerModule,
        // MatFormFieldModule,
        // MatIconModule,
        // MatInputModule,
        // MatMenuModule,
        // MatNativeDateModule,
        // MatMomentDateModule,
        // MatProgressBarModule,
        // MatRadioModule,
        // MatRippleModule,
        // MatSelectModule,
        // MatSidenavModule,
        // MatTableModule,
        // MatTooltipModule,
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
