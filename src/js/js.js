// Activar el efecto de aparición cuando se carga la página
window.onload = function() {
    document.querySelectorAll('.fade-in').forEach(function(element) {
      element.classList.add('visible');
    });
};

// Lógica para rotar las tarjetas
let cards = document.querySelectorAll('.card');
let index = 0;

function rotateCards() {
  // Resetear las clases
  cards.forEach(card => {
    card.classList.remove('active', 'left', 'right');
  });

  // Aplicar las nuevas clases de acuerdo con el índice
  cards[index].classList.add('active');
  cards[(index + 1) % cards.length].classList.add('left');
  cards[(index + 2) % cards.length].classList.add('right');

  // Incrementar el índice y asegurarnos de que vuelva a empezar después del último
  index = (index + 1) % cards.length;
}

// Llamar a la función para rotar las tarjetas cada 3 segundos
setInterval(rotateCards, 3000);

// Inicializar la primera rotación
rotateCards();

