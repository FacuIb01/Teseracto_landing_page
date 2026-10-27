# Traslado del diseño aprobado

Fecha: 27 de octubre de 2026.

Fuentes: archivo Paper Teseracto, página 1, y `design/mobile-preview.html`.
Los originales de diseño no se modificaron.

## Valores desktop recuperados de Paper

- Artboard: 1440 px de ancho.
- Navbar: 88 px, enlaces Montserrat 15/24, separación 40 px, grupo centrado.
- Hero: 812 px, título Montserrat 800 de 112/128 y tracking .015em. Lema Cormorant Garamond Italic de 38/48. Grupo de texto a 310 px del inicio del hero. Trece figuras decorativas con posiciones y rotaciones procedentes del diseño.
- Servicios: márgenes laterales 64 px; título 42/52; separación de filas 12 px; filas cerradas 88 px, radio 12 px; número 20 px con separador; etiqueta 28/36. Estado abierto crema, cuerpo 22/34, botón de 210 × 56 e ilustración de 420 × 210.
- Nosotros: etiqueta 15/22, título 42/54; teseracto central de 380 px; bloques laterales de 280 px y bloque inferior de 310 px. Conectores celestes de trazo fino.
- Marcas: título 36/48, Lacoste 280 × 60, Cambru DM Serif Display 48/60 con tracking .04em. Fondo blanco y separadores celestes.
- Contacto: padding 72 × 80 px; columnas originales 570/610 con gap 100; título 48/56, bajada 20/30. Teseracto oscuro 270 px. Campos de 56 px, textarea de 156 px y botón 260 × 60.
- Footer: 104 px, márgenes 80 px, copyright 14/22 y lema 26/34.

## Adaptación de implementación

- Anchos fluidos, sin escalar toda la página. Los valores desktop se mantienen como máximos y se ajustan con breakpoints.
- Mobile utiliza la referencia de 390 px: navbar 72, hero 600, seis figuras, título 43/54, márgenes de 24 px, servicios apilados y línea vertical en Nosotros. Se omite la barra de estado del teléfono de la maqueta: pertenece al dispositivo.
- Se usa Montserrat también donde algunos nodos de Paper habían quedado en System Sans-Serif, conforme al brief.
- La etiqueta y números pequeños de Nosotros usan azul petróleo para asegurar contraste legible sobre blanco; el celeste permanece en las conexiones.
- La altura de las secciones sigue al contenido para admitir textos ampliados, errores y acordeones abiertos sin recortes.
- La ilustración de Software es el SVG de Paper. Las otras dos conservan colores, trazos y estilo plano, con motivos de automatización y tienda.
- Los originales PNG se reutilizan sin alteraciones. Fuentes y licencias quedan en el proyecto.
- Se agrega un control discreto para pausar las marcas y la explicación necesaria de la modalidad de contacto por correo.

## Verificación

Se revisaron desktop (1440 px), tablet (768 px), mobile (390 px) y mobile estrecho (320 px). Las capturas y el reporte de QA se guardan en `previews/`.
Pruebas unitarias: validación de contacto, codificación segura de `mailto:` y geometría 4D existente.
