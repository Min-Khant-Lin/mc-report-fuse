import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnChanges, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { filter, fromEvent, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import { CSVRecord } from '../model';

@Component({
    selector: 'a7-slip',
    templateUrl: './a7.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateA7SlipComponent implements OnInit, AfterViewInit {
    @ViewChild('csvReader') csvReader: any;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    records: CSVRecord[] = [];
    displayedColumns: string[] = [
        'instruction', 
        'productCode', 
        'orderNo',
        'quantity',
        'unitPrice',
    ];

    dataSource: MatTableDataSource<any>;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef
        ) 
        {
            this.dataSource = new MatTableDataSource();
        }

    ngOnInit(): void {
        // Mark for check
        this._changeDetectorRef.markForCheck();
    }
    
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
    }

    uploadListener($event: any) {
        // let text = [];
        let files = $event.srcElement.files;

        if (this.isValidCSVFile(files[0])) {
            let input = $event.target;
            let reader = new FileReader();
            reader.readAsText(input.files[0], 'Shift-JIS');

            reader.onload = () => {
                let csvData = reader.result;
                let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);
                let headersRow = this.getHeaderArray(csvRecordsArray);

                this.records = this.getDataRecordsArrayFromCSVFile(
                    csvRecordsArray,
                    headersRow.length
                );
                console.log(this.records);
                this.dataSource = new MatTableDataSource(this.records);
                
                // Mark for check
                this._changeDetectorRef.markForCheck();
            };

            reader.onerror = function () {
                console.log('error is occured while reading file!');
            };
        } else {
            alert('Please import valid .csv file.');
            this.fileReset();
        }
    }

    getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
        let csvArr = [];

        for (let i = 1; i < csvRecordsArray.length; i++) {
            let currentRecord = (<string>csvRecordsArray[i]).split(',');
            if (currentRecord.length == headerLength) {
                let csvRecord: CSVRecord = new CSVRecord();
                csvRecord.instruction = currentRecord[0].trim();
                csvRecord.productCode = currentRecord[1].trim();
                csvRecord.productName = currentRecord[2].trim();
                csvRecord.orderNo = currentRecord[3].trim();
                csvRecord.quantity = currentRecord[4].trim();
                csvRecord.unitPrice = currentRecord[5].trim();
                csvRecord.userCode = currentRecord[7].trim();
                csvRecord.unitWeight = currentRecord[17].trim();
                csvRecord.totalWeight = currentRecord[18].trim();
                csvArr.push(csvRecord);
            }
        }
        return csvArr;
    }

    isValidCSVFile(file: any) {
        return file.name.endsWith('.csv');
    }

    getHeaderArray(csvRecordsArr: any) {
        let headers = (<string>csvRecordsArr[0]).split(',');
        let headerArray = [];
        for (let j = 0; j < headers.length; j++) {
            headerArray.push(headers[j]);
        }
        return headerArray;
    }

    fileReset() {
        this.csvReader.nativeElement.value = '';
        this.records = [];
    }
}   