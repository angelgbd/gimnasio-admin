import { httpResource } from '@angular/common/http';
import { computed, Service, signal } from '@angular/core';
import { API_URL } from '../config';
import type { Categoria, Clase, Sobre } from '../modelos/clase';

@Service()
export class Catalogo {
  readonly recursoClases = httpResource<Sobre<Clase[]>>(() => `${API_URL}/clases`);
  readonly clases = computed(() =>
    this.recursoClases.hasValue() ? this.recursoClases.value().data : [],
  );
  readonly categoriaSeleccionada = signal<Categoria | null>(null);
  readonly claseSeleccionada = signal<Clase | null>(null);

  readonly clasesVisibles = computed(() => {
    const categoria = this.categoriaSeleccionada();
    return categoria === null
      ? this.clases()
      : this.clases().filter((clase) => clase.categoria === categoria);
  });

  readonly totalClasesVisibles = computed(() => this.clasesVisibles().length);
  readonly minutosTotales = computed(() =>
    this.clasesVisibles().reduce((total, clase) => total + clase.duracionMin, 0),
  );
  readonly clasesLargas = computed(
    () => this.clasesVisibles().filter((clase) => clase.duracionMin >= 60).length,
  );

  seleccionarCategoria(categoria: Categoria | null): void {
    this.categoriaSeleccionada.set(categoria);
    this.soltarSeleccionSiNoEsVisible();
  }

  seleccionarClase(clase: Clase | null): void {
    this.claseSeleccionada.set(clase);
  }

  private soltarSeleccionSiNoEsVisible(): void {
    const seleccionada = this.claseSeleccionada();
    if (
      seleccionada !== null &&
      !this.clasesVisibles().some((clase) => clase.id === seleccionada.id)
    ) {
      this.claseSeleccionada.set(null);
    }
  }
}
