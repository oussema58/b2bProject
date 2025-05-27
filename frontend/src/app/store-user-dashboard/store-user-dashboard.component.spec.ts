import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreUserDashboardComponent } from './store-user-dashboard.component';

describe('StoreUserDashboardComponent', () => {
  let component: StoreUserDashboardComponent;
  let fixture: ComponentFixture<StoreUserDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StoreUserDashboardComponent]
    });
    fixture = TestBed.createComponent(StoreUserDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
