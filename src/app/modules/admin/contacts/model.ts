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

export interface McReportInfo{
    date?: Date;
    employeeName?: string;
    totalWorkingTime?: number;
    info:MachineAndSt[]
}

export interface MachineAndSt{
    machine:string;
    st: string;
}

export interface McReportPagination {
    count: number;
    page: number;
    page_size: number;
}