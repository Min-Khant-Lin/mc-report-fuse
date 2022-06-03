export interface McReport {
    id:number;
    userId: number;
    userName: string;
    date: Date;
    machine: string;
    reportType:number;
    customerCode:string;
    material:string;
    productCode:string;
    amount: number;
    fail: boolean;
    failAmount: number;
    failReason:string;
    mt: number;
    st: number;
    cmt: string;
    checked:boolean;
}

export interface McDailyReport {
    userId: number;
    userName:string;
    date:Date;
    totalSt: number;
    checked: boolean;
    machines:McMachine[];
}

export interface McMachine{
    machine: string;
    machineSt: number;
    reports: McReport[];
}

// export interface McReportDetail{
//     id: number;
//     reportType:number;
//     customerCode:string;
//     material:string;
//     productCode:string;
//     amount: number;
//     passFail: boolean;
//     failAmount: number;
//     failReason:string;
//     mt: number;
//     st: number;
//     cmt: string;
//     checked: any;
// }