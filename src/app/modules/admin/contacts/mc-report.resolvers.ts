import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';

import { McReportService } from './mc-report.service';
import { McDailyReport } from './model';

@Injectable({
    providedIn: 'root'
})
export class McDailyReportsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _mcService: McReportService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<McDailyReport[]>
    {
        return this._mcService.getMcDailyReports();
    }
}

@Injectable({
    providedIn: 'root'
})
export class McDailyReportResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _mcService: McReportService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<McDailyReport>
    {
        return this._mcService.getMcDailyReportByUserId(route.paramMap.get('id'));
    }
}