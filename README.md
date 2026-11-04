Gimnasio Admin

Práctica 19: tablero de clases hecho con Angular y el catálogo local del gimnasio.


Preguntas del ejercicio

- ¿Qué archivo de Angular hace el papel de main.tsx? src/main.ts, que inicia la aplicación y llama a bootstrapApplication.
- ¿Qué hace el papel de App.tsx? El componente raíz src/app/app.ts junto con su plantilla src/app/app.html (y sus estilos en app.css).
- ¿Qué hace el papel de vite.config.ts? angular.json es el equivalente más cercano: configura los builders de ng build y ng serve, las opciones de compilación, los recursos y los estilos. No es una correspondencia exacta ni un archivo Vite.
- ¿Por qué clase() lleva paréntesis? input.required() crea una señal de entrada. Se llama como función para leer el valor actual de la clase.
- ¿Para qué sirve track? Da a @for una clave estable (clase.id) para que Angular identifique cada tarjeta y actualice sólo los nodos necesarios cuando cambia la lista.

Errores capturados

Los archivos de evidencias/ guardan la salida real de ng build al provocar cada error de forma momentanea.

- NG5002: un bloque @if sin su llave de cierre.
- NG8001: un selector de componente desconocido que no está en imports del componente raíz.


