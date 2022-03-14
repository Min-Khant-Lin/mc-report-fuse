export interface McReport {
    id?:number;
    employeeName?: string;
    date?: Date;
    machine?: string;
    isProduction:boolean;
    customerCode?:string;
    material?:string;
    productCode?:string;
    amount?: number;
    passFail?: boolean;
    failAmount?: number;
    failReason?:string;
    mt?: number;
    st?: number;
    cmt?: string;
}

export interface McDailyReport {
    employeeName?:string;
    date?:Date;
    totalSt: number;
    detail:McReportDetail[];
}

export interface McReportDetail{
    machine?: string;
    isProduction?:boolean;
    customerCode?:string;
    material?:string;
    productCode?:string;
    amount?: number;
    passFail?: boolean;
    failAmount?: number;
    failReason?:string;
    mt?: number;
    st?: number;
    cmt?: string;
}