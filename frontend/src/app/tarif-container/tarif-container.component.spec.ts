import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarifContainerComponent } from './tarif-container.component';

describe('TarifContainerComponent', () => {
  let component: TarifContainerComponent;
  let fixture: ComponentFixture<TarifContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TarifContainerComponent]
    });
    fixture = TestBed.createComponent(TarifContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
