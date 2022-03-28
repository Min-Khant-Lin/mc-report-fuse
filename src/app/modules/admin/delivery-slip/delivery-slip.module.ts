import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DeliverySlipComponent } from './delivery-slip.component';
import { deliverySlipRoutes } from './delivery-slip.routing';
import { SharedModule } from 'app/shared/shared.module';
import { MaterialModule } from '../material.module';
import { CSVImportComponent } from './csv-import/csv-import.component';

const exampleRoutes: Route[] = [
    {
        path     : '',
        component: DeliverySlipComponent
    }
];

@NgModule({
    declarations: [
        DeliverySlipComponent,
        CSVImportComponent,
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
