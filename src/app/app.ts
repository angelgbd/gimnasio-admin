import { Component, computed, signal } from '@angular/core';
import { CLASES_LOCALES } from '../datos/clases-locales';
import type { Clase } from '../modelos/clase';
import { TarjetaClase } from './tarjeta-clase/tarjeta-clase';

@Component({
  selector: 'app-root',
  imports: [TarjetaClase],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly catalogoCompleto = CLASES_LOCALES;
  readonly clases = signal<Clase[]>([...CLASES_LOCALES]);

  readonly totalClases = computed(() => this.clases().length);
  readonly minutosSemanales = computed(() =>
    this.clases().reduce((total, clase) => total + clase.duracionMin, 0),
  );
  readonly clasesLargas = computed(
    () => this.clases().filter((clase) => clase.duracionMin >= 60).length,
  );

  vaciarCatalogo(): void {
    this.clases.set([]);
  }

  restaurarCatalogo(): void {
    this.clases.set([...CLASES_LOCALES]);
  }
}
