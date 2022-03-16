import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { McReport, McDailyReport } from './model';
import { BehaviorSubject, Observable, tap } from 'rxjs';

const baseUrl = 'http://localhost:3000';

@Injectable({
  providedIn: 'root',
})
export class McReportService {
  private _mcDailyReports = new BehaviorSubject<McDailyReport[] | null>([]);
  private _mcDailyReport = new BehaviorSubject<McDailyReport | null>(null);

  constructor(private http: HttpClient) {}

  // Getter for daily reports
  get mcDailyReports$(): Observable<McDailyReport[]>{
    return this._mcDailyReports.asObservable();
  }

  // Getter for daily reports
  get mcDailyReport$(): Observable<McDailyReport>{
    return this._mcDailyReport.asObservable();
  }

  // Get mc daily reports
  getMcDailyReports(): Observable<McDailyReport[]>{
      return this.http.get<McDailyReport[]>(
        `${baseUrl}/mcDailyReports`
        )
        .pipe(
          tap((res)=>{
            this._mcDailyReports.next(res);
          })
        )   
  }

  // Get mc daily report by userId
  getMcDailyReportByUserId(userId: any): Observable<McDailyReport>{
    return this.http.get<McDailyReport>(
      `${baseUrl}/mcDailyReports?userId=${userId}`
      )
      .pipe(
        tap((res)=>{
          this._mcDailyReport.next(res[0]);
        })
      )   
  }
}
