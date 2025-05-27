import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDashboardSocieteComponent } from './user-dashboard-societe.component';

describe('UserDashboardSocieteComponent', () => {
  let component: UserDashboardSocieteComponent;
  let fixture: ComponentFixture<UserDashboardSocieteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserDashboardSocieteComponent]
    });
    fixture = TestBed.createComponent(UserDashboardSocieteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
