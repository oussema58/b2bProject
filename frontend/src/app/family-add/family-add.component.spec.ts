import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyAddComponent } from './family-add.component';

describe('FamilyAddComponent', () => {
  let component: FamilyAddComponent;
  let fixture: ComponentFixture<FamilyAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FamilyAddComponent]
    });
    fixture = TestBed.createComponent(FamilyAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
