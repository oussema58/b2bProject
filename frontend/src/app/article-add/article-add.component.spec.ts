import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleAddComponent } from './article-add.component';

describe('ArticleAddComponent', () => {
  let component: ArticleAddComponent;
  let fixture: ComponentFixture<ArticleAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArticleAddComponent]
    });
    fixture = TestBed.createComponent(ArticleAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
