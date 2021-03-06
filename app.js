let audioEl = document.querySelector('.audio');
const app = document.querySelector('.app');

function audioPlay() {
  if (audioEl.muted) {
    audioEl.muted = false;
    audioEl.play();
  } else {
    audioEl.muted = true;
    audioEl.pause();
  }
}

// Screens
window.application.screens['login-screen'] = renderLoginScreen;
window.application.screens['startGame-screen'] = renderStartGameScreen;
window.application.screens['lobby-screen'] = renderLobbyScreen;
window.application.screens['win-screen'] = renderWinScreen;
window.application.screens['fail-screen'] = renderFailScreen;
window.application.screens['turn'] = renderTurnScreen;
window.application.screens['double-turn'] = renderDoubleTurnScreen;
window.application.screens['waiting-enemy-screen'] = renderWaitingTurnScreen;
window.application.screens['waiting-game-screen'] = renderWaitingGameScreen;
window.application.screens['vs-screen'] = renderVsScreen;

// Elements
window.application.blocks['login-block'] = renderLoginBlock;
window.application.blocks['startGame-block'] = renderStartGameBlock;
window.application.blocks['win-block'] = renderWinBlock;
window.application.blocks['fail-block'] = renderFailBlock;
window.application.blocks['lobby-block'] = renderLobbyBlock;
window.application.blocks['turn-block'] = renderTurnBlock;
window.application.blocks['double-turn-block'] = renderDoubleTurnBlock;
window.application.blocks['waiting-game-block'] = renderWaitingGameBlock;
window.application.blocks['waiting-turn-block'] = renderWaitingTurnBlock;
window.application.blocks['vs-block'] = renderVsBlock;

window.application.blocks['login-button'] = renderLoginButton;
window.application.blocks['startGame-button'] = renderStartGameButton;
window.application.blocks['lobby-button'] = renderLobbyButton;
window.application.blocks['play-button'] = renderPlayButton;
window.application.blocks['back-button'] = renderBackButton;
window.application.blocks['stone-button'] = renderStoneButton;
window.application.blocks['scissors-button'] = renderScissorsButton;
window.application.blocks['papper-button'] = renderPapperButton;

window.application.renderScreen('startGame-screen');

function renderStartGameBlock(container) {
  const startGameTitle = document.createElement('h1');
  startGameTitle.textContent = 'КАМЕНЬ-НОЖНИЦЫ-БУМАГА';
  startGameTitle.classList.add('startGame-title');

  container.appendChild(startGameTitle);
}

function renderStartGameButton(container) {
  const startGameParagraph = document.createElement('img');
  startGameParagraph.src = './img/rules.webp';
  startGameParagraph.classList.add('startGame-paragraph');

  container.appendChild(startGameParagraph);

  startGameParagraph.addEventListener('click', event => {
    request('/ping', '', function (data) {
      if (data.status === 'ok') {
        window.application.renderScreen('login-screen');
      } else {
        console.log(data.message);
      }
    });
  });
}

function renderStartGameScreen() {
  app.textContent = '';

  const startGameScreen = document.createElement('div');
  startGameScreen.classList.add('startGame-screen');
  startGameScreen.classList.add('screen');

  app.appendChild(startGameScreen);

  window.application.renderBlock('startGame-block', startGameScreen);
  window.application.renderBlock('startGame-button', startGameScreen);
}

function renderLoginBlock(container) {
  const loginText = document.createElement('h1');
  loginText.textContent = 'ВВЕДИТЕ ВАШ НИКНЕЙМ';

  loginText.classList.add('login-title');

  container.appendChild(loginText);
}

function renderLoginButton(container) {
  const loginInput = document.createElement('input');
  loginInput.classList.add('login-input');
  loginInput.addEventListener('input', e => {
    e.target.value = e.target.value.substr(0, 8);
  });

  const loginButton = document.createElement('button');

  loginButton.textContent = 'ВОЙТИ';
  loginButton.classList.add('login-button');
  loginButton.classList.add('button');

  loginButton.addEventListener('click', event => {
    if (loginInput.value !== '') {
      loginButton.disabled = true;

      request('/login', { login: loginInput.value }, function (data) {
        if (data.status === 'ok') {
          window.application.player.token = data.token;
          request('/player-status', { token: window.application.player.token }, function (element) {
            if (element['player-status'].status === 'lobby') {
              window.application.renderScreen('lobby-screen');
            }
            if (element['player-status'].status === 'game' && element['player-status'].game.id !== '') {
              window.application.player.gameId = element['player-status'].game.id;
              request('/game-status', { token: window.application.player.token, id: window.application.player.gameId }, function (element) {
                if (element['game-status'].status === 'waiting-for-start') {
                  window.application.renderScreen('waiting-game-screen');
                }
                if (element['game-status'].status === 'waiting-your-move') {
                  window.application.renderScreen('turn');
                }
                if (element['game-status'].status === 'waiting-for-enemy-move') {
                  window.application.renderScreen('waiting-enemy-screen');
                }
                if (element['game-status'].status === 'lose') {
                  window.application.renderScreen('fail-screen');
                }
                if (element['game-status'].status === 'win') {
                  window.application.renderScreen('win-screen');
                }
              });
            } else {
              window.application.renderScreen('lobby-screen');
            }
          });
        }
      });
    } else {
      alert('Заполните логин');
      loginButton.disabled = false;
    }
  });
  container.appendChild(loginInput);
  container.appendChild(loginButton);
}

function renderLoginScreen() {
  app.textContent = '';

  const loginScreen = document.createElement('div');
  loginScreen.classList.add('login-screen');
  loginScreen.classList.add('screen');
  app.appendChild(loginScreen);

  const authBlock = document.createElement('div');
  authBlock.classList.add('authorization-block');
  loginScreen.appendChild(authBlock);

  window.application.renderBlock('login-block', authBlock);
  window.application.renderBlock('login-button', authBlock);
  document.querySelector('.login-input').focus()
}

function renderLobbyBlock(container) {
  const lobbyText = document.createElement('h1');
  const lobbyTextInfo = document.createElement('p');
  lobbyTextInfo.classList.add('list-players');
  const lobbyBlockText = document.createElement('textarea');

  function refreshLobby() {
    request('/player-list', { token: window.application.player.token }, function (element) {
      if (element.status === 'ok') {
        lobbyBlockText.value = '';
        lobbyText.textContent = '';
        element.list.forEach(function (item, i, element) {
          lobbyBlockText.value += `${item.login} (W ${item.wins} / L ${item.loses})\n`;
          if (item.you) {
            lobbyText.textContent = `${item.login}`;
            lobbyTextInfo.textContent = `ПОБЕД ${item.wins} / ПОРАЖЕНИЙ ${item.loses}`;
          }
        });
      }
      lobbyBlockText.readOnly = true;
    });
    lobbyText.classList.add('win-title');
    lobbyBlockText.classList.add('lobby-list');

    container.appendChild(lobbyText);
    container.appendChild(lobbyTextInfo);
    container.appendChild(lobbyBlockText);
  }
  window.application.timers.push(setInterval(refreshLobby, 1000));
}

//lobbyText.textContent = 'GAMER: Nick, Wins, Fails';

// Lobby Screen Fn ////////////////
function renderLobbyScreen() {
  app.textContent = '';
  const lobbyScreen = document.createElement('div');
  lobbyScreen.classList.add('lobby-screen');
  const lobbyArea = document.createElement('div');

  app.appendChild(lobbyScreen);
  lobbyScreen.appendChild(lobbyArea);

  window.application.renderBlock('lobby-block', lobbyArea);
  window.application.renderBlock('play-button', lobbyScreen);
  window.application.renderBlock('back-button', lobbyScreen);

  const replayButton = document.querySelector('.play-button');
  replayButton.textContent = 'ИГРАТЬ';
}

function renderWinBlock(container) {
  const winText = document.createElement('h1');

  winText.textContent = 'ТЫ ПОБЕДИЛ!';
  winText.classList.add('result-title');

  container.appendChild(winText);
}

function renderFailBlock(container) {
  const loserText = document.createElement('h1');
  loserText.textContent = 'WASTED';
  loserText.classList.add('loser-text');

  const failText = document.createElement('h1');
  failText.textContent = 'ТЫ ПРОИГРАЛ!';

  failText.classList.add('result-title');

  container.appendChild(loserText);
  container.appendChild(failText);
}

function renderLobbyButton(container) {
  const lobbyButton = document.createElement('button');
  lobbyButton.textContent = 'ПЕРЕЙТИ В ЛОББИ';

  lobbyButton.classList.add('lobby-button');
  lobbyButton.classList.add('button');

  lobbyButton.addEventListener('click', event => {
    disableAllButtons(container, true);

    window.application.renderScreen('lobby-screen');
  });

  container.appendChild(lobbyButton);
}

