import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { McReport, McDailyReport } from './model';
import { BehaviorSubject, Observable, tap, take } from 'rxjs';

const baseUrl = 'http://localhost:3000';

@Injectable({
  providedIn: 'root',
})
export class McReportService {
  private _mcDailyReports = new BehaviorSubject<McDailyReport[] | null>([]);
  private _mcDailyReport = new BehaviorSubject<McDailyReport | null>(null);
  private _mcReport = new BehaviorSubject<McReport | null>(null);

  constructor(private http: HttpClient) {}

  // Getter for daily reports
  get mcDailyReports$(): Observable<McDailyReport[]>{
    return this._mcDailyReports.asObservable();
  }

  // Getter for daily reports
  get mcDailyReport$(): Observable<McDailyReport>{
    return this._mcDailyReport.asObservable();
  }

  // Getter for report
  get mcReport$(): Observable<McReport>{
    return this._mcReport.asObservable();
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

  // Get mc report by reportId
  getMcReportByReportId(reportId: any): Observable<McReport>{
    return this.http.get<McReport>(
      `${baseUrl}/mcReports?id=${reportId}`
    )
    .pipe(
      take(1),
      tap((res)=>{
        this._mcReport.next(res[0]);
        console.log(res[0])
      })
    )
  }

  // Create mc report
  createMcReport(data:McDailyReport):Observable<McReport>{
    return this.http.post<McReport>(
      `${baseUrl}/mcReports`,data
      );
  }

  // Update mc report
  updateMcReport(id:any, data:McReport):Observable<McReport>{
    return this.http.put<McReport>(
      `${baseUrl}/mcReports/${id}`,data
      )
      .pipe(
        tap((res)=>{
          this._mcReport.next(res);
        })
      );
  }

  // Delete mc report
  deleteMcReport(id:any){
     return this.http.delete(
       `${baseUrl}/mcReports/${id}`
     )
  }
}
