import { Route } from '@angular/router';
import { CanDeactivateMcReportDetails } from 'app/modules/admin/mc-report/mc-report.guards';
import { McDailyReportResolver, McDailyReportsResolver } from './mc-report.resolvers';

import { McReportComponent } from './mc-report.component';
import { McReportListComponent } from './list/list.component';
import { McReportDetailsComponent } from './details/details.component';

export const mcReportRoutes: Route[] = [
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
                        path         : ':userId',
                        component    : McReportDetailsComponent,
                        resolve      : {
                            mcDailyReport: McDailyReportResolver,
                        },
                        canDeactivate: [CanDeactivateMcReportDetails]
                    }
                ]
            }
        ]
    }
];
