import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TradicionalesPage } from './tradicionales.page';

describe('TradicionalesPage', () => {
  let component: TradicionalesPage;
  let fixture: ComponentFixture<TradicionalesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TradicionalesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
