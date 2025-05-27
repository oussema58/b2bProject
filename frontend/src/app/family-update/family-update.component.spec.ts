import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyUpdateComponent } from './family-update.component';

describe('FamilyUpdateComponent', () => {
  let component: FamilyUpdateComponent;
  let fixture: ComponentFixture<FamilyUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FamilyUpdateComponent]
    });
    fixture = TestBed.createComponent(FamilyUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
