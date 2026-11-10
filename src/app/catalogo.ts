import { computed, Service, signal } from '@angular/core';
import { CLASES_LOCALES } from '../datos/clases-locales';
import type { Categoria, Clase } from '../modelos/clase';

@Service()
export class Catalogo {
  readonly catalogoCompleto = CLASES_LOCALES;
  readonly clases = signal<Clase[]>([...CLASES_LOCALES]);
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

  vaciarCatalogo(): void {
    this.clases.set([]);
    this.claseSeleccionada.set(null);
  }

  restaurarCatalogo(): void {
    this.clases.set([...CLASES_LOCALES]);
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
