function Menu(stage, iniciarCallback, ranking) {
  this.stage = stage;
  this.iniciarCallback = iniciarCallback;

  const fundo = new createjs.Shape();
  fundo.graphics.beginFill("#111").drawRect(0, 0, 1200, 800);
  stage.addChild(fundo);

  const titulo = new createjs.Text("Survivor Prototype", "32px Arial", "#fff");
  titulo.x = 600;
  titulo.y = 100;
  titulo.textAlign = "center";
  stage.addChild(titulo);

  const nomeLabel = new createjs.Text("Digite seu nome:", "20px Arial", "#fff");
  nomeLabel.x = 600;
  nomeLabel.y = 180;
  nomeLabel.textAlign = "center";
  stage.addChild(nomeLabel);

  const nomeInput = document.createElement("input");
  nomeInput.type = "text";
  nomeInput.placeholder = "Seu nome";
  nomeInput.style.position = "absolute";
  nomeInput.style.left = "50%";
  nomeInput.style.top = "220px";
  nomeInput.style.transform = "translateX(-50%)";
  nomeInput.style.fontSize = "18px";
  nomeInput.style.padding = "5px";
  document.body.appendChild(nomeInput);

  const botaoIniciar = new createjs.Text("Iniciar Jogo", "24px Arial", "#0f0");
  botaoIniciar.x = 600;
  botaoIniciar.y = 280;
  botaoIniciar.textAlign = "center";
  botaoIniciar.cursor = "pointer";
  botaoIniciar.alpha = 0.5;
  botaoIniciar.mouseEnabled = false;

  botaoIniciar.addEventListener("click", () => {
    if (nomeInput.value.trim() !== "") {
      document.body.removeChild(nomeInput);
      stage.removeAllChildren();
      iniciarCallback(nomeInput.value.trim());
    }
  });

  stage.addChild(botaoIniciar);

  nomeInput.addEventListener("input", () => {
    if (nomeInput.value.trim() !== "") {
      botaoIniciar.alpha = 1;
      botaoIniciar.mouseEnabled = true;
    } else {
      botaoIniciar.alpha = 0.5;
      botaoIniciar.mouseEnabled = false;
    }
  });

  // Ranking
  const rankingTitulo = new createjs.Text("Ranking", "24px Arial", "#fff");
  rankingTitulo.x = 600;
  rankingTitulo.y = 360;
  rankingTitulo.textAlign = "center";
  stage.addChild(rankingTitulo);

  ranking.forEach((item, i) => {
    const linha = new createjs.Text(`${i + 1}. ${item.nome} - ${item.pontos} pts`, "18px Arial", "#ccc");
    linha.x = 600;
    linha.y = 400 + i * 30;
    linha.textAlign = "center";
    stage.addChild(linha);
  });

  stage.update();
}
