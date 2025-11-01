function PowerUp(stage, player, aplicarPowerUp) {
  this.stage = stage;
  this.player = player;
  this.ultimoPower = 0;
  this.ativo = false;
  this.opcoes = ["dano", "velocidade", "projeteis"];
  this.aplicarPowerUp = aplicarPowerUp;
}

PowerUp.prototype.check = function() {
  if (this.player.pontos >= this.ultimoPower + 100 && !this.ativo) {
    this.ativo = true;
    this.ultimoPower += 100;
    this.mostrarEscolha();
  }
};

PowerUp.prototype.mostrarEscolha = function() {
  createjs.Ticker.paused = true;

  const fundo = new createjs.Shape();
  fundo.graphics.beginFill("#000").drawRect(0, 0, 1200, 800);
  fundo.alpha = 0.7;
  fundo.name = "powerupFundo";
  this.stage.addChild(fundo);

  const texto = new createjs.Text("Escolha seu PowerUp", "28px Arial", "#fff");
  texto.x = 600;
  texto.y = 200;
  texto.textAlign = "center";
  texto.name = "powerupTexto";
  this.stage.addChild(texto);

  const opcoes = [
    { label: "+0.5 de dano", tipo: "dano" },
    { label: "+0.5 de velocidade", tipo: "velocidade" },
    { label: "+1 projétil aleatório", tipo: "projeteis" }
  ];

  opcoes.forEach((opcao, i) => {
    const botao = new createjs.Text(opcao.label, "24px Arial", "#0f0");
    botao.x = 600;
    botao.y = 300 + i * 60;
    botao.textAlign = "center";
    botao.cursor = "pointer";
    botao.name = "powerupBotao" + i;

    botao.addEventListener("click", () => {
      this.aplicarPowerUp(opcao.tipo);
      this.removerTela();
      createjs.Ticker.paused = false;
      this.ativo = false;
    });

    this.stage.addChild(botao);
  });

  this.stage.update();
};

PowerUp.prototype.removerTela = function() {
  this.stage.removeChild(this.stage.getChildByName("powerupFundo"));
  this.stage.removeChild(this.stage.getChildByName("powerupTexto"));
  for (let i = 0; i < 3; i++) {
    this.stage.removeChild(this.stage.getChildByName("powerupBotao" + i));
  }
};
