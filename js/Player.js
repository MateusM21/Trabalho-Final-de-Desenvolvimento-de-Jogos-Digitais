function Player(stage, teclado) {
  this.stage = stage;
  this.teclado = teclado;
  this.sprite = new createjs.Shape();
  this.sprite.graphics.beginFill("blue").drawCircle(0, 0, 15);
  this.sprite.x = 600;
  this.sprite.y = 400;
  this.velocidade = 3;
  this.direcao = {x: 0, y: -1};
  this.vida = 100;
  this.pontos = 0;
  this.dano = 1;
  this.projeteis = [];
  this.stage.addChild(this.sprite);
}

Player.prototype.update = function() {
  let dx = 0, dy = 0;
  if (this.teclado.pressionada(SETA_CIMA) || this.teclado.pressionada(W)) dy -= this.velocidade;
  if (this.teclado.pressionada(SETA_BAIXO) || this.teclado.pressionada(S)) dy += this.velocidade;
  if (this.teclado.pressionada(SETA_ESQUERDA) || this.teclado.pressionada(A)) dx -= this.velocidade;
  if (this.teclado.pressionada(SETA_DIREITA) || this.teclado.pressionada(D)) dx += this.velocidade;

  if (dx !== 0 || dy !== 0) {
    this.sprite.x += dx;
    this.sprite.y += dy;
    this.direcao = {x: dx, y: dy};
  }
};

Player.prototype.atacar = function() {
  const proj = new Projetil(this.stage, this.sprite.x, this.sprite.y, this.direcao.x, this.direcao.y, this.dano);
  this.projeteis.push(proj);
};
