# Gimnasio Admin — Práctica 23

Continuación de las Prácticas 19 a 22. El panel usa una sesión de administrador y busca clases por nombre con RxJS; cada término nuevo cancela la petición de búsqueda anterior.

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

## Búsqueda reactiva (Práctica 23)

`ClasesApi.buscarPorNombre(q)` consulta `GET /clases?q=...`. `Catalogo` mantiene el término en un `BehaviorSubject`, usa `switchMap` para cambiar a la petición más nueva, convierte la respuesta con `toSignal` y conserva `recargar()` para repetir el término actual después de guardar o borrar. La caja usa un `FormControl`; `debounceTime(350)`, `distinctUntilChanged()` y `takeUntilDestroyed()` evitan consultas por cada tecla, términos repetidos y suscripciones que queden vivas al salir de la página. Los errores de una petición se convierten en estado con `catchError`, por lo que una búsqueda posterior todavía puede funcionar.

### Ver las peticiones canceladas

En `gimnasio-backend/.env`, activa `RETARDO_MS=600` y reinicia la API. Abre las herramientas de desarrollo del navegador, pestaña **Red** (Network), y filtra por `clases`. En la caja, escribe parte de una palabra, espera unos 400 ms para que salga la primera petición y cambia el texto antes de que pasen los 600 ms de respuesta. La fila anterior debe aparecer cancelada; la última búsqueda devuelve los resultados. `RETARDO_MS` también demora el login y las demás respuestas, así que se puede quitar del `.env` al terminar la práctica.

### Respuestas de la Práctica 23

- **¿Qué diferencia hay entre un signal y un Observable?** Un signal conserva un valor actual que se lee directamente y notifica a `computed()` y a la vista cuando cambia. Un Observable representa valores que pueden llegar a lo largo del tiempo; se transforma con operadores y una suscripción puede cancelarse. `toSignal()` adapta el Observable del catálogo para consumir su estado en Angular.
- **¿Qué problema evita `switchMap` y qué pasaría con `mergeMap`?** `switchMap` cancela la petición anterior cuando llega un término nuevo, evitando que una respuesta lenta y vieja reemplace los resultados recientes. `mergeMap` dejaría todas las peticiones activas; podrían responder fuera de orden y mostrar resultados que ya no corresponden al texto.
- **¿Qué pasa si se quita `catchError` y la API se apaga?** El Observable de la petición falla y `toSignal` vuelve a lanzar ese error cuando se lee su valor. Además, el flujo de búsquedas termina; escribir otro término no lo recupera. Con `catchError` dentro del `switchMap`, se presenta el error de esa petición y el `BehaviorSubject` puede iniciar búsquedas nuevas.

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
