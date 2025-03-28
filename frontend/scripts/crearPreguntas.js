// Variables globales
const url = 'https://restcountries.com/v3.1/all';

const paises = [];
const paisesSeleccionados = [];
const preguntas = [];
let cantidadDePaises;

// Funcion Inicializar

const Inicializar = async () => {

    //Limpio los array de paises seleccionados y preguntas para que no se acumulen
    paisesSeleccionados.length = 0;
    preguntas.length = 0;

    //Hacer la carga de los paises en el array paises
    await cargarPaises();

    //Extraer 10 paises aleatorios
    extraerPaises(paises.length, 10);

    //generar preguntas
    paisesSeleccionados.forEach((pais) => {
        generarPreguntas(pais);
    });
}


//Funciones generales

const cargarPaises = async () => {
    try {
        //LLamada a la api
        const respuesta = await fetch(url);

        //respuesta a formato json
        const paisesApi = await respuesta.json();

        //Guardar cantidad de paises con capital
        cantidadDePaises = paisesApi.length;

        //Guardar solo los paises que tengan capital en el array paises.
        for (const pais of paisesApi) {
            if (pais.capital === undefined) {
                continue;   // Si el pais no tiene capital, se saltea y pasa al siguiente
            }
            paises.push(pais);
        }

        console.log(paises);
    } catch (error) {
        console.log(error);
    }
}

//Extraer países aleatorios (10)

const extraerPaises = (arrayLength, cantidad) => {
    let posicionesSeleccionadas = [];
    let posicionesDisponibles = Array.from({ length: arrayLength }, (_, i) => i); // <- EXPLICAMELO FEDE;

    console.log(paises);
    for (let i = 0; i < cantidad; i++) {
        const indiceAleatorio = Math.floor(Math.random() * posicionesDisponibles.length);

        posicionesSeleccionadas.push(posicionesDisponibles[indiceAleatorio]);
        posicionesDisponibles.splice(indiceAleatorio, 1);
    }

    //extraer paises seleccionados
    posicionesSeleccionadas.forEach((posicion) => {
        paisesSeleccionados.push(paises[posicion]);
    });
}


//Funciones para crear preguntas

const generarPreguntas = (paisesSeleccionados) => {
    const tipoDePreguntas = Math.floor(Math.random() * 3) + 1;

    switch (tipoDePreguntas) {
        case 1:
            preguntaCapitales(paisesSeleccionados);
            break;
        case 2:
            preguntaBandera(paisesSeleccionados);
            break;
        case 3:
            preguntaLimitrofe(paisesSeleccionados);
            break;
        default:
            console.log('No se pudo cargar una pregunta');
            break;
    }
}



const preguntaCapitales = (pais) => {
    const tipo = 'capital';
    const puntaje = 3;
    const pregunta = `cual es el nombre del pais que tiene por capital a "${pais.capital}"?`;
    const respuestaCorrecta = pais.name.common;
    let opciones = [];


    opciones.push(respuestaCorrecta);

    //Agregar 3 respuestas incorrectas

    /*
    for(let i = 0; i < 3; i++) {
        const indiceAleatorio = Math.floor(Math.random() * 246); 
        opciones.push(paises[indiceAleatorio].capital[0]);
    }
    */

    // opciones 2.0

    for (let i = 0; i < 3; i++) {
        let opcionIncorrecta;
        do {
            const indiceAleatorio = Math.floor(Math.random() * 246); // <- aca poner un paises.length
            opcionIncorrecta = paises[indiceAleatorio].name.common;
        } while (opcionIncorrecta === respuestaCorrecta || opciones.includes(opcionIncorrecta));
        opciones.push(opcionIncorrecta);
    }

    opciones = mezclarOpciones(opciones);

    preguntas.push({
        tipo,
        puntaje,
        pregunta,
        respuestaCorrecta,
        opciones,
    })
}


const preguntaBandera = (pais) => {
    const tipo = 'bandera';
    const puntaje = 5;
    const pregunta = `a que pais pertenece la siguiente bandera?`;
    const bandera = pais.flags.png;
    const respuestaCorrecta = pais.name.common;
    let opciones = [];


    opciones.push(respuestaCorrecta);

    for (let i = 0; i < 3; i++) {
        let opcionIncorrecta;
        do {
            const indiceAleatorio = Math.floor(Math.random() * 246);
            opcionIncorrecta = paises[indiceAleatorio].name.common;
        } while (opcionIncorrecta === respuestaCorrecta || opciones.includes(opcionIncorrecta));
        opciones.push(opcionIncorrecta);
    }


    opciones = mezclarOpciones(opciones);

    preguntas.push({
        tipo,
        puntaje,
        pregunta,
        bandera,
        respuestaCorrecta,
        opciones,
    })
}


const preguntaLimitrofe = (pais) => {
    const tipo = 'limitrofe';
    const puntaje = 3;
    const pregunta = `cuantos paises limita con ${pais.name.common}?`;
    const respuestaCorrecta = pais?.borders?.length || 0;
    let opciones = [];

    opciones.push(respuestaCorrecta);
    const opcionIncorrecta = generarTresNumerosDistintos(respuestaCorrecta);
    opciones.push(...opcionIncorrecta);

    opciones = mezclarOpciones(opciones);

    preguntas.push({
        tipo,
        puntaje,
        pregunta,
        respuestaCorrecta,
        opciones,
    });
}

// Funciones Auxiliares

// Función para mezclar las opciones de las preguntas
const mezclarOpciones = (arreglo) => {
    const copiaArreglo = [...arreglo];

    for (let i = copiaArreglo.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copiaArreglo[i], copiaArreglo[j]] = [copiaArreglo[j], copiaArreglo[i]];
    }

    return copiaArreglo;
}

// Función para generar tres números distintos de la respuesta correcta
const generarTresNumerosDistintos = (x) => {
    const numerosDisponibles = Array.from({ length: 8 }, (_, i) => i);
    const numerosFiltrados = numerosDisponibles.filter((num) => num !== x);
    const numerosSeleccionados = [];

    while (numerosSeleccionados.length < 3) {
        const indiceAleatorio = Math.floor(Math.random() * numerosFiltrados.length);
        const numeroAleatorio = numerosFiltrados[indiceAleatorio];
        if (!numerosSeleccionados.includes(numeroAleatorio)) {
            numerosSeleccionados.push(numeroAleatorio);
        }
    }

    return numerosSeleccionados;
};

