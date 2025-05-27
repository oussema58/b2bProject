import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarifUpdateComponent } from './tarif-update.component';

describe('TarifUpdateComponent', () => {
  let component: TarifUpdateComponent;
  let fixture: ComponentFixture<TarifUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TarifUpdateComponent]
    });
    fixture = TestBed.createComponent(TarifUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
