# Verificación de la landing de Teseracto

27 de octubre de 2026.

- Revisión visual en 1440 × 900, 768 × 1024, 390 × 844 y comprobación de ancho en 320 × 740.
- Sin desbordamiento horizontal de página en los anchos comprobados.
- Menú mobile: abrir, cerrar, Escape, foco y enlace a Contacto comprobados.
- Acordeones: clic, Enter y flechas comprobados; solo un servicio abierto.
- Scroll mobile: secuencia Software → Automatizaciones → Ecommerce comprobada sin capturar la rueda ni modificar la posición de scroll.
- Enlaces Contactanos y navegación desktop a Contacto comprobados; destino con margen superior de 32 px.
- Carrusel: pausa manual y estado accesible comprobados.
- Formulario: campos vacíos, email inválido, foco en el primer error y corrección de errores comprobados.
- Copia de un mensaje válido comprobada. No se enviaron correos de prueba.
- Destino de contacto: Facundoemiliano.21@gmail.com. Modalidad actual: abrir el cliente de correo para que el visitante confirme el envío; alternativa de copia disponible.
- Consola sin errores durante las pruebas realizadas; imágenes y fuentes locales cargadas.
- Build comprobado desde `/dist/index.html`, incluyendo funcionamiento bajo subcarpeta.
- Ocho pruebas automatizadas aprobadas: recursos y rutas, referencias de accesibilidad, validación/contacto y geometría 4D existente.
- Movimiento reducido implementado mediante CSS y `matchMedia`; la preferencia del sistema operativo no se cambió durante la revisión.

Capturas: `landing-hero.jpg`, `landing-desktop.jpg` y `landing-mobile.jpg`.

Los diseños originales de Paper y la referencia HTML mobile se conservaron. El visor anterior está disponible en `previews/visor.html`.
