import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnautherizedComponent } from './unautherized.component';

describe('UnautherizedComponent', () => {
  let component: UnautherizedComponent;
  let fixture: ComponentFixture<UnautherizedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UnautherizedComponent]
    });
    fixture = TestBed.createComponent(UnautherizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
