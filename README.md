# Gimnasio Admin — Práctica 22

Continuación de las Prácticas 19 a 21. El panel usa una sesión de administrador, agrega el token a las peticiones y guarda, edita y elimina clases con la API.

## Ejecutar

### API

En `gimnasio-backend`, instala dependencias, configura `.env` con la contraseña local de MySQL y ejecuta las migraciones, generación de Prisma y seed según [`gimnasio-backend/README.md`](gimnasio-backend/README.md). El seed crea estas cuentas:

- Administrador: `admin@itson.mx` / `gimnasio2026`
- Miembro: `karla@itson.mx` / `gimnasio2026`

Inicia la API con `npm run start:dev` en el puerto 3000.

### Frontend

Desde la raíz:

```bash
npm ci
npm start
```

Abre `http://localhost:4200` y entra con la cuenta de administrador. La cuenta de Karla sirve para comprobar que el panel rechaza miembros.

Si el puerto 4200 está ocupado, inicia con `npm start -- --port 4201` y agrega `FRONTEND_URL="http://localhost:4201"` al `.env` local del backend para CORS.

## Sesión y rutas

- `src/app/sesion/sesion.ts` guarda token y usuario como estado reactivo.
- `src/app/sesion/interceptores.ts` agrega `Authorization: Bearer …` a cada petición de `HttpClient`; una respuesta 401 cierra la sesión y redirige al login.
- `src/app/sesion/solo-admin.ts` protege el panel y sus rutas hijas. La API mantiene su propia autorización con `@Roles(Rol.admin)`.
- `src/app/app.routes.ts` deja `/login` fuera del panel. Las páginas de clases, horarios y miembros son rutas hijas protegidas. El formulario se carga con `loadComponent` en `/clases/nueva` y `/clases/:id/editar`.
- `src/app/app.html` sólo contiene el `router-outlet`; el marco y la navegación viven en el panel.

## Guardar y administrar clases

`ClasesApi` usa `HttpClient` para crear, obtener, actualizar y eliminar. El formulario único toma `id` de la URL: sin id manda `POST /clases`; con id carga los datos con `patchValue` y manda `PATCH /clases/:id`. Al terminar recarga el catálogo y vuelve a `/clases`. La eliminación pide confirmación.

Los validadores del navegador dan respuesta inmediata; si el backend responde 400, la página muestra los mensajes que llegaron en `message`. Mientras se guarda, se deshabilitan las acciones. `canDeactivate` pregunta antes de salir del formulario sucio; la navegación a login también pasa por esa guarda.

### Demostración de las validaciones del servidor

Para observar la validación del backend, quita temporalmente `Validators.required` del nombre y `Validators.min(10)` junto con `multiploDeCincoValidator` de la duración en `formulario-clase.ts`. Envía nombre vacío y duración `5`: deben aparecer los mensajes 400 del servidor. Después vuelve a poner los validadores antes de guardar los cambios finales.

Para demostrar el límite de autorización, cambia temporalmente `@Roles(Rol.admin)` por `@Publico()` en el método `crear()` de `gimnasio-backend/src/clases/clases.controller.ts`, crea una clase desde el formulario y vuelve a poner `@Roles(Rol.admin)`. Un `POST /clases` sin token debe responder 401. No dejes la ruta pública al terminar.

## Respuestas de la Práctica 22

- **Si el formulario ya valida, ¿por qué también valida el servidor?** El cliente se puede omitir o modificar: alguien puede llamar la API directamente, cambiar el navegador o enviar otra petición. El servidor es la frontera que protege los datos y debe validar aunque la interfaz ya lo haya hecho.
- **¿Por qué `httpResource` para leer y `HttpClient` para crear, editar y eliminar?** `httpResource` modela una lectura reactiva y expone valor, carga y error; no es para mutaciones. `HttpClient` permite iniciar cada POST, PATCH o DELETE por una acción concreta. ([Angular: `httpResource`](https://angular.dev/guide/http/http-resource))
- **¿Qué pasa si se olvida `subscribe()`?** El Observable de `HttpClient` es perezoso: sin suscripción no envía la petición ni ejecuta sus callbacks.
- **¿A qué piezas de React corresponden rutas hijas, interceptor y guardia?** Las rutas hijas se parecen a rutas anidadas con `<Outlet />`; el interceptor, a un interceptor de Axios o middleware de `fetch`; el guardia, a una ruta protegida que decide si renderiza o redirige.
- **¿Cuándo se ejecuta el guardia y por qué `salir()` debe navegar al login?** `canActivate` y `canActivateChild` corren durante la navegación, antes de activar la ruta. Borrar el token sólo cambia el estado de sesión: navegar a `/login` también cambia la ruta y evita que quede visible el panel.
- **¿Cómo decide el formulario entre POST y PATCH?** La ruta nueva no trae `id` y usa POST; la ruta de edición enlaza `:id` con el input del componente y usa PATCH.
- **¿Por qué no observar el estado del formulario con `computed()`?** `FormGroup.dirty` y los demás estados de Reactive Forms no son signals; `computed()` sólo reacciona a lecturas de signals. Para reaccionar a cambios de formulario se puede usar `valueChanges` o `events`, o consultar el estado directamente en la guarda.
- **¿Qué diferencia hay entre `canActivate` y `canDeactivate`, y qué no cubre la guarda de salida?** `canActivate` decide si se entra a una ruta; `canDeactivate` decide si se abandona el componente actual. Esta última no intercepta el cierre de pestaña, recarga del navegador, caída del proceso ni navegación fuera del router de Angular.

## Prácticas anteriores

El tablero y el catálogo remoto de la Práctica 21 siguen en `/clases`; `GET /clases` sigue siendo público. Las explicaciones de signals, router y formulario de las prácticas anteriores se conservan en el historial de ramas.
