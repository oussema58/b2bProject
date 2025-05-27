import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeRetourDetailsComponent } from './demande-retour-details.component';

describe('DemandeRetourDetailsComponent', () => {
  let component: DemandeRetourDetailsComponent;
  let fixture: ComponentFixture<DemandeRetourDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DemandeRetourDetailsComponent]
    });
    fixture = TestBed.createComponent(DemandeRetourDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
