import { Component, inject } from '@angular/core';
import { CATEGORIAS, type Categoria } from '../../modelos/clase';
import { Catalogo } from '../catalogo';

@Component({
  imports: [],
  selector: 'app-filtro-categoria',
  styleUrl: './filtro-categoria.css',
  templateUrl: './filtro-categoria.html',
})
export class FiltroCategoria {
  readonly catalogo = inject(Catalogo);
  readonly categorias = CATEGORIAS;

  elegir(categoria: Categoria | null): void {
    this.catalogo.seleccionarCategoria(categoria);
  }
}
