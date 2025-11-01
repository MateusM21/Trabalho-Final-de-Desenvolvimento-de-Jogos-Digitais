window.onload = function () {
  const stage = new createjs.Stage("gameCanvas");
  const teclado = new Teclado(document);
  let ranking = [];

  const menu = new Menu(stage, iniciarJogo, ranking);

  function iniciarJogo(nomeJogador) {
    stage.removeAllChildren();

    const fundo = new createjs.Shape();
    fundo.graphics.beginFill("#333").drawRect(0, 0, 1200, 800);
    stage.addChild(fundo);

    const player = new Player(stage, teclado);
    player.nome = nomeJogador;

    const inimigos = [];
    const projeteisInimigos = [];
    let mortos = 0;
    let dificuldade = 0;

    const tipos = {
      corpo: { nome: "corpo", cor: "orange", dano: 5, vida: 2, pontos: 10, raio: 10 },
      distancia: { nome: "distancia", cor: "yellow", dano: 3, vida: 1, pontos: 5, raio: 8 },
      chefe: { nome: "chefe", cor: "red", dano: 10, vida: 4, pontos: 20, raio: 20 }
    };

    const powerUp = new PowerUp(stage, player, aplicarPowerUp);

    function aplicarPowerUp(tipo) {
      if (tipo === "dano") {
        player.dano += 0.5;
      } else if (tipo === "velocidade") {
        player.velocidade += 0.5;
      } else if (tipo === "projeteis") {
        setInterval(() => {
          const angulo = Math.random() * 2 * Math.PI;
          const dx = Math.cos(angulo);
          const dy = Math.sin(angulo);
          player.projeteis.push(new Projetil(stage, player.sprite.x, player.sprite.y, dx, dy, player.dano));
        }, 5000);
      }
      dificuldade++;
    }

    teclado.disparou(ESPACO, function () {
      player.atacar();
    });

    createjs.Ticker.framerate = 60;
    createjs.Ticker.addEventListener("tick", function () {
      if (createjs.Ticker.paused) return;

      player.update();
      powerUp.check();

      // Atualiza projéteis do jogador
      player.projeteis.forEach((proj, pIndex) => {
        proj.update();

        if (proj.sprite.x < 0 || proj.sprite.x > 1200 || proj.sprite.y < 0 || proj.sprite.y > 800) {
          stage.removeChild(proj.sprite);
          player.projeteis.splice(pIndex, 1);
        }

        inimigos.forEach((inimigo, iIndex) => {
          const dx = proj.sprite.x - inimigo.sprite.x;
          const dy = proj.sprite.y - inimigo.sprite.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 15) {
            inimigo.vida -= proj.dano;
            stage.removeChild(proj.sprite);
            player.projeteis.splice(pIndex, 1);

            if (inimigo.vida <= 0) {
              player.pontos += inimigo.pontos;
              mortos++;
              stage.removeChild(inimigo.sprite);
              inimigos.splice(iIndex, 1);
            }
          }
        });
      });

      // Atualiza projéteis dos inimigos
      projeteisInimigos.forEach((proj, index) => {
        proj.update();

        if (proj.sprite.x < 0 || proj.sprite.x > 1200 || proj.sprite.y < 0 || proj.sprite.y > 800) {
          stage.removeChild(proj.sprite);
          projeteisInimigos.splice(index, 1);
        }

        const dx = proj.sprite.x - player.sprite.x;
        const dy = proj.sprite.y - player.sprite.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 15) {
          player.vida -= proj.dano;
          stage.removeChild(proj.sprite);
          projeteisInimigos.splice(index, 1);
        }
      });

      // Spawn de inimigos
      let spawnChance = 0.005 + dificuldade * 0.002;
      if (Math.random() < spawnChance) {
        let tipo = Math.random();
        if (tipo < 0.6) {
          inimigos.push(new Inimigo(stage, player, tipos.corpo, dificuldade));
        } else {
          inimigos.push(new Inimigo(stage, player, tipos.distancia, dificuldade));
        }
      }

      // Spawn de chefe
      if (mortos > 0 && mortos % 20 === 0) {
        inimigos.push(new Inimigo(stage, player, tipos.chefe, dificuldade));
        mortos++;
      }

      // Atualiza inimigos
      inimigos.forEach((inimigo) => {
        inimigo.update();

        // Limites de tela
        inimigo.sprite.x = Math.max(0, Math.min(1200, inimigo.sprite.x));
        inimigo.sprite.y = Math.max(0, Math.min(800, inimigo.sprite.y));

        // Inimigos de distância atiram
        if (inimigo.tipo.nome === "distancia" && Math.random() < 0.01) {
          const dx = player.sprite.x - inimigo.sprite.x;
          const dy = player.sprite.y - inimigo.sprite.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const vx = dx / dist;
          const vy = dy / dist;
          const proj = new Projetil(stage, inimigo.sprite.x, inimigo.sprite.y, vx, vy, inimigo.dano);
          projeteisInimigos.push(proj);
        }
      });

      // Limites do jogador
      player.sprite.x = Math.max(0, Math.min(1200, player.sprite.x));
      player.sprite.y = Math.max(0, Math.min(800, player.sprite.y));

      // HUD
      stage.removeChild(stage.getChildByName("hud"));
      const hud = new createjs.Text(`Vida: ${Math.floor(player.vida)} | Pontos: ${player.pontos}`, "20px Arial", "#fff");
      hud.name = "hud";
      hud.x = 10;
      hud.y = 10;
      stage.addChild(hud);

      // Fim de jogo
      if (player.vida <= 0) {
        createjs.Ticker.removeAllEventListeners();

        ranking.push({ nome: player.nome, pontos: player.pontos });
        ranking.sort((a, b) => b.pontos - a.pontos);
        if (ranking.length > 5) ranking = ranking.slice(0, 5);

        const gameOver = new createjs.Text("GAME OVER", "40px Arial", "#f00");
        gameOver.x = 600;
        gameOver.y = 300;
        gameOver.textAlign = "center";
        stage.addChild(gameOver);

        const botaoVoltar = new createjs.Text("Voltar ao Menu", "24px Arial", "#0f0");
        botaoVoltar.x = 600;
        botaoVoltar.y = 400;
        botaoVoltar.textAlign = "center";
        botaoVoltar.cursor = "pointer";
        botaoVoltar.addEventListener("click", () => {
          stage.removeAllChildren();
          new Menu(stage, iniciarJogo, ranking);
        });
        stage.addChild(botaoVoltar);
      }

      stage.update();
    });
  }
};
