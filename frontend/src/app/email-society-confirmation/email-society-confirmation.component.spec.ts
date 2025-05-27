import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailSocietyConfirmationComponent } from './email-society-confirmation.component';

describe('EmailSocietyConfirmationComponent', () => {
  let component: EmailSocietyConfirmationComponent;
  let fixture: ComponentFixture<EmailSocietyConfirmationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmailSocietyConfirmationComponent]
    });
    fixture = TestBed.createComponent(EmailSocietyConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
