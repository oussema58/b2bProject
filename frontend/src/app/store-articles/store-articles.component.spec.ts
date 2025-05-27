import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreArticlesComponent } from './store-articles.component';

describe('StoreArticlesComponent', () => {
  let component: StoreArticlesComponent;
  let fixture: ComponentFixture<StoreArticlesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StoreArticlesComponent]
    });
    fixture = TestBed.createComponent(StoreArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
