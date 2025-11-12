import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearRecetaPage } from './crear-receta.page';

describe('CrearRecetaPage', () => {
  let component: CrearRecetaPage;
  let fixture: ComponentFixture<CrearRecetaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearRecetaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
