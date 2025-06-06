import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleContainerComponent } from './article-container.component';

describe('ArticleContainerComponent', () => {
  let component: ArticleContainerComponent;
  let fixture: ComponentFixture<ArticleContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArticleContainerComponent]
    });
    fixture = TestBed.createComponent(ArticleContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
