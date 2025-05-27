import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeRetourAddComponent } from './demande-retour-add.component';

describe('DemandeRetourAddComponent', () => {
  let component: DemandeRetourAddComponent;
  let fixture: ComponentFixture<DemandeRetourAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DemandeRetourAddComponent]
    });
    fixture = TestBed.createComponent(DemandeRetourAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
