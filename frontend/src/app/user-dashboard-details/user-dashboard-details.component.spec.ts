import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDashboardDetailsComponent } from './user-dashboard-details.component';

describe('UserDashboardDetailsComponent', () => {
  let component: UserDashboardDetailsComponent;
  let fixture: ComponentFixture<UserDashboardDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserDashboardDetailsComponent]
    });
    fixture = TestBed.createComponent(UserDashboardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