function renderPlayButton(container) {
  const playButton = document.createElement('button');

  playButton.textContent = 'ИГРАТЬ!';
  playButton.classList.add('play-button');
  playButton.classList.add('button');
  playButton.classList.add('shake');

  playButton.addEventListener('click', event => {
    disableAllButtons(container, true);

    request('/start', { token: window.application.player.token }, function (data) {
      if (data.status === 'ok') {
        window.application.player.gameId = data['player-status'].game.id;
        window.application.renderScreen('waiting-game-screen');
      }
      if (data.status === 'error') {
        alert(data.message);

        disableAllButtons(container, false);
      }
    });
  });

  container.appendChild(playButton);
}

function renderBackButton(container) {
  const backButton = document.createElement('button');

  backButton.textContent = 'ВЫЙТИ';
  backButton.classList.add('button');
  backButton.addEventListener('click', event => {
    request('/logout', { token: window.application.player.token }, function (data) {
      disableAllButtons(container, true);

      window.application.renderScreen('login-screen');
    });
  });
  container.appendChild(backButton);
}

function renderResultImage(container, imagePath) {
  const image = document.createElement('img');
  image.setAttribute('src', imagePath);
  image.classList.add('result-image');
  container.appendChild(image);
}

function renderWinScreen() {
  app.textContent = '';

  const winScreen = document.createElement('div');
  winScreen.classList.add('win-screen');
  winScreen.classList.add('screen');

  app.appendChild(winScreen);

  renderResultImage(winScreen, 'img/laurel.webp');

  window.application.renderBlock('win-block', winScreen);
  window.application.renderBlock('lobby-button', winScreen);
  window.application.renderBlock('play-button', winScreen);

  const replayButton = document.querySelector('.play-button');
  replayButton.textContent = 'ИГРАТЬ ЕЩЕ!';
}

function renderFailScreen() {
  app.textContent = '';

  const failScreen = document.createElement('div');
  failScreen.classList.add('fail-screen');
  failScreen.classList.add('screen');

  app.appendChild(failScreen);

  window.application.renderBlock('fail-block', failScreen);
  window.application.renderBlock('lobby-button', failScreen);
  window.application.renderBlock('play-button', failScreen);

  const replayButton = document.querySelector('.play-button');
  replayButton.textContent = 'ИГРАТЬ ЕЩЕ!';
}

function turnCheck() {
  request('/game-status', { token: window.application.player.token, id: window.application.player.gameId }, function (data) {
    if (data.status === 'error') {
      console.log(data.status + data.messague);
    } else {
      let gameStatus = data['game-status'];
      if (gameStatus.status === 'win') {
        window.application.renderScreen('win-screen');
      } else if (gameStatus.status === 'lose') {
        window.application.renderScreen('fail-screen');
      } else if (gameStatus.status === 'waiting-for-your-move') {
        window.application.renderScreen('double-turn');
      }
    }
  });
}

function renderTurnBlock(container) {
  const turnText = document.createElement('h1');
  turnText.textContent = 'ТВОЙ ХОД';
  turnText.classList.add('turn-block');
  container.appendChild(turnText);

  const enemyLogin = document.createElement('h2');
  let reserve = JSON.parse(localStorage.getItem('myStorage'));
  if (window.application.player.gameId === '') {
    window.application.player.token = reserve.player.token;
    window.application.player.gameId = reserve.player.gameId;
  }
  request('/game-status', { token: window.application.player.token, id: window.application.player.gameId }, function (data) {
    if (data.status !== 'error') {
      let gameStatus = data['game-status'];
      let enemy = gameStatus.enemy.login;

      const enemyName = document.createElement('span');
      enemyName.classList.add('enemy-name--red');
      enemyName.textContent = enemy;

      enemyLogin.append('ТВОЙ ПРОТИВНИК : ', enemyName);
    }
    else {
      alert('Ошибка сервера')
      window.application.renderScreen('login-screen');
    }
  });
  enemyLogin.classList.add('turn-block');
  container.appendChild(enemyLogin);
}

function renderDoubleTurnBlock(container) {
  const doubleTurnUpText = document.createElement('h1');
  const doubleTurnBottomText = document.createElement('h2');
  doubleTurnBottomText.textContent = 'ДАВАЙ ЕЩЕ РАЗОК';
  doubleTurnUpText.classList.add('turn-block');
  doubleTurnBottomText.classList.add('turn-block');
  container.appendChild(doubleTurnUpText);
  container.appendChild(doubleTurnBottomText);

  request('/game-status', { token: window.application.player.token, id: window.application.player.gameId }, function (data) {
    let gameStatus = data['game-status'];
    let enemy = gameStatus.enemy.login;
    const enemyName = document.createElement('span');
    enemyName.classList.add('enemy-name--red');
    enemyName.textContent = enemy;

    doubleTurnUpText.append('ДА ВЫ С ', enemyName, ' МЫСЛИТЕ ОДИНАКОВО!');
  });
}

function renderStoneButton(container) {
  const stoneButton = document.createElement('button');
  stoneButton.textContent = 'КАМЕНЬ';
  stoneButton.classList.add('stone-button');
  stoneButton.classList.add('button');
  container.appendChild(stoneButton);

  stoneButton.addEventListener('click', e => {
    disableAllButtons(container, true);

    request('/play', { token: window.application.player.token, id: window.application.player.gameId, move: 'rock' }, function (data) {
      if (data.status !== 'error') {
        let gameStatus = data['game-status'];
        if (gameStatus.status === 'waiting-for-enemy-move') {
          window.application.renderScreen('waiting-enemy-screen');
        } else if (gameStatus.status === 'win') {
          window.application.renderScreen('win-screen');
        } else if (gameStatus.status === 'lose') {
          window.application.renderScreen('fail-screen');
        } else if (gameStatus.status === 'waiting-for-your-move') {
          window.application.renderScreen('double-turn');
        }
      } else {
        console.log(data.status + ' ' + data.message);
        request('/logout', { token: window.application.player.token }, function (data) {
          disableAllButtons(container, true);
          alert('Ошибка сервера')
          window.application.player.token = ''
          window.application.player.gameId = ''
          window.application.renderScreen('login-screen');
        })
      }
    });
  });
}



function renderScissorsButton(container) {
  const scissorsButton = document.createElement('button');
  scissorsButton.textContent = 'НОЖНИЦЫ';
  scissorsButton.classList.add('scissors-button');
  scissorsButton.classList.add('button');
  container.appendChild(scissorsButton);

  scissorsButton.addEventListener('click', e => {
    disableAllButtons(container, true);

    request('/play', { token: window.application.player.token, id: window.application.player.gameId, move: 'scissors' }, function (data) {
      if (data.status !== 'error') {
        let gameStatus = data['game-status'];
        if (gameStatus.status === 'waiting-for-enemy-move') {
          window.application.renderScreen('waiting-enemy-screen');
        } else if (gameStatus.status === 'win') {
          window.application.renderScreen('win-screen');
        } else if (gameStatus.status === 'lose') {
          window.application.renderScreen('fail-screen');
        } else if (gameStatus.status === 'waiting-for-your-move') {
          window.application.renderScreen('double-turn');
        }
      } else {
        console.log(data.status + ' ' + data.message);
        request('/logout', { token: window.application.player.token }, function (data) {
          disableAllButtons(container, true);
          alert('Ошибка сервера')
          window.application.player.token = ''
          window.application.player.gameId = ''
          window.application.renderScreen('login-screen');
        })
      }
    });
  });
}

function renderPapperButton(container) {
  const papperButton = document.createElement('button');
  papperButton.textContent = 'БУМАГА';
  papperButton.classList.add('papper-button');
  papperButton.classList.add('button');
  container.appendChild(papperButton);

  papperButton.addEventListener('click', e => {
    disableAllButtons(container, true);

    request('/play', { token: window.application.player.token, id: window.application.player.gameId, move: 'paper' }, function (data) {
      if (data.status !== 'error') {
        let gameStatus = data['game-status'];
        if (gameStatus.status === 'waiting-for-enemy-move') {
          window.application.renderScreen('waiting-enemy-screen');
        } else if (gameStatus.status === 'win') {
          window.application.renderScreen('win-screen');
        } else if (gameStatus.status === 'lose') {
          window.application.renderScreen('fail-screen');
        } else if (gameStatus.status === 'waiting-for-your-move') {
          window.application.renderScreen('double-turn');
        }
      } else {
        console.log(data.status + ' ' + data.message);
        request('/logout', { token: window.application.player.token }, function (data) {
          disableAllButtons(container, true);
          alert('Ошибка сервера')
          window.application.player.token = ''
          window.application.player.gameId = ''
          window.application.renderScreen('login-screen');
        });
      }
    });
  });
}

