import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { McReport, McDailyReport } from './model';
import { BehaviorSubject, Observable, tap } from 'rxjs';

const baseUrl = 'http://localhost:3000';

@Injectable({
  providedIn: 'root',
})
export class McReportService {

  constructor(
    private _mcDailyReports = new BehaviorSubject<McDailyReport[] | null>([]),
    private http: HttpClient) {}

  // Getter for daily reports
  get mcDailyReports$(): Observable<McDailyReport[]>{
    return this._mcDailyReports.asObservable();
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





  // postReport(data: McReport) {
  //   return this.http.post<McReport>(baseUrl + '/reports/', data);
  // }

  // getReport(id: number) {
  //   return this.http.get<McReport>(baseUrl + '/reports/' + id);
  // }

  // putReport(id: number, data: McReport){
  //   return this.http.put<McReport>(baseUrl+ '/reports/' +id,data);
  // }
  
  // deleteReport(id: number) {
  //   return this.http.delete<McReport>(baseUrl + '/reports/' + id);
  // }

  // getAllReport() {
  //   return this.http.get<McReport[]>(baseUrl + '/reports');
  // }

  // getReportInfo(){
  //   return this.http.get<McReportInfo[]>(baseUrl + '/reportList')
  // }

}
