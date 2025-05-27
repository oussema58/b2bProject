import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreNavbarBackupComponent } from './store-navbar-backup.component';

describe('StoreNavbarBackupComponent', () => {
  let component: StoreNavbarBackupComponent;
  let fixture: ComponentFixture<StoreNavbarBackupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StoreNavbarBackupComponent]
    });
    fixture = TestBed.createComponent(StoreNavbarBackupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
