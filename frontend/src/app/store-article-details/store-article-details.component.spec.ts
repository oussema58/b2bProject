import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreArticleDetailsComponent } from './store-article-details.component';

describe('StoreArticleDetailsComponent', () => {
  let component: StoreArticleDetailsComponent;
  let fixture: ComponentFixture<StoreArticleDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StoreArticleDetailsComponent]
    });
    fixture = TestBed.createComponent(StoreArticleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
