import { type CanDeactivateFn } from '@angular/router';
import { FormularioClase } from './formulario-clase';

export const confirmarSalidaConCambios: CanDeactivateFn<FormularioClase> = (componente) =>
  componente.puedeSalir();
