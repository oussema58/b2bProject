import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyManagmentComponent } from './family-managment.component';

describe('FamilyManagmentComponent', () => {
  let component: FamilyManagmentComponent;
  let fixture: ComponentFixture<FamilyManagmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FamilyManagmentComponent]
    });
    fixture = TestBed.createComponent(FamilyManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
