import { Component,OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import { map } from 'rxjs/operators';
import { ColDef } from 'ag-grid-community';

import { Case } from './model/case';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
    rowData: Case[] = [];
    columnDefs: ColDef[];
    caseDetailsObj: any = {};

    public rowSelection;
    private gridApi;
    constructor(public apiService: ApiService) {
        this.columnDefs = [
            {headerName: 'Case Number', field: 'caseId', width: 200},
            {headerName: 'Case Details', field: 'caseDescription', width: 845}
        ];
        this.rowSelection = "single";
    }
    allCases:Case[] = [];
    title = 'Case Management';
    headerHeight: 30;
    onLoad:boolean = true;

    //component initialization method
    ngOnInit(){
        let allRows = this.apiService.getAllCases().subscribe((res) => {
            this.rowData = res.cases;
        })
    }

    //On grid ready calling a custom function
    onGridReady(params) {
        this.gridApi = params.api;
    }    

    //Grid row selection function
    onSelectionChanged(evt){
        var selectedRows = this.gridApi.getSelectedRows();
        this.onLoad = false;
        this.columnDefs = [
            {headerName: 'Case Number', field: 'caseId', width: 135},
            {headerName: 'Case Details', field: 'caseDescription', width: 313}
        ];
        this.caseDetailsObj = selectedRows[0];
    }

    //close details view 
    closeCaseDetailsPanel(evt){
        this.onLoad = true;
        this.columnDefs = [
            {headerName: 'Case Number', field: 'caseId', width: 200},
            {headerName: 'Case Details', field: 'caseDescription', width: 845}
        ];
        this.gridApi.setRowData(this.rowData);
    }
}
