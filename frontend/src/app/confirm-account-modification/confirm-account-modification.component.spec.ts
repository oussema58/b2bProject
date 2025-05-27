import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmAccountModificationComponent } from './confirm-account-modification.component';

describe('ConfirmAccountModificationComponent', () => {
  let component: ConfirmAccountModificationComponent;
  let fixture: ComponentFixture<ConfirmAccountModificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmAccountModificationComponent]
    });
    fixture = TestBed.createComponent(ConfirmAccountModificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
