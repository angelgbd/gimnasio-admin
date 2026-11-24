import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { API_URL } from '../../../config';
import type { Clase } from '../../../modelos/clase';
import { mensajeDeApi } from '../../../servicios/errores';
import { Catalogo } from '../../catalogo';
import { FiltroCategoria } from '../../filtro-categoria/filtro-categoria';
import { TarjetaClase } from '../../tarjeta-clase/tarjeta-clase';

@Component({
  imports: [FiltroCategoria, ReactiveFormsModule, RouterLink, TarjetaClase],
  selector: 'app-lista-clases',
  styleUrl: './lista-clases.css',
  templateUrl: './lista-clases.html',
})
export class ListaClases {
  readonly catalogo = inject(Catalogo);
  readonly mensajeDeApi = mensajeDeApi;
  readonly busqueda = new FormControl('', { nonNullable: true });
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.busqueda.valueChanges
      .pipe(
        debounceTime(350),
        map((texto) => texto.trim()),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((texto) => this.catalogo.buscar(texto));
  }

  imagenUrl(clase: Clase): string {
    return clase.imagen.startsWith('http') ? clase.imagen : `${API_URL}${clase.imagen}`;
  }
}
