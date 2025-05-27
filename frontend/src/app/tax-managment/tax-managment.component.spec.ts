import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxManagmentComponent } from './tax-managment.component';

describe('TaxManagmentComponent', () => {
  let component: TaxManagmentComponent;
  let fixture: ComponentFixture<TaxManagmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaxManagmentComponent]
    });
    fixture = TestBed.createComponent(TaxManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
