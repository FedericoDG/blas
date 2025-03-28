const btnEmpezarJuego = document.getElementById('btnEmpezarJuego');
const container = document.getElementById('container');

let indexPreguntaActual = 0;
let puntos = 0;
let tiempoInicio;
let intervaloReloj;

btnEmpezarJuego.addEventListener('click', async () => {
  await Inicializar(); // LLenar variable 'preguntas'

  if (preguntas.length > 0) {
    btnEmpezarJuego.style.display = 'none';
    reiniciarJuego();
    tiempoInicio = Date.now();
    iniciarReloj();

    console.log(`paises: ${cantidadDePaises}`);
    console.log(`preguntas: ${preguntas.length}`);
    mostrarPreguntas();
  } else {
    container.innerHTML = '<p>No hay preguntas disponibles</p>';
  }
});

function mostrarPreguntas() {
  // Accion si se llega al final de las preguntas

  if (indexPreguntaActual >= preguntas.length) {
    clearInterval(intervaloReloj);
    const tiempoFinal = Math.floor((Date.now() - tiempoInicio) / 1000);

    container.innerHTML = `
        <p> Fin del juego. Puntaje final: ${puntos} puntos.</p>
        <p> Tiempo total: ${tiempoFinal} s. </p>
       <div class="input-container">
        <input type="text" id="nombreJugador" placeholder="Ingrese su nombre">
        <button id="btnEnviarPuntaje" class="btn btn-success">Enviar puntaje</button>
    </div>`;

    document.getElementById('reloj').style.display = 'none';
    document.body.style.backgroundColor = '#005E54';

    //Envento al hacer click al boton enviar puntaje

    document.getElementById('btnEnviarPuntaje').addEventListener('click', () => {
      const nombreJugador = document.getElementById('nombreJugador').value;
      if (nombreJugador.trim() === '') {
        alert('Por favor ingrese el nombre del jugador para poder publicar el puntaje.');
      } else {
        fetch('https://blas-backend.onrender.com/players', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: nombreJugador,
            points: puntos,
            sec: tiempoFinal,
          }),
        })
          .then((res) => res.json())
          .then((res) => console.log(res));

        console.log(`Enviando puntaje: ${nombreJugador} - ${puntos} puntos - ${tiempoFinal} s.`);
        alert('Puntaje enviado con exito');
        btnEmpezarJuego.style.display = 'block';
        container.innerHTML = '';
      }
    });

    return;
  }

  const pregunta = preguntas[indexPreguntaActual];

  container.innerHTML = `
    <h2>${pregunta.pregunta}</h2>
    <p> Pregunta ${indexPreguntaActual + 1} / ${preguntas.length}</p>
    <div id = "opciones"></div>`;

  if (pregunta.bandera) {
    const img = document.createElement('img');
    img.src = pregunta.bandera;
    img.className = 'img-thumbnail';
    img.alt = 'Bandera';
    img.classList.add('bandera');
    container.insertBefore(img, container.firstChild);
  }

  const opcionesDiv = document.getElementById('opciones');

  pregunta.opciones.forEach((opcion) => {
    const btn = document.createElement('button');
    btn.textContent = opcion;
    btn.addEventListener('click', () =>
      evaluarRespuesta(opcion, pregunta.respuestaCorrecta, pregunta.puntaje)
    );
    opcionesDiv.appendChild(btn);
  });
}

//Funciones auxiliares

function evaluarRespuesta(opcionSeleccionada, respuestaCorrecta, puntaje) {
  if (opcionSeleccionada === respuestaCorrecta) {
    cambiarColorRespuesta('#C2BB00');
    puntos += puntaje;
  } else {
    cambiarColorRespuesta('#E1523D');
  }
  indexPreguntaActual++;
  mostrarPreguntas();
}

function iniciarReloj() {
  let reloj = document.getElementById('reloj');
  if (!reloj) {
    reloj = document.createElement('p');
    reloj.id = 'reloj';
    document.body.appendChild(reloj);
  }

  intervaloReloj = setInterval(() => {
    const tiempoTranscurrido = Math.floor((Date.now() - tiempoInicio) / 1000);
    reloj.textContent = `Tiempo: ${tiempoTranscurrido} s.`;
  }, 1000);
}

function reiniciarJuego() {
  indexPreguntaActual = 0;
  puntos = 0; // Se reinicia el puntaje
  clearInterval(intervaloReloj); // se reinicia el reloj
  const reloj = document.getElementById('reloj');
  if (reloj) {
    reloj.textContent = `Tiempo: 0 s.`; // se reinicia el texto del reloj
  }
}

function cambiarColorRespuesta(color) {
  document.body.style.backgroundColor = color;
  setTimeout(() => {
    document.body.style.backgroundColor = '#005E54';
  }, 600);
}
