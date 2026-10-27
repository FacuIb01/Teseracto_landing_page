# TESERACTO

Landing responsive en HTML, CSS y JavaScript nativos. Conserva la identidad y las secciones aprobadas en [Paper](https://app.paper.design/file/01M5YM1R8TTA2FEFJXH77NAKHX/p-1-0) y usa `design/mobile-preview.html` como referencia mobile. No necesita un framework ni un servidor de aplicación para funcionar.

## Desarrollo

Requiere Node.js 22 o posterior.

```sh
npm install
npm run dev
```

Abrir la dirección impresa en la terminal, normalmente http://localhost:5173. El servidor escucha únicamente en este equipo y prueba el siguiente puerto si está ocupado. No abrir el HTML con doble clic: los módulos JavaScript requieren HTTP.

```sh
npm test
npm run build
```

`dist/` contiene la versión estática lista para hosting. Todas las rutas son relativas, incluidas las fuentes y los assets. Se puede comprobar el build localmente en http://localhost:5173/dist/index.html. El workflow existente de GitHub Pages sigue siendo manual: **Actions → Publicar teseracto en GitHub Pages → Run workflow**. Configurar **Settings → Pages → Source → GitHub Actions** antes de la primera publicación.

## Archivos principales

- `index.html`: contenido semántico, navegación, acordeones nativos y formulario.
- `src/style.css`: paleta, layouts responsive, estados de foco y movimiento reducido.
- `src/main.js`: menú, apertura de servicios con scroll, parallax, carrusel y año dinámico.
- `src/contact.js`: validación y preparación del mensaje de contacto.
- `assets/branding/`: logos originales del proyecto; se conservan todas las variantes.
- `assets/illustrations/`: ilustración de software trasladada del SVG de Paper y variantes de automatización/ecommerce con el mismo lenguaje visual.
- `assets/fonts/`: Montserrat, Cormorant Garamond Italic y DM Serif Display, descargadas de Google Fonts con sus licencias OFL. La landing no hace solicitudes a Google Fonts.

## Contacto: modalidad actual

Destino: **Facundoemiliano.21@gmail.com**, definido en `src/contact.js` y en el enlace alternativo de `index.html`.

**Conversemos abre el cliente de correo mediante `mailto:`**, con asunto, mensaje y email de contacto completos. El visitante debe confirmar el envío en su correo. La web no puede confirmar que haya un cliente configurado ni que el mensaje haya sido entregado; no muestra un éxito de envío y no borra los campos.

La alternativa **Copiar mensaje** permite enviarlo manualmente. Si el navegador no habilita el portapapeles, se explica cómo hacerlo. Sin JavaScript sigue disponible el enlace de correo y el botón del formulario queda deshabilitado para evitar una navegación accidental con los datos.

Para enviar directamente desde la página habrá que reemplazar esta modalidad por un endpoint o proveedor aprobado. Las credenciales deben vivir en el servidor, nunca en JavaScript público. No hay mensajes enviados automáticamente ni solicitudes a un proveedor externo desde esta implementación.

## Interacciones y accesibilidad

- Menú mobile desde 699 px: control de expansión, Escape para cerrar, cierre al seleccionar un enlace, salir con Tab o tocar fuera. No bloquea el scroll.
- Servicios: un único `details` abierto, clic/toque/Enter/Espacio y navegación con flechas, Inicio y Fin. El scroll selecciona servicios mediante umbrales estables dentro de la sección; no captura la rueda ni modifica la posición de scroll. Se respeta la elección manual y el foco de teclado. Durante la navegación a un ancla se suspende la selección automática para mantener estable el destino.
- Con `prefers-reduced-motion: reduce`, se desactivan parallax, rotaciones, scroll suave, selección automática de servicios y carrusel. Las dos marcas se muestran completas y estáticas. Los acordeones siguen funcionando manualmente.
- Carrusel continuo con botón de pausa; también se pausa con hover, foco, fuera del viewport y en pestañas ocultas. Las copias decorativas no se anuncian a lectores de pantalla.
- Labels visibles, errores asociados por campo, foco en el primer error y mensajes de estado accesibles. Email, idea y mensaje son obligatorios.
- Los textos de Nosotros conservan el lorem ipsum aprobado.

## Diseño y recursos conservados

Paper y `design/mobile-preview.html` se consultaron como referencia y no se modificaron. El acceso MCP alcanzó su límite semanal; se recuperaron las medidas y estilos exactos del DOM visible de la versión web de Paper. `design/implementation-notes.md` resume las decisiones de adaptación.

El visor Three.js original se conserva en **`previews/visor.html`**, con `src/viewer.js`, `src/viewer.css`, `src/tesseract.js` y `src/math4d.js`. Su documentación anterior está en `previews/viewer-README.md`. El build también lo incluye. La landing usa los logos aprobados y no descarga ni ejecuta Three.js.

La publicación no se dispara al ejecutar el build. Revisar `dist/` antes de ejecutar el workflow de hosting.
