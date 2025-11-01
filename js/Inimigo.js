function Inimigo(stage, player, tipo, dificuldade) {
  this.stage = stage;
  this.player = player;
  this.tipo = tipo;
  this.vida = tipo.vida + dificuldade;
  this.dano = tipo.dano + dificuldade;
  this.pontos = tipo.pontos;
  this.sprite = new createjs.Shape();
  this.sprite.graphics.beginFill(tipo.cor).drawCircle(0, 0, tipo.raio);
  this.sprite.x = Math.random() * 1200;
  this.sprite.y = Math.random() * 800;
  this.stage.addChild(this.sprite);
}

Inimigo.prototype.update = function() {
  let dx = this.player.sprite.x - this.sprite.x;
  let dy = this.player.sprite.y - this.sprite.y;
  let dist = Math.sqrt(dx * dx + dy * dy);

  if (this.tipo.nome === "distancia") {
    if (dist < 150) {
      this.sprite.x -= dx / dist;
      this.sprite.y -= dy / dist;
    }
  } else {
    this.sprite.x += dx / dist;
    this.sprite.y += dy / dist;
  }

  if (dist < 20) {
    this.player.vida -= this.dano / 60;
  }
};
