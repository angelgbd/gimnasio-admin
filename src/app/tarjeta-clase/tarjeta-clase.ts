import { Component, input, output } from '@angular/core';
import type { Clase } from '../../modelos/clase';

@Component({
  selector: 'app-tarjeta-clase',
  styleUrl: './tarjeta-clase.css',
  templateUrl: './tarjeta-clase.html',
})
export class TarjetaClase {
  readonly clase = input.required<Clase>();
  readonly activa = input(false);
  readonly seleccionada = output<Clase>();

  seleccionar(): void {
    this.seleccionada.emit(this.clase());
  }
}
