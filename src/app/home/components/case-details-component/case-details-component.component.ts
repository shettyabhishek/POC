import { Component, OnInit, Input, Output } from '@angular/core';

//importing the model 
import { Case } from '../../../model/case';
import { EventEmitter } from '@angular/core';

@Component({
    selector: 'case-details-component',
    templateUrl: './case-details-component.component.html',
    styleUrls: ['./case-details-component.component.scss']
})
export class CaseDetailsComponentComponent implements OnInit {
    @Input() caseDetails:Case;
    @Output('closeOnCancel') clsCnclEvt= new EventEmitter();
    constructor() { }
    ngOnInit() {}

    //Event to close the details panel 
    closeCaseDetailsPanel(evt){
        this.clsCnclEvt.emit("Some message for testing");
    }
}
