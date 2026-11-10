import { Component, inject } from '@angular/core';
import { Catalogo } from './catalogo';
import { FiltroCategoria } from './filtro-categoria/filtro-categoria';
import { TarjetaClase } from './tarjeta-clase/tarjeta-clase';

@Component({
  selector: 'app-root',
  imports: [FiltroCategoria, TarjetaClase],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly catalogo = inject(Catalogo);
}
