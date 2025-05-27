import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeRetourManagmentComponent } from './demande-retour-managment.component';

describe('DemandeRetourManagmentComponent', () => {
  let component: DemandeRetourManagmentComponent;
  let fixture: ComponentFixture<DemandeRetourManagmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DemandeRetourManagmentComponent]
    });
    fixture = TestBed.createComponent(DemandeRetourManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
