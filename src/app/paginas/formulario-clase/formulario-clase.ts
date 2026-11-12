import { JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CATEGORIAS, type Categoria, type ClaseNueva } from '../../../modelos/clase';

export const multiploDeCincoValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  if (control.value === null || control.value === '') return null;
  const duracion = Number(control.value);
  return Number.isInteger(duracion) && duracion % 5 === 0 ? null : { multiploDeCinco: true };
};

@Component({
  imports: [JsonPipe, ReactiveFormsModule, RouterLink],
  selector: 'app-formulario-clase',
  styleUrl: './formulario-clase.css',
  templateUrl: './formulario-clase.html',
})
export class FormularioClase {
  private readonly fb = inject(FormBuilder);
  readonly categorias = CATEGORIAS;
  readonly resultado = signal<ClaseNueva | null>(null);

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

  guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.resultado.set(null);
      return;
    }

    const valores = this.formulario.getRawValue();
    this.resultado.set({
      ...valores,
      categoria: valores.categoria as Categoria,
      duracionMin: Number(valores.duracionMin),
    });
  }
}
