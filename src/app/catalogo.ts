import { computed, effect, inject, Service, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, map, of, startWith, switchMap } from 'rxjs';
import type { Categoria, Clase } from '../modelos/clase';
import { ClasesApi } from './clases-api';

interface EstadoCatalogo {
  clases: Clase[];
  cargando: boolean;
  error: unknown | null;
}

const ESTADO_INICIAL: EstadoCatalogo = { clases: [], cargando: true, error: null };

@Service()
export class Catalogo {
  private readonly clasesApi = inject(ClasesApi);
  private readonly termino$ = new BehaviorSubject('');

  private readonly estado$ = this.termino$.pipe(
    switchMap((q) =>
      this.clasesApi.buscarPorNombre(q).pipe(
        map(({ data }) => ({ clases: data, cargando: false, error: null }) satisfies EstadoCatalogo),
        catchError((error: unknown) => of({ clases: [], cargando: false, error })),
        startWith(ESTADO_INICIAL),
      ),
    ),
  );

  readonly estado = toSignal(this.estado$, { initialValue: ESTADO_INICIAL });
  readonly clases = computed(() => this.estado().clases);
  readonly cargando = computed(() => this.estado().cargando);
  readonly error = computed(() => this.estado().error);
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

  private readonly sincronizarSeleccion = effect(() => {
    if (!this.cargando() && this.error() === null) {
      this.soltarSeleccionSiNoEsVisible();
    }
  });

  buscar(q: string): void {
    this.termino$.next(q);
  }

  recargar(): void {
    this.termino$.next(this.termino$.value);
  }

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
