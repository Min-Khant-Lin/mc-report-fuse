import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { McReport, McDailyReport, McMachine } from './model';
import { BehaviorSubject, Observable, tap, take, groupBy, catchError } from 'rxjs';
import { DatePipe } from '@angular/common';


const baseUrl = 'http://localhost:3000';

@Injectable({
  providedIn: 'root',
})

export class McReportService {
  private _mcDailyReports = new BehaviorSubject<McDailyReport[] | null>([]);
  private _mcDailyReport = new BehaviorSubject<McDailyReport | null>(null);
  private _mcReport = new BehaviorSubject<McReport | null>(null);

  constructor(
    private http: HttpClient,
    private datePipe: DatePipe,
    ) {}

  transformDate(date: any){
    return this.datePipe.transform(date,'yyyy-MM-dd');
  }

  // Getter for daily reports
  get mcDailyReports$(): Observable<McDailyReport[]>{
    return this._mcDailyReports.asObservable();
  }

  // Getter for daily report
  get mcDailyReport$(): Observable<McDailyReport>{
    return this._mcDailyReport.asObservable();
  }

  // Getter for report
  get mcReport$(): Observable<McReport>{
    return this._mcReport.asObservable();
  }

  getMcDailyReports(date: any): Observable<McReport[]>{
    console.log(date);

    return this.http.get<McReport[]>(
      `${baseUrl}/mcReports?date=${date}`
    )
    .pipe(
      tap((res)=>{
        // console.log(res);
        let reports:McDailyReport[] = this.transformReports(res)
        this._mcDailyReports.next(reports);
      })
    )
  }

  getMcDailyReport(userId: any, date: any): Observable<McReport[]>{
    return this.http.get<McReport[]>(
      `${baseUrl}/mcReports?userId=${userId}&date=${date}`
      )
      .pipe(
        tap((res)=>{
          let reports: McDailyReport[] = this.transformReports(res)
          this._mcDailyReport.next(reports[0]);
        })
      )
  }

  // mcReports into mcDailyReports
  transformReports(reports: McReport[]){
    interface user{
      userId: number,
      userName: string,
      date: Date
    }
    let user: user;
    let users: user[] = [];
    let userIdList = [];

    // NOTE get user list
    reports.forEach( function (report){
      if(userIdList.includes(report.userId)){
        // console.log('skip');
      }
      else{
        user = {
          userId: report.userId,
          userName: report.userName,
          date: report.date
        }
        users.push(user);
        userIdList.push(report.userId)
      }
    })


    let tempMcDailyReport: McDailyReport;
    let tempMcDailyReports: McDailyReport[] = [];
    let checked: boolean = true;
    // NOTE loop through users
    users.forEach(function(user){
      let reportsFilteredByUser = reports.filter(report=>report.userId === user.userId);
      // console.log(reportsFilteredByUser);

      let machines = []
      reportsFilteredByUser.forEach(function(report){
        if(machines.includes(report.machine)){
          // console.log('skip');
        }
        else{
          machines.push(report.machine);
        }
      })

      // console.log("Machine List: " + machines);
      
      let tempMcMachine: McMachine;
      let tempMcMachines: McMachine[] = [];
      let tempTotalMT = 0;
      let tempTotalSt = 0;
      machines.forEach(function(machine){
        let reportsFilteredByMachine = reportsFilteredByUser.filter(report=>report.machine === machine)
        // console.log(reportsFilteredByMachine);

        let tempMcReport: McReport;
        let tempMcReports: McReport[] = [];
        reportsFilteredByMachine.forEach(function(report){
            // tempMcReportDetail = {
            //   id          : report.id,
            //   reportType  : report.reportType,
            //   customerCode: report.customerCode,
            //   material    : report.material,
            //   productCode : report.productCode,
            //   amount      : report.amount,
            //   fail        : report.fail,
            //   failAmount  : report.failAmount,
            //   failReason  : report.failReason,
            //   mt          : report.mt,
            //   st          : report.st,
            //   cmt         : report.cmt,
            //   checked     : report.checked
            // }
            tempMcReport = report;
            
            if(report.checked == false){
              checked = false;
            }

            tempTotalMT = tempTotalMT + Number(report.mt);
            tempTotalSt = tempTotalSt + Number(report.st);
            tempMcReports.push(tempMcReport);
        })

        tempMcMachine = {
          machine: machine,
          machineSt: tempTotalMT,
          reports: tempMcReports
        }

        tempMcMachines.push(tempMcMachine);
        
      })

      tempMcDailyReport = {
        userId: user.userId,
        userName: user.userName,
        date: user.date,
        totalSt: tempTotalSt,
        checked: checked,
        machines: tempMcMachines
      }

      tempMcDailyReports.push(tempMcDailyReport);
    })

    // console.log(tempMcDailyReports);
    return tempMcDailyReports;
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
