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
    constructor(
        private _mcService: McReportService,
        private _router: Router,
    )
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
        return this._mcService.getMcDailyReportByUserId(route.paramMap.get('userId'))
            .pipe(
                // Error here means the requested contact is not available
                catchError((error) => {

                    // Log the error
                    console.error(error);

                    // Get the parent url
                    const parentUrl = state.url.split('/').slice(0, -1).join('/');

                    // Navigate to there
                    this._router.navigateByUrl(parentUrl);

                    // Throw an error
                    return throwError(error);
                })
            );
    }
}