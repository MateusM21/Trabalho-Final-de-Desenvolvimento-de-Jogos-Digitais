function Projetil(stage, x, y, dx, dy, dano) {
  this.stage = stage;
  this.sprite = new createjs.Shape();
  this.sprite.graphics.beginFill("white").drawCircle(0, 0, 5);
  this.sprite.x = x;
  this.sprite.y = y;
  this.vel = {x: dx * 5, y: dy * 5};
  this.dano = dano;
  this.stage.addChild(this.sprite);
}

Projetil.prototype.update = function() {
  this.sprite.x += this.vel.x;
  this.sprite.y += this.vel.y;
};
