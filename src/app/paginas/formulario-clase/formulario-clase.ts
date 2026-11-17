import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, DestroyRef, effect, inject, input, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { type Categoria, type ClaseNueva } from '../../../modelos/clase';
import { mensajeDeApi, mensajesDelCuerpo } from '../../../servicios/errores';
import { Catalogo } from '../../catalogo';
import { ClasesApi } from '../../clases-api';
import { CATEGORIAS } from '../../../modelos/clase';

export const multiploDeCincoValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  if (control.value === null || control.value === '') return null;
  const duracion = Number(control.value);
  return Number.isInteger(duracion) && duracion % 5 === 0 ? null : { multiploDeCinco: true };
};

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-formulario-clase',
  styleUrl: './formulario-clase.css',
  templateUrl: './formulario-clase.html',
})
export class FormularioClase {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ClasesApi);
  private readonly catalogo = inject(Catalogo);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly id = input<string | undefined>();
  readonly editando = computed(() => this.id() !== undefined);
  readonly categorias = CATEGORIAS;
  readonly cargando = signal(false);
  readonly guardando = signal(false);
  readonly erroresServidor = signal<string[]>([]);
  readonly problema = signal<string | null>(null);

  readonly formulario = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(80)]],
    categoria: ['', Validators.required],
    descripcion: ['', [Validators.required, Validators.maxLength(255)]],
    duracionMin: [45, [Validators.required, Validators.min(10), multiploDeCincoValidator]],
    imagen: [
      '/img/clase-01.jpg',
      [
        Validators.required,
        Validators.maxLength(120),
        Validators.pattern(/^(https?:\/\/\S+|\/img\/[\w.-]+)$/),
      ],
    ],
  });

  private readonly cargarEdicion = effect(() => {
    const id = this.id();
    if (id !== undefined) this.cargarClase(Number(id));
  });

  guardar(): void {
    if (this.formulario.invalid || this.cargando() || this.guardando()) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.limpiarErrores();
    this.guardando.set(true);
    const id = this.id();
    const datos = this.datosFormulario();
    const peticion = id === undefined ? this.api.crear(datos) : this.api.actualizar(Number(id), datos);

    peticion
      .pipe(finalize(() => this.guardando.set(false)), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.formulario.markAsPristine();
          this.catalogo.recargar();
          void this.router.navigate(['/clases']);
        },
        error: (error: unknown) => this.mostrarError(error),
      });
  }

  eliminar(): void {
    const id = this.id();
    if (id === undefined || this.guardando() || this.cargando()) return;
    const nombre = this.formulario.controls.nombre.value;
    if (!window.confirm(`¿Eliminar la clase «${nombre}»? Esta acción no se puede deshacer.`)) return;

    this.limpiarErrores();
    this.guardando.set(true);
    this.api
      .eliminar(Number(id))
      .pipe(finalize(() => this.guardando.set(false)), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.formulario.markAsPristine();
          this.catalogo.recargar();
          void this.router.navigate(['/clases']);
        },
        error: (error: unknown) => this.mostrarError(error),
      });
  }

  puedeSalir(): boolean {
    if (!this.formulario.dirty) return true;
    if (this.guardando() || this.cargando()) return false;
    return window.confirm('Hay cambios sin guardar. ¿Quieres salir de esta página?');
  }

  private cargarClase(id: number): void {
    if (!Number.isSafeInteger(id) || id < 1) {
      this.problema.set('El identificador de la clase no es válido.');
      return;
    }

    this.cargando.set(true);
    this.api
      .obtener(id)
      .pipe(finalize(() => this.cargando.set(false)), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ data }) => {
          this.formulario.patchValue({
            nombre: data.nombre,
            categoria: data.categoria,
            descripcion: data.descripcion,
            duracionMin: data.duracionMin,
            imagen: data.imagen,
          });
          this.formulario.markAsPristine();
          this.formulario.markAsUntouched();
          this.limpiarErrores();
        },
        error: (error: unknown) => this.mostrarError(error),
      });
  }

  private datosFormulario(): ClaseNueva {
    const valores = this.formulario.getRawValue();
    return {
      ...valores,
      categoria: valores.categoria as Categoria,
      duracionMin: Number(valores.duracionMin),
    };
  }

  private mostrarError(error: unknown): void {
    if (error instanceof HttpErrorResponse && error.status === 400) {
      const mensajes = mensajesDelCuerpo(error.error);
      this.erroresServidor.set(mensajes.length > 0 ? mensajes : [mensajeDeApi(error)]);
      return;
    }
    this.problema.set(mensajeDeApi(error));
  }

  private limpiarErrores(): void {
    this.erroresServidor.set([]);
    this.problema.set(null);
  }
}
