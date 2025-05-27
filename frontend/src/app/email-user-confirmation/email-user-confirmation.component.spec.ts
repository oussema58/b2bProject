import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailUserConfirmationComponent } from './email-user-confirmation.component';

describe('EmailUserConfirmationComponent', () => {
  let component: EmailUserConfirmationComponent;
  let fixture: ComponentFixture<EmailUserConfirmationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmailUserConfirmationComponent]
    });
    fixture = TestBed.createComponent(EmailUserConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
