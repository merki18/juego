const dificultades = {
  facil: { rango: 10 },
  normal: { rango: 100 },
  dificil: { rango: 1000 },
};

const juego = {
  dificultad: "normal",
  numeroSecreto: null,
  intentos: 0,
  mejorPuntaje: Infinity,
  historialIntentos: [],
};

let adivinado = false;

if (localStorage.getItem('mejorPuntaje')) {
  juego.mejorPuntaje = parseInt(localStorage.getItem('mejorPuntaje'));
  document.getElementById('mejorPuntaje').textContent = juego.mejorPuntaje;
}

function generarNumeroSecreto(dificultad) {
  const rango = dificultades[dificultad].rango;
  return Math.floor(Math.random() * rango) + 1;
}

function adivinaNumero() {
  const numeroIngresado = parseInt(document.getElementById('numeroIngresado').value);

  if (isNaN(numeroIngresado) || numeroIngresado < 1 || numeroIngresado > dificultades[juego.dificultad].rango) {
    document.getElementById('resultado').textContent = 'Ingresa un número válido.';
    return;
  }

  juego.intentos++;

  if (numeroIngresado === juego.numeroSecreto) {
    adivinado = true;
    Swal.fire({
      title: '¡Felicitaciones!',
      text: `¡Adivinaste el número secreto (${numeroIngresado})!`,
      icon: 'success'
    });
    document.getElementById('resultado').textContent = `¡Felicitaciones! Adivinaste el número en ${juego.intentos} intentos.`;
    juego.historialIntentos.push(`Intento ${juego.intentos}: ${numeroIngresado}`);
    if (juego.intentos < juego.mejorPuntaje) {
      juego.mejorPuntaje = juego.intentos;
      document.getElementById('mejorPuntaje').textContent = juego.mejorPuntaje;
      localStorage.setItem('mejorPuntaje', juego.mejorPuntaje);
    }
    mostrarHistorial();
  } else if (numeroIngresado < juego.numeroSecreto) {
    document.getElementById('resultado').textContent = 'El número es mayor. Intenta de nuevo.';
    juego.historialIntentos.push(`Intento ${juego.intentos}: ${numeroIngresado} (mayor)`);
    mostrarHistorial();
  } else {
    document.getElementById('resultado').textContent = 'El número es menor. Intenta de nuevo.';
    juego.historialIntentos.push(`Intento ${juego.intentos}: ${numeroIngresado} (menor)`);
    mostrarHistorial();
  }
}

function mostrarHistorial() {
  const historialElement = document.getElementById('historial');
  historialElement.innerHTML = '';
  for (const intento of juego.historialIntentos) {
    const li = document.createElement('li');
    li.textContent = intento;
    historialElement.appendChild(li);
  }
}
const pista = () => {
  return new Promise((resolve, reject) => {
    if (adivinado) {
      reject();
    } else {
     resolve();
    }
  });
};

function mostrarPista() {
  pista()
    .then(() => {
      let pistaResuelta;
      if (juego.numeroSecreto % 2 === 0) {
        pistaResuelta = 'El número es par';
      } else {
        pistaResuelta = 'El número es impar';
      }
      document.getElementById('pista').textContent = pistaResuelta;
    })
    .catch(() => {
      document.getElementById('pista').textContent = 'Ya adivinaste el número';
    });
}

// Inicializar el número secreto al cambiar la dificultad y reiniciar la pista
document.getElementById('dificultad').addEventListener('change', function () {
  juego.dificultad = this.value;
  juego.numeroSecreto = generarNumeroSecreto(juego.dificultad);
  juego.historialIntentos = []; // Limpia el historial de intentos
  juego.intentos = 0; // Reiniciar la cantidad de intentos
  document.getElementById('resultado').textContent = ''; // Limpiar el resultado anterior
  mostrarHistorial(); // Limpiar el historial de intentos
  adivinado = false;
  document.getElementById('pista').textContent = 'PISTA'; // Reinicia la pista
});
