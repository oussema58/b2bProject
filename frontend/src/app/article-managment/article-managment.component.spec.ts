import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleManagmentComponent } from './article-managment.component';

describe('ArticleManagmentComponent', () => {
  let component: ArticleManagmentComponent;
  let fixture: ComponentFixture<ArticleManagmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArticleManagmentComponent]
    });
    fixture = TestBed.createComponent(ArticleManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
