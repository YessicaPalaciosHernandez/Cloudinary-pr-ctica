const usuario='dp0uxxfuq'
const present='Practica'

const imagen=document.getElementById('imagen')
const boton=document.getElementById('boton_subir')
const estado=document.getElementById('estado')
const imagen_subida=document.getElementById('imagenes')

imagen.addEventListener('change', function () {
  const file = imagen.files[0];

  if (!file) return;

  if (!file.type.startsWith('image/')) {
    mostrarError('El archivo seleccionado no es una imagen.');
    boton.disabled = true;
    return;
  }

  limpiarEstado();
  boton.disabled = false;
});

boton.addEventListener('click', function () {
  const file = imagen.files[0];

  if (!file) return;

  boton.disabled = true;
  mostrarEstado('Subiendo...');

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', present);

  const url = `https://api.cloudinary.com/v1_1/${usuario}/image/upload`;

  fetch(url, { method: 'POST', body: formData })
    .then(function (response) {
      if (!response.ok) {
        throw new Error('Error en el servidor: ' + response.status);
      }
      return response.json();
    })
    .then(function (data) {
      mostrarExito('¡Imagen subida con éxito!');
      agregarTarjeta(data.secure_url, file.name); // crear tarjeta con la URL
      boton.disabled = false;
      imagen.value = ''; 
    })
    .catch(function (error) {
      if (error.message === 'Failed to fetch') {
        mostrarError('Error de red. Revisa tu conexión o las credenciales.');
      } else {
        mostrarError(error.message);
      }
      boton.disabled = false;
    });
});

function agregarTarjeta(url, nombre) {
  const tarjeta = document.createElement('div');
  tarjeta.className = 'tarjeta';

  const img = document.createElement('img');
  img.src = url;
  img.alt = nombre;

  const texto = document.createElement('span');
  texto.textContent = nombre;

  tarjeta.appendChild(img);
  tarjeta.appendChild(texto);
  imagen_subida.appendChild(tarjeta); // se inserta en div#imagenes
}

function mostrarEstado(msg) {
  estado.textContent = msg;
  estado.className = '';
}

function mostrarExito(msg) {
  estado.textContent = msg;
  estado.className = 'success';
}

function mostrarError(msg) {
  estado.textContent = msg;
  estado.className = 'error';
}

function limpiarEstado() {
  estado.textContent = '';
  estado.className = '';
}