import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientContainerComponent } from './client-container.component';

describe('ClientContainerComponent', () => {
  let component: ClientContainerComponent;
  let fixture: ComponentFixture<ClientContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientContainerComponent]
    });
    fixture = TestBed.createComponent(ClientContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
