import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { DeliverySlipComponent } from './delivery-slip.component';
import { CreateA7SlipComponent } from './a7/a7.component';
import { CSVDatalistComponent } from './list/list.component';

import { deliverySlipRoutes } from './delivery-slip.routing';

import { SharedModule } from 'app/shared/shared.module';
import { MaterialModule } from '../material.module';

const exampleRoutes: Route[] = [
    {
        path     : '',
        component: DeliverySlipComponent
    }
];

@NgModule({
    declarations: [
        DeliverySlipComponent,
        CreateA7SlipComponent,
        CSVDatalistComponent,
    ],
    imports     : [
        RouterModule.forChild(deliverySlipRoutes),
        SharedModule,
        MaterialModule,
    ]
})
export class DeliverySlipModule
{
}
