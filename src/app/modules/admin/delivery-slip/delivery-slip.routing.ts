import { Route } from '@angular/router';
import { CSVImportComponent } from './csv-import/csv-import.component';
import { DeliverySlipComponent } from './delivery-slip.component';

export const deliverySlipRoutes: Route[] = [
    {
        path     : '',
        component: DeliverySlipComponent,
        resolve  : {

        },
        children : [
            {
                path     : '',
                component: CSVImportComponent,
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
