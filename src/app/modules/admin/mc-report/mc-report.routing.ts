import { Route } from '@angular/router';
import { CanDeactivateMcReportDetails } from 'app/modules/admin/mc-report/mc-report.guards';
import { McDailyReportResolver, McDailyReportsResolver } from './mc-report.resolvers';

import { McReportComponent } from './mc-report.component';
import { McReportListComponent } from './list/list.component';
import { McReportDetailsComponent } from './details/details.component';
import { McReportAddComponent } from './add/add.component';


export const McReportRoutes: Route[] = [
    {
        path     : '',
        component: McReportComponent,
        resolve  : {

        },
        children : [
            {
                path     : '',
                component: McReportListComponent,
                resolve  : {
                    mcDailyReports: McDailyReportsResolver,
                },
                children : [
                    {
                        path          : 'add',
                        component    : McReportAddComponent,
                    },
                    {
                        path         : ':userId/:date',
                        component    : McReportDetailsComponent,
                        resolve      : {
                            mcDailyReport: McDailyReportResolver,
                        },
                        canDeactivate: [CanDeactivateMcReportDetails],
                        children: [
                            {
                                path        : 'edit',
                            }
                        ]
                    },

                ]
            }
        ]
    }
];