function renderTurnScreen() {
  app.textContent = '';
  const turnScreen = document.createElement('div');
  turnScreen.classList.add('turn-screen');
  turnScreen.classList.add('screen');
  app.appendChild(turnScreen);

  window.application.renderBlock('turn-block', turnScreen);
  window.application.renderBlock('stone-button', turnScreen);
  window.application.renderBlock('scissors-button', turnScreen);
  window.application.renderBlock('papper-button', turnScreen);
}

function renderDoubleTurnScreen() {
  app.textContent = '';
  const doubleTurnScreen = document.createElement('div');
  doubleTurnScreen.classList.add('turn-screen');
  doubleTurnScreen.classList.add('screen');
  app.appendChild(doubleTurnScreen);

  window.application.renderBlock('double-turn-block', doubleTurnScreen);
  window.application.renderBlock('stone-button', doubleTurnScreen);
  window.application.renderBlock('scissors-button', doubleTurnScreen);
  window.application.renderBlock('papper-button', doubleTurnScreen);
}

function renderWaitingTurnBlock(container) {
  const waitingGameText = document.createElement('h1');
  waitingGameText.textContent = 'ОЖИДАНИЕ ПРОТИВНИКА..';
  waitingGameText.classList.add('waiting-game-block');
  container.appendChild(waitingGameText);
}

function renderWaitingTurnScreen() {
  app.textContent = '';
  const waitingTurnScreen = document.createElement('div');
  waitingTurnScreen.classList.add('waiting-enemy-block');
  waitingTurnScreen.classList.add('loader');
  waitingTurnScreen.classList.add('screen');

  app.appendChild(waitingTurnScreen);

  window.application.renderBlock('waiting-turn-block', waitingTurnScreen);

  window.application.timers.push(setInterval(turnCheck, 500));

  setTimeout(() => {
    window.application.renderBlock('back-button', waitingTurnScreen);
  }, 10000);
}

function waitingForStart() {
  request('/game-status', { token: window.application.player.token, id: window.application.player.gameId }, function (data) {
    if (data.status === 'error') {
      console.log(data.status + ' ' + data.message);
    } else {
      let gameStatus = data['game-status'];
      if (gameStatus.status !== 'waiting-for-start') {
        window.application.renderScreen('vs-screen');
      }
    }
  });
}

function renderVsBlock(container) {
  const vsText1 = document.createElement('h1');
  vsText1.classList.add('enemy-name');
  const vsText2 = document.createElement('h1');
  vsText2.classList.add('enemy-name');

  container.appendChild(vsText1);
  container.appendChild(vsText2);
  request('/game-status', { token: window.application.player.token, id: window.application.player.gameId }, function (data) {
    vsText1.textContent = `ТВОЙ ПРОТИВНИК :`;
    vsText2.textContent = data['game-status'].enemy.login;
  });
}

function renderVsScreen() {
  app.textContent = '';
  const vsScreen = document.createElement('div');
  vsScreen.classList.add('screen');

  app.appendChild(vsScreen);

  window.application.renderBlock('vs-block', vsScreen);

  setTimeout(() => {
    window.application.renderScreen('turn');
  }, 3000);
}

function renderWaitingGameBlock(container) {
  const waitingGameText = document.createElement('h1');
  waitingGameText.textContent = 'ИДЕТ ПОИСК ПРОТИВНИКА..';
  waitingGameText.classList.add('waiting-game-block');
  container.appendChild(waitingGameText);
  localStorage.setItem('myStorage', JSON.stringify(window.application))
}

function renderWaitingGameScreen() {
  app.textContent = '';

  const waitingGameScreen = document.createElement('div');
  waitingGameScreen.classList.add('waiting-game-screen');
  waitingGameScreen.classList.add('loader');
  waitingGameScreen.classList.add('screen');
  app.appendChild(waitingGameScreen);

  window.application.renderBlock('waiting-game-block', waitingGameScreen);
  window.application.timers.push(setInterval(waitingForStart, 500));
  setTimeout(() => {
    window.application.renderBlock('back-button', waitingGameScreen);
  }, 10000);
}

function disableAllButtons(container, isTrue) {
  const allButtons = container.querySelectorAll('.button');

  for (let currentButton of allButtons) {
    currentButton.disabled = isTrue;
  }
}
