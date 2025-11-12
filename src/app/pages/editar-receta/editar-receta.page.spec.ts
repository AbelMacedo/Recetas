import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditarRecetaPage } from './editar-receta.page';

describe('EditarRecetaPage', () => {
  let component: EditarRecetaPage;
  let fixture: ComponentFixture<EditarRecetaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarRecetaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
