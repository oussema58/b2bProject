import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSocieteConfirmationComponent } from './update-societe-confirmation.component';

describe('UpdateSocieteConfirmationComponent', () => {
  let component: UpdateSocieteConfirmationComponent;
  let fixture: ComponentFixture<UpdateSocieteConfirmationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateSocieteConfirmationComponent]
    });
    fixture = TestBed.createComponent(UpdateSocieteConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
