
 Respuestas de la Práctica 23

¿Qué diferencia hay entre un signal y un Observable? Un signal conserva un valor actual que se lee directamente y notifica a computed() y a la vista cuando cambia. Un Observable representa valores que pueden llegar a lo largo del tiempo.
¿Qué problema evita switchMap y qué pasaría con mergeMap? switchMap cancela la petición anterior cuando llega un término nuevo, previendo que una respuesta lenta y vieja reemplace los resultados recientes. mergeMap dejaría todas las peticiones activas.
¿Qué pasa si se quita catchError y la API se apaga? El Observable de la petición falla y toSignal vuelve a lanzar ese error cuando se lee su valor. Además, el flujo de búsquedas termina; escribir otra cosa no lo recupera. Con catchError dentro del switchMap, se ve el error de esa petición.


