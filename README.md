# Gimnasio Admin — Práctica 20

Continuación del tablero de clases de la Práctica 19. Esta rama mueve el estado del catálogo a un servicio compartido con signals.

## Ejecutar

Desde esta carpeta:

```bash
npm install
npm start
```

La aplicación se sirve en `http://localhost:4200`. Para generar la compilación de producción:

```bash
npm run build
```

## Tablero y catálogo

- `Catalogo` es la fuente compartida para las clases, la categoría activa y la clase seleccionada.
- El filtro y el tablero obtienen la misma instancia del servicio con `inject(Catalogo)`.
- `computed()` calcula las clases visibles, sus minutos totales y cuántas duran 60 minutos o más.
- Cada tarjeta muestra la imagen, el nombre, la descripción, la categoría y la duración; su selección se envía al padre con `output()`.
- El panel lateral muestra el detalle de la clase seleccionada. Si el filtro la oculta, se limpia la selección.
- La etiqueta «Larga» aparece desde los 60 minutos.
- «Vaciar catálogo» muestra el estado vacío; «Restaurar catálogo» repone las ocho clases locales.

Con «Todas» y el catálogo completo, el resumen muestra 8 clases, 380 minutos semanales y 2 clases largas.

## Respuestas de la Práctica 20

- **¿Qué diferencia hay entre un signal y un computed?** Un signal contiene estado que puede cambiar; un computed deriva un valor de otros signals y se recalcula cuando cambian sus dependencias. Como analogía aproximada, `signal()` se parece a `useState` y `computed()` a `useMemo`, aunque Angular administra dependencias y actualizaciones de manera distinta.
- **¿Qué pasa si el filtro hace `new Catalogo()` en lugar de `inject(Catalogo)`?** Crearía una instancia independiente fuera del inyector de Angular. El filtro tendría estado distinto al tablero y no compartirían selección ni categoría.

## Aviso capturado

`evidencias/NG8109.txt` contiene la salida de `ng build` al dejar sin paréntesis una lectura de signal en la plantilla. La lectura se corrigió antes de terminar el trabajo.

## Preguntas del ejercicio

- **¿Qué archivo de Angular hace el papel de `main.tsx`?** `src/main.ts`, que inicia la aplicación y llama a `bootstrapApplication`.
- **¿Qué hace el papel de `App.tsx`?** El componente raíz `src/app/app.ts` junto con su plantilla `src/app/app.html` (y sus estilos en `app.css`).
- **¿Qué hace el papel de `vite.config.ts`?** `angular.json` es el equivalente más cercano: configura los builders de `ng build` y `ng serve`, las opciones de compilación, los recursos y los estilos. No es una correspondencia exacta ni un archivo Vite.
- **¿Por qué `clase()` lleva paréntesis?** `input.required()` crea una señal de entrada. Se llama como función para leer el valor actual de la clase.
- **¿Para qué sirve `track`?** Da a `@for` una clave estable (`clase.id`) para que Angular identifique cada tarjeta y actualice sólo los nodos necesarios cuando cambia la lista.

## Errores capturados

Los archivos de `evidencias/` guardan la salida real de `ng build` al provocar cada error de forma temporal. Los cambios incorrectos se revirtieron antes de finalizar.

- **NG5002:** un bloque `@if` sin su llave de cierre.
- **NG8001:** un selector de componente desconocido que no está en `imports` del componente raíz.

## Estructura solicitada

El proyecto se creó con `ng new gimnasio-admin --skip-tests --routing=false --ssr=false`. `tarjeta-clase`, el servicio `Catalogo` y `filtro-categoria` se generaron con Angular CLI. No se incluyeron pruebas ni configuración de rutas.
