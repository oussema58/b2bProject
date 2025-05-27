import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientManagmentComponent } from './client-managment.component';

describe('ClientManagmentComponent', () => {
  let component: ClientManagmentComponent;
  let fixture: ComponentFixture<ClientManagmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientManagmentComponent]
    });
    fixture = TestBed.createComponent(ClientManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
