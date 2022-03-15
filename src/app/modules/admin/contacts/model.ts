export interface McReport {
    id?:number;
    userId?: number;
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
    userId?: number;
    userName?:string;
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