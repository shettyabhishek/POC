import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseDetailsComponentComponent } from './components/case-details-component/case-details-component.component';

@NgModule({
  imports: [
      CommonModule
  ],
  declarations: [CaseDetailsComponentComponent],
  exports: [CaseDetailsComponentComponent]
})
export class HomeModule { }
