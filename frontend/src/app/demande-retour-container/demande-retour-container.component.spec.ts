import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeRetourContainerComponent } from './demande-retour-container.component';

describe('DemandeRetourContainerComponent', () => {
  let component: DemandeRetourContainerComponent;
  let fixture: ComponentFixture<DemandeRetourContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DemandeRetourContainerComponent]
    });
    fixture = TestBed.createComponent(DemandeRetourContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
