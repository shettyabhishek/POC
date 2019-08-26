import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseDetailsComponentComponent } from './case-details-component.component';

describe('CaseDetailsComponentComponent', () => {
  let component: CaseDetailsComponentComponent;
  let fixture: ComponentFixture<CaseDetailsComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaseDetailsComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseDetailsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
