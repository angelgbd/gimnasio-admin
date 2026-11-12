import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { API_URL } from '../../../config';
import type { Clase } from '../../../modelos/clase';
import { mensajeDeApi } from '../../../servicios/errores';
import { Catalogo } from '../../catalogo';
import { FiltroCategoria } from '../../filtro-categoria/filtro-categoria';
import { TarjetaClase } from '../../tarjeta-clase/tarjeta-clase';

@Component({
  imports: [FiltroCategoria, RouterLink, TarjetaClase],
  selector: 'app-lista-clases',
  styleUrl: './lista-clases.css',
  templateUrl: './lista-clases.html',
})
export class ListaClases {
  readonly catalogo = inject(Catalogo);
  readonly mensajeDeApi = mensajeDeApi;

  imagenUrl(clase: Clase): string {
    return clase.imagen.startsWith('http') ? clase.imagen : `${API_URL}${clase.imagen}`;
  }
}
