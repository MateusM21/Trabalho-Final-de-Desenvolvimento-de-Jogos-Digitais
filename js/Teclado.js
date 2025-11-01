var SETA_CIMA = 38, SETA_BAIXO = 40, SETA_ESQUERDA = 37, SETA_DIREITA = 39, ESPACO = 32, W = 87, A = 65, S = 83, D = 68;

function Teclado(elemento) {
  this.elemento = elemento;
  this.pressionadas = [];
  this.disparadas = [];
  this.funcoesDisparo = [];

  var teclado = this;

  elemento.addEventListener('keydown', function(evento) {
    var tecla = evento.keyCode;
    teclado.pressionadas[tecla] = true;
    if (teclado.funcoesDisparo[tecla] && !teclado.disparadas[tecla]) {
      teclado.disparadas[tecla] = true;
      teclado.funcoesDisparo[tecla]();
    }
  });

  elemento.addEventListener('keyup', function(evento) {
    teclado.pressionadas[evento.keyCode] = false;
    teclado.disparadas[evento.keyCode] = false;
  });
}

Teclado.prototype = {
  pressionada: function(tecla) {
    return this.pressionadas[tecla];
  },
  disparou: function(tecla, callback) {
    this.funcoesDisparo[tecla] = callback;
  }
};
