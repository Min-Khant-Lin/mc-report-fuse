import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { McReport, McReportInfo } from './model';

const baseUrl = 'http://localhost:3000';

@Injectable({
  providedIn: 'root',
})
export class McReportService {

  constructor(private http: HttpClient) {}

  postReport(data: McReport) {
    return this.http.post<McReport>(baseUrl + '/reports/', data);
  }

  getReport(id: number) {
    return this.http.get<McReport>(baseUrl + '/reports/' + id);
  }

  putReport(id: number, data: McReport){
    return this.http.put<McReport>(baseUrl+ '/reports/' +id,data);
  }
  
  deleteReport(id: number) {
    return this.http.delete<McReport>(baseUrl + '/reports/' + id);
  }

  getAllReport() {
    return this.http.get<McReport[]>(baseUrl + '/reports');
  }

  getReportInfo(){
    return this.http.get<McReportInfo[]>(baseUrl + '/reportList')
  }

}
