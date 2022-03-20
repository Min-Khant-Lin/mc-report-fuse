export interface McReport {
    id:number;
    userId: number;
    userName: string;
    date: Date;
    machine: string;
    isProduction:boolean;
    customerCode:string;
    material:string;
    productCode:string;
    amount: number;
    passFail: boolean;
    failAmount: number;
    failReason:string;
    mt: number;
    st: number;
    cmt: string;
    checked:string;
}

export interface McDailyReport {
    userId: number;
    userName:string;
    date:Date;
    totalSt: number;
    detail:McReport[];
}

export interface McReport{
    machine: string;
    machineSt: number;
    detail: McReportDetail[];
}

export interface McReportDetail{
    isProduction:boolean;
    customerCode:string;
    material:string;
    productCode:string;
    amount: number;
    passFail: boolean;
    failAmount: number;
    failReason:string;
    mt: number;
    st: number;
    cmt: string;
    checked: boolean;
    id: number;
}