import { Route } from '@angular/router';

import { DeliverySlipComponent } from './delivery-slip.component';
import { CreateA7SlipComponent } from './a7/a7.component';

export const deliverySlipRoutes: Route[] = [
    {
        path     : '',
        component: DeliverySlipComponent,
        resolve  : {

        },
        children : [
            {
                path     : '',
                component: CreateA7SlipComponent,
                // resolve  : {
                //     mcDailyReports: McDailyReportsResolver,
                // },
                // children : [
                //     {
                //         path          : 'add',
                //         component    : McReportAddComponent,
                //     }
                // ]
            }
        ]
    }
];
