# Gimnasio Admin — Práctica 21

Continuación de las Prácticas 19 y 20. El panel ya usa el router de Angular, el catálogo viene de `gimnasio-backend` y el formulario de alta prepara los datos sin enviar un `POST`.

## Ejecutar

### Frontend

```bash
npm ci
npm start
```

Abre `http://localhost:4200`. La ruta vacía redirige a `/clases`; `/horarios` y `/miembros` son páginas de muestra.

### API

En otra terminal, sigue los requisitos e instrucciones de [`gimnasio-backend/README.md`](gimnasio-backend/README.md). La API requiere Node y MySQL; configura `.env`, prepara Prisma y ejecuta `npm run start:dev` desde `gimnasio-backend`. El catálogo responde en `http://localhost:3000/clases` y las imágenes en `http://localhost:3000/img/`.

La aplicación Angular de esta práctica no tiene login. `GET /clases` es público; las rutas de escritura del backend siguen protegidas por rol.

## Rutas y páginas

- `/clases`: tablero de la Práctica 20 trasladado a `ListaClases`, con resumen, filtro, tarjetas y detalle lateral.
- `/clases/nueva`: formulario reactivo que muestra el objeto listo para la API cuando el formulario es válido. No realiza ninguna petición.
- `/horarios` y `/miembros`: páginas iniciales con «Hola mundo».
- `src/app/app.routes.ts` registra las páginas, redirige `''` a `clases` con `pathMatch: 'full'` y deja `**` al final.
- `src/app/app.html` conserva la barra de navegación y coloca el contenido de la página en `router-outlet`.

## Catálogo remoto

`Catalogo` obtiene `GET /clases` con `httpResource` y lee `data` del sobre de la API. El mismo servicio conserva las signals de categoría y selección, y calcula las clases visibles, los minutos y las clases largas con `computed`. La página presenta los estados de carga y error. Las rutas de imagen relativas se completan con `API_URL` (`src/config.ts`).

Se copió `src/servicios/errores.ts` del código base para explicar errores HTTP. Se eliminó `src/datos/` porque el frontend ya no usa el catálogo local.

## Respuestas de la Práctica 21

- **¿Qué pieza de React Router corresponde a `router-outlet`, `routerLink` y `routerLinkActive`?** `router-outlet` se parece a `<Outlet />`: reserva el lugar donde se dibuja la ruta activa. `routerLink` cumple el papel de `<Link to="...">` para navegar sin recargar la página. `routerLinkActive` se parece a la lógica de `<NavLink>` que marca el enlace de la ruta activa.
- **¿Por qué `**` va al final y la ruta vacía necesita `pathMatch: 'full'`?** Angular prueba las rutas en orden y se queda con la primera coincidencia; el comodín debe quedar después de todas las rutas concretas para no capturarlas. La ruta vacía usa `full` para redirigir sólo cuando la URL está vacía, no cuando cualquier ruta empieza con un prefijo vacío.
- **¿Dónde vive el valor de un campo reactivo y cómo se diferencia de `useState`?** Vive en su `FormControl`, agrupado en el `FormGroup`; Angular sincroniza el modelo con el elemento y también mantiene validez, estado tocado y cambios. `useState` guarda estado del componente React mediante su setter, pero no crea por sí mismo un árbol de controles con esas reglas de formulario.
- **¿Qué devuelve el validador propio y cómo se relaciona con `hasError`?** Devuelve `null` si la duración cumple la regla; si no, devuelve un mapa de error con la clave `multiploDeCinco`. `hasError('multiploDeCinco')` consulta esa clave para decidir si mostrar el mensaje.
- **¿Qué cambió en el servicio del catálogo y por qué ningún componente se enteró?** Las clases pasaron de un arreglo local a la respuesta reactiva de `httpResource`, que hace `GET /clases`. Se mantuvieron el servicio compartido, los nombres de sus señales y los valores computados que leen los componentes; por eso tablero, filtro y tarjetas siguen consumiendo la misma interfaz.
- **¿Por qué no hizo falta iniciar sesión para leer el catálogo?** El controlador del backend marca `GET /clases` como público con `@Publico()`. Esto permite leer sin token; las operaciones de escritura continúan protegidas.

## Respuestas conservadas de la Práctica 20

- Un `signal` contiene estado modificable y se parece aproximadamente a `useState`; `computed` deriva un valor de otros signals y se parece aproximadamente a `useMemo`.
- `inject(Catalogo)` obtiene la instancia compartida del inyector. `new Catalogo()` crearía una instancia aparte con estado distinto y fuera del ciclo de vida de inyección de Angular.
- `clase()` lee el valor actual de un input signal. En `@for`, `track clase.id` da una identidad estable para que Angular relacione los elementos con sus tarjetas.

## Errores capturados en la Práctica 20

Las salidas reales de compilación se conservan en `evidencias/NG5002.txt`, `evidencias/NG8001.txt` y `evidencias/NG8109.txt`. Cada error se provocó temporalmente y luego se corrigió.
