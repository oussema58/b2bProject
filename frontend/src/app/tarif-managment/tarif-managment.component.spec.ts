import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarifManagmentComponent } from './tarif-managment.component';

describe('TarifManagmentComponent', () => {
  let component: TarifManagmentComponent;
  let fixture: ComponentFixture<TarifManagmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TarifManagmentComponent]
    });
    fixture = TestBed.createComponent(TarifManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
