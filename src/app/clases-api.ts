import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { API_URL } from '../config';
import type { Clase, ClaseConHorarios, ClaseNueva, Sobre } from '../modelos/clase';

@Service()
export class ClasesApi {
  private readonly http = inject(HttpClient);

  buscarPorNombre(q: string) {
    const params = new HttpParams().set('q', q);
    return this.http.get<Sobre<Clase[]>>(`${API_URL}/clases`, { params });
  }

  crear(clase: ClaseNueva) {
    return this.http.post<Sobre<Clase>>(`${API_URL}/clases`, clase);
  }

  obtener(id: number) {
    return this.http.get<Sobre<ClaseConHorarios>>(`${API_URL}/clases/${id}`);
  }

  actualizar(id: number, cambios: ClaseNueva) {
    return this.http.patch<Sobre<Clase>>(`${API_URL}/clases/${id}`, cambios);
  }

  eliminar(id: number) {
    return this.http.delete<Sobre<Clase>>(`${API_URL}/clases/${id}`);
  }
}
