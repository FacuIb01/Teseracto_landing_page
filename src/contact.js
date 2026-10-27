export const CONTACT_EMAIL = 'Facundoemiliano.21@gmail.com';

export function validateContact(values) {
  const errors = {};
  if (!values.email?.trim()) errors.email = 'Ingresá tu email.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()) || values.email.length > 254) errors.email = 'Ingresá un email válido, por ejemplo vos@empresa.com.';
  if (!values.idea?.trim()) errors.idea = 'Dale un título a tu idea.';
  else if (values.idea.length > 120) errors.idea = 'Usá hasta 120 caracteres para el título.';
  if (!values.message?.trim()) errors.message = 'Contanos un poco más sobre tu idea.';
  else if (values.message.length > 1500) errors.message = 'Usá hasta 1500 caracteres para el mensaje.';
  return errors;
}

export function prepareContact(values) {
  if (Object.keys(validateContact(values)).length) throw new Error('Revisá los datos del formulario.');
  // Header text is kept on one line; all URI components are encoded separately.
  const subject = `Teseracto — ${values.idea.trim().replace(/[\r\n]+/g, ' ')}`;
  const body = `Hola, Teseracto:\r\n\r\n${values.message.trim()}\r\n\r\nMi email de contacto: ${values.email.trim()}`;
  return {
    url: `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    text: `Para: ${CONTACT_EMAIL}\nAsunto: ${subject}\n\n${body}`,
  };
}

export function initContact(form, { openMail = url => { window.location.href = url; } } = {}) {
  const fields = ['email', 'idea', 'message'].map(name => form.elements.namedItem(name));
  const status = form.querySelector('#form-status');
  const copyButton = form.querySelector('#copy-message');
  let attempted = false;
  const values = () => Object.fromEntries(fields.map(field => [field.name, field.value]));
  function showErrors(focus = false) {
    const errors = validateContact(values());
    fields.forEach(field => {
      const error = form.querySelector(`#${field.id}-error`);
      error.textContent = errors[field.name] || '';
      error.hidden = !errors[field.name];
      if (errors[field.name]) field.setAttribute('aria-invalid', 'true');
      else field.removeAttribute('aria-invalid');
    });
    if (focus && Object.keys(errors).length) {
      status.textContent = 'Revisá los campos indicados para preparar tu mensaje.';
      fields.find(field => errors[field.name]).focus();
    }
    return !Object.keys(errors).length;
  }
  fields.forEach(field => field.addEventListener('input', () => {
    if (attempted) showErrors();
    status.textContent = '';
  }));
  form.addEventListener('submit', event => {
    event.preventDefault();
    attempted = true;
    if (!showErrors(true)) return;
    const message = prepareContact(values());
    status.textContent = 'Tu mensaje está preparado. Confirmá el envío en tu aplicación de correo. Si no se abrió, podés copiarlo y enviarlo a la dirección de abajo.';
    openMail(message.url);
    // Keep all fields: a mailto navigation cannot confirm delivery or even client availability.
  });
  copyButton.addEventListener('click', async () => {
    attempted = true;
    if (!showErrors(true)) return;
    try {
      await navigator.clipboard.writeText(prepareContact(values()).text);
      status.textContent = 'Mensaje copiado. Pegalo en tu correo y envialo a ' + CONTACT_EMAIL + '.';
    } catch {
      status.textContent = 'No pudimos copiar automáticamente. Podés seleccionar el texto de los campos y escribirnos a ' + CONTACT_EMAIL + '.';
    }
  });
  form.noValidate = true;
  form.querySelector('[type="submit"]').disabled = false;
  copyButton.hidden = false;
}
