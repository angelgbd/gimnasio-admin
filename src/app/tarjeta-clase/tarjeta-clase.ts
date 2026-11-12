import { Component, computed, input, output } from '@angular/core';
import { API_URL } from '../../config';
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
  readonly imagenUrl = computed(() => {
    const imagen = this.clase().imagen;
    return imagen.startsWith('http') ? imagen : `${API_URL}${imagen}`;
  });

  seleccionar(): void {
    this.seleccionada.emit(this.clase());
  }
}
