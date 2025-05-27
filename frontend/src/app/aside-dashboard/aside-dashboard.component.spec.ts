import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsideDashboardComponent } from './aside-dashboard.component';

describe('AsideDashboardComponent', () => {
  let component: AsideDashboardComponent;
  let fixture: ComponentFixture<AsideDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AsideDashboardComponent]
    });
    fixture = TestBed.createComponent(AsideDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
