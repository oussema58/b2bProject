import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarifAddComponent } from './tarif-add.component';

describe('TarifAddComponent', () => {
  let component: TarifAddComponent;
  let fixture: ComponentFixture<TarifAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TarifAddComponent]
    });
    fixture = TestBed.createComponent(TarifAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
