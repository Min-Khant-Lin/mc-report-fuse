import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { McReport, McDailyReport, McReportDetail, McMachine } from './model';
import { BehaviorSubject, Observable, tap, take, groupBy } from 'rxjs';
import { DatePipe } from '@angular/common';
import { filter, StringNullableChain } from 'lodash';


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

  // Getter for daily reports
  get mcDailyReport$(): Observable<McDailyReport>{
    return this._mcDailyReport.asObservable();
  }

  // Getter for report
  get mcReport$(): Observable<McReport>{
    return this._mcReport.asObservable();
  }

  // Get mc daily reports
  // getMcDailyReports(): Observable<McDailyReport[]>{
  //     return this.http.get<McDailyReport[]>(
  //       `${baseUrl}/mcDailyReports`
  //       )
  //       .pipe(
  //         tap((res)=>{
  //           this._mcDailyReports.next(res);
  //         })
  //       )   
  // }

  // Get mc daily reports by date
  getMcDailyReportsByDate(date: any): Observable<McDailyReport[]>{
    console.log(date);

    return this.http.get<McDailyReport[]>(
      `${baseUrl}/mcDailyReports?date=${date}`
    )
    .pipe(
      tap((res)=>{
        // console.log(res);
        this._mcDailyReports.next(res);
      })
    )
  }



  getMcDailyReports(date: any): Observable<McReport[]>{
    console.log(date);

    return this.http.get<McReport[]>(
      `${baseUrl}/mcReports?date=${date}`
    )
    .pipe(
      tap((res)=>{
        // console.log(res);
        this.transformReports(res);
        // this._mcDailyReports.next(res);
      })
    )
  }

  // mcReports into mcDailyReports
  transformReports(reports: McReport[]){
    interface user{
      userId: number,
      userName: string,
      date: Date,
    }
    let user: user;
    let users: user[] = [];
    let userIdList = [];

    console.log("All: " + reports);
    // NOTE get user list
    reports.forEach( function (report){
      if(userIdList.includes(report.userId)){
        console.log('skip');
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

    let tempTotalSt = 0;
    let tempMcDailyReport: McDailyReport;
    let tempMcDailyReports: McDailyReport[] = [];
    // NOTE loop through users
    users.forEach(function(user){
      let reportsFilteredByUser = reports.filter(report=>report.userId === user.userId);
      console.log(reportsFilteredByUser);

      let machines = []
      reportsFilteredByUser.forEach(function(report){
        if(machines.includes(report.machine)){
          // console.log('skip');
        }
        else{
          machines.push(report.machine);
        }
      })

      console.log("Machine List: " + machines);
      
      let tempMcMachine: McMachine;
      let tempMcMachines: McMachine[] = [];
      let tempTotalMT:number = 0;
      machines.forEach(function(machine){
        let reportsFilteredByMachine = reportsFilteredByUser.filter(report=>report.machine === machine)
        console.log(reportsFilteredByMachine);

        let tempMcReportDetail: McReportDetail;
        let tempMcReportDetails: McReportDetail[] = [];
        reportsFilteredByMachine.forEach(function(report){
            tempMcReportDetail = {
              id          : report.id,
              reportType  : report.reportType,
              customerCode: report.customerCode,
              material    : report.material,
              productCode : report.productCode,
              amount      : report.amount,
              passFail    : report.passFail,
              failAmount  : report.failAmount,
              failReason  : report.failReason,
              mt          : report.mt,
              st          : report.st,
              cmt         : report.cmt,
              checked     : report.checked
            }

            tempTotalMT +=report.mt;
            console.log(tempMcReportDetail);
            tempMcReportDetails.push(tempMcReportDetail);
        })
        
        tempTotalSt += tempTotalMT;

        tempMcMachine = {
          machine: machine,
          machineSt: tempTotalMT,
          detail: tempMcReportDetails
        }

        console.log(tempMcMachine);
        tempMcMachines.push(tempMcMachine);
        
      })

      tempMcDailyReport = {
        userId: user.userId,
        userName: user.userName,
        date: user.date,
        totalSt: tempTotalSt,
        detail: tempMcMachines
      }

      console.log(tempMcDailyReport);
      tempMcDailyReports.push(tempMcDailyReport);
    })

    console.log(tempMcDailyReports);
    // // NOTE get machine list
    // users.forEach( function (id){
    //   let machines = [];
    //   reports.forEach( function (report){
    //     if(machines.includes(report['machine'])){
    //       console.log('skip machine');
    //     }
    //     else{
    //       machines.push(report['machine']);
    //     }
    //   })

    //   // NOTE get detail list
    //   machines.forEach( function(machine){
    //     reports.forEach( function (report){

    //       if(report['machine']==machine){
    
    //         tempMcReportDetail = {
    //           id          : report['id'],
    //           reportType  : report['reportType'],
    //           customerCode: report['customerCode'],
    //           material    : report['material'],
    //           productCode : report['productCode'],
    //           amount      : report['amount'],
    //           passFail    : report['passFail'],
    //           failAmount  : report['failAmount'],
    //           failReason  : report['failReason'],
    //           mt          : report['mt'],
    //           st          : report['st'],
    //           cmt         : report['cmt'],
    //           checked     : report['checked']
    //         }
    
    //         tempMcReportDetails.push(tempMcReportDetail);
    
    //       }
    //     })
    //   })
    // })

    // // Accepts the array and key
    // const groupBy = (array, key) => {
    //   // Return the end result
    //   return array.reduce((result, currentValue) => {
    //     // If an array already present for key, push it to the array. Else create an array and push the object
    //     (result[currentValue[key]] = result[currentValue[key]] || []).push(
    //       currentValue
    //     );
    //     // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
    //     return result;
    //   }, {}); // empty object is the initial value for result object
    // };

    // const reportsGroupedByUser = groupBy(reports, 'userId');
    // console.log(reportsGroupedByUser)

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
