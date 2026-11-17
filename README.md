
 Respuestas de la Práctica 22

Si el formulario ya valida, ¿por qué también valida el servidor?** El cliente se puede omitir o modificar: alguien puede llamar la API directamente, cambiar el navegador o enviar otra petición. El servidor es la frontera que protege los datos y debe validar aunque la interfaz ya lo haya hecho.

¿Por qué httpResource para leer y HttpClient para crear, editar y eliminar? httpResource modela una lectura reactiva y expone valor, carga y error; no es para mutaciones. HttpClient permite iniciar cada POST, PATCH o DELETE por una acción concreta. ([Angular: httpResource](https://angular.dev/guide/http/http-resource))
¿Qué pasa si se olvida subscribe()? El Observable de HttpClient es perezoso: sin suscripción no envía la petición ni ejecuta sus callbacks.

¿A qué piezas de React corresponden rutas hijas, interceptor y guardia?** Las rutas hijas se parecen a rutas anidadas con <Outlet />; el interceptor, a un interceptor de Axios o middleware de fetch; el guardia, a una ruta protegida que decide si renderiza o redirige.

¿Cuándo se ejecuta el guardia y por qué salir() debe navegar al login? canActivate y canActivateChild corren durante la navegación, antes de activar la ruta. Borrar el token sólo cambia el estado de sesión: navegar a /login también cambia la ruta y evita que quede visible el panel.

¿Cómo decide el formulario entre POST y PATCH?
La ruta nueva no trae id y usa POST; la ruta de edición enlaza :id con el input del componente y usa PATCH.
¿Por qué no observar el estado del formulario con computed()? 
FormGroup.dirty y los demás estados de Reactive Forms no son signals; computed() sólo reacciona a lecturas de signals. Para reaccionar a cambios de formulario se puede usar ValueChanges o events, o consultar el estado directamente en la guarda.

¿Qué diferencia hay entre canActivate y canDeactivate, y qué no cubre la guarda de salida? canActivate decide si se entra a una ruta; canDeactivate decide si se abandona el componente actual. Esta última no intercepta el cierre de pestaña, recarga del navegador, caída del proceso ni navegación fuera del router de Angular.

