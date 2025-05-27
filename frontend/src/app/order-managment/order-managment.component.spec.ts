import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderManagmentComponent } from './order-managment.component';

describe('OrderManagmentComponent', () => {
  let component: OrderManagmentComponent;
  let fixture: ComponentFixture<OrderManagmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderManagmentComponent]
    });
    fixture = TestBed.createComponent(OrderManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
