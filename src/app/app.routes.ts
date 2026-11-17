import { Routes } from '@angular/router';
import { Panel } from './paginas/panel/panel';
import { confirmarSalidaConCambios } from './paginas/formulario-clase/confirmar-salida.guard';
import { Horarios } from './paginas/horarios/horarios';
import { ListaClases } from './paginas/lista-clases/lista-clases';
import { Miembros } from './paginas/miembros/miembros';
import { soloAdmin } from './sesion/solo-admin';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./paginas/login/login').then((modulo) => modulo.Login),
  },
  {
    path: '',
    component: Panel,
    canActivate: [soloAdmin],
    canActivateChild: [soloAdmin],
    children: [
      {
        path: 'clases/nueva',
        loadComponent: () =>
          import('./paginas/formulario-clase/formulario-clase').then(
            (modulo) => modulo.FormularioClase,
          ),
        canDeactivate: [confirmarSalidaConCambios],
      },
      {
        path: 'clases/:id/editar',
        loadComponent: () =>
          import('./paginas/formulario-clase/formulario-clase').then(
            (modulo) => modulo.FormularioClase,
          ),
        canDeactivate: [confirmarSalidaConCambios],
      },
      { path: 'clases', component: ListaClases },
      { path: 'horarios', component: Horarios },
      { path: 'miembros', component: Miembros },
      { path: '', redirectTo: 'clases', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'clases' },
];
