import { Route } from '@angular/router';
import { CanDeactivateContactsDetails } from 'app/modules/admin/contacts/contacts.guards';
import { ContactsContactResolver, ContactsCountriesResolver, ContactsResolver, ContactsTagsResolver } from 'app/modules/admin/contacts/contacts.resolvers';
import { ContactsComponent } from 'app/modules/admin/contacts/contacts.component';
import { ContactsListComponent } from 'app/modules/admin/contacts/list/list.component';
import { ContactsDetailsComponent } from 'app/modules/admin/contacts/details/details.component';
import { McDailyReportResolver, McDailyReportsResolver } from './mc-report.resolvers';

export const contactsRoutes: Route[] = [
    {
        path     : '',
        component: ContactsComponent,
        resolve  : {
            tags: ContactsTagsResolver
        },
        children : [
            {
                path     : '',
                component: ContactsListComponent,
                resolve  : {
                    mcDailyReports: McDailyReportsResolver,
                    // contacts : ContactsResolver,
                    // countries: ContactsCountriesResolver
                },
                children : [
                    {
                        path         : ':userId',
                        component    : ContactsDetailsComponent,
                        resolve      : {
                            mcDailyReport: McDailyReportResolver,
                        //     contact  : ContactsContactResolver,
                        //     countries: ContactsCountriesResolver
                        },
                        canDeactivate: [CanDeactivateContactsDetails]
                    }
                ]
            }
        ]
    }
];
