import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotifManagmentComponent } from './motif-managment.component';

describe('MotifManagmentComponent', () => {
  let component: MotifManagmentComponent;
  let fixture: ComponentFixture<MotifManagmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MotifManagmentComponent]
    });
    fixture = TestBed.createComponent(MotifManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
