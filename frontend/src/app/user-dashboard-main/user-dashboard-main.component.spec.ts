import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDashboardMainComponent } from './user-dashboard-main.component';

describe('UserDashboardMainComponent', () => {
  let component: UserDashboardMainComponent;
  let fixture: ComponentFixture<UserDashboardMainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserDashboardMainComponent]
    });
    fixture = TestBed.createComponent(UserDashboardMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
