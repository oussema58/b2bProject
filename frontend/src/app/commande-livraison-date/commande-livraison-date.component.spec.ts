import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandeLivraisonDateComponent } from './commande-livraison-date.component';

describe('CommandeLivraisonDateComponent', () => {
  let component: CommandeLivraisonDateComponent;
  let fixture: ComponentFixture<CommandeLivraisonDateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommandeLivraisonDateComponent]
    });
    fixture = TestBed.createComponent(CommandeLivraisonDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
