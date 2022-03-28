export class CSVRecord {
    public instruction: any;
    public productCode: any;
    public productName: any;
    public orderNo: any;
    public orderAmount: any;
    public unitPrice: any;
    public userCode: any;
    public unitWeight: any;
    public totalWeight: any;
}


export interface ChildInfo {
    productCode: any;
    modelName: any;
    material: any;
    dimension: any;
    weight: any;
    qtyPerUnit: any;
}