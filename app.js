// затягиваем аудио
let audioEl = document.querySelector('.audio');
const app = document.querySelector('.app');
const httpBack = 'http://localhost:3000';

//функция воспроизведения
function audioPlay() {
  if (audioEl.muted) {
    audioEl.muted = false;
    audioEl.play();
  } else {
    audioEl.muted = true;
    audioEl.pause();
  }
}

// Screens
window.application.screens['login-screen'] = renderLoginScreen;
window.application.screens['startGame-screen'] = renderStartGameScreen;
window.application.screens['lobby-screen'] = renderLobbyScreen;
window.application.screens['win-screen'] = renderWinScreen;
window.application.screens['fail-screen'] = renderFailScreen;

// Elements
window.application.blocks['login-block'] = renderLoginBlock;
window.application.blocks['startGame-block'] = renderStartGameBlock;
window.application.blocks['win-block'] = renderWinBlock;
window.application.blocks['fail-block'] = renderFailBlock;
window.application.blocks['lobby-block'] = renderLobbyBlock;

window.application.blocks['login-button'] = renderLoginButton;
window.application.blocks['startGame-button'] = renderStartGameButton;
window.application.blocks['lobby-button'] = renderLobbyButton;
window.application.blocks['play-button'] = renderPlayButton;
window.application.blocks['back-button'] = renderBackButton;

//Вызов
window.application.renderScreen('startGame-screen');

/* ********* БЛОК ЭКРАНА СТАРТА ********* */
function renderStartGameBlock(container) {
  const startGameTitle = document.createElement('h1');
  startGameTitle.textContent = 'Камень-ножницы-бумага';
  startGameTitle.classList.add('startGame-title');

  const startGameParagraph = document.createElement('img');
  startGameParagraph.src = './img/rules.png';
  startGameParagraph.classList.add('startGame-paragraph');

  container.appendChild(startGameTitle);
  container.appendChild(startGameParagraph);
}

function renderStartGameButton(container) {
  const startGameButton = document.createElement('button');
  startGameButton.textContent = 'Начать игру!';
  startGameButton.classList.add('startGame-button');
  startGameButton.classList.add('button');

  startGameButton.addEventListener('click', event => {
    startGameButton.disabled = true;

    request(httpBack + '/ping', '', function (data) {
      if (data.status === 'ok') {
        window.application.renderScreen('login-screen');
      } else {
        console.log(data.message);
      }
    });
  });
  container.appendChild(startGameButton);
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

/* ********* БЛОК ЭКРАНА РЕГИСТРАЦИИ ********* */

function renderLoginBlock(container) {
  const loginText = document.createElement('h1');
  loginText.textContent = 'Введите логин';

  loginText.classList.add('login-title');

  container.appendChild(loginText);
}

function renderLoginButton(container) {
  const loginInput = document.createElement('input');
  loginInput.classList.add('login-input');

  const loginButton = document.createElement('button');

  loginButton.textContent = 'ВОЙТИ';
  loginButton.classList.add('login-button');
  loginButton.classList.add('button');

  loginButton.addEventListener('click', event => {
    if (loginInput.value !== '') {
      loginButton.disabled = true;

      request(httpBack + '/login', { login: loginInput.value }, function (data) {
        //ставить setInterval пока не случится data.status === ok?
        if (data.status === 'ok') {
          window.application.player.token = data.token;
          request(httpBack + '/player-status', { token: window.application.player.token }, function (element) {
            if (element['player-status'].status === 'lobby') {
              window.application.renderScreen('lobby-screen');
            }
            if (element['player-status'].status === 'game') {
              window.application.renderScreen('turn');
            }
          });
        }
      });
    } else {
      alert(data.message);
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
}

// Lobby block text
function renderLobbyBlock(container) {
  const lobbyText = document.createElement('h1');
  const lobbyTextInfo = document.createElement('p');
  const lobbyBlockText = document.createElement('textarea');
  
  request(httpBack+'/player-list', {token: window.application.player.token}, function (element) {
    if (element.status === 'ok') {
      lobbyBlockText.value = '';
      lobbyText.textContent = '';
      element.list.forEach(function(item, i, element) {
        console.log(item);
        lobbyBlockText.value +=  `${item.login} (${item.wins} / ${item.loses})\n`;
        if(item.you){
          lobbyText.textContent = `${item.login}`;
          lobbyTextInfo.textContent = `ПОБЕД ${item.wins} / ПОРАЖЕНИЙ ${item.loses}`;
        }
      });
    }
    lobbyBlockText.readOnly = true;
  });


  //lobbyText.textContent = 'GAMER: Nick, Wins, Fails';
  lobbyText.classList.add('win-title');
  lobbyBlockText.classList.add('lobby-list');

  container.appendChild(lobbyText);
  container.appendChild(lobbyTextInfo);
  container.appendChild(lobbyBlockText);
}

// Lobby Screen Fn ////////////////
function renderLobbyScreen() {
  app.textContent = '';
  const lobbyScreen = document.createElement('div');
  lobbyScreen.classList.add('lobby-screen');

  app.appendChild(lobbyScreen);
  window.application.renderBlock('lobby-block', lobbyScreen);
  window.application.renderBlock('play-button', lobbyScreen);
  window.application.renderBlock('back-button', lobbyScreen);

  const replayButton = document.querySelector('.play-button');
  replayButton.textContent = 'Играть';
}

function renderWinBlock(container) {
  const winText = document.createElement('h1');

  winText.textContent = 'Ты победил!';
  winText.classList.add('result-title');

  container.appendChild(winText);
}

function renderFailBlock(container) {
  const loserText = document.createElement('h1');
  loserText.textContent = 'LOSER';
  loserText.classList.add('loser-text');

  const failText = document.createElement('h1');
  failText.textContent = 'Ты проиграл!';

  failText.classList.add('result-title');

  container.appendChild(loserText);
  container.appendChild(failText);
}

function renderLobbyButton(container) {
  const lobbyButton = document.createElement('button');
  lobbyButton.textContent = 'Перейти в лобби';

  lobbyButton.classList.add('lobby-button');
  lobbyButton.classList.add('button');

  lobbyButton.addEventListener('click', event => {
    disableAllButtons(container);

    window.application.renderScreen('lobby-screen');
  });

  container.appendChild(lobbyButton);
}
// Play button in lobby
function renderPlayButton(container) {
  const playButton = document.createElement('button');

  playButton.textContent = 'Играть!';
  playButton.classList.add('play-button');
  playButton.classList.add('button');

  playButton.addEventListener('click', event => {
    disableAllButtons(container);

    request(httpBack + '/start', { token: window.application.player.token }, function (data) {
      if (data.status === 'ok') {
        window.application.player.gameId = data['player-status'].game.id;
        window.application.renderScreen('waiting-game-screen');
      }
      if (data.status === 'error') {
        alert(data.message);
      }
    });
  });

  container.appendChild(playButton);
}

function renderBackButton(container) {
  const backButton = document.createElement('button');

  backButton.textContent = 'НАЗАД';
  backButton.classList.add('button');
  backButton.addEventListener('click', event => {
    backButton.disabled = true;

    window.application.renderScreen('login-screen');
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

  renderResultImage(winScreen, 'img/laurel.png');

  window.application.renderBlock('win-block', winScreen);
  window.application.renderBlock('lobby-button', winScreen);
  window.application.renderBlock('play-button', winScreen);

  const replayButton = document.querySelector('.play-button');
  replayButton.textContent = 'Играть еще!';
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
  replayButton.textContent = 'Играть еще!';
}

window.application.screens['turn'] = renderTurnScreen;
window.application.screens['double-turn'] = renderDoubleTurnScreen;
window.application.screens['waiting-enemy-screen'] = renderWaitingTurnScreen;

window.application.blocks['turn-block'] = renderTurnBlock;
window.application.blocks['double-turn-block'] = renderDoubleTurnBlock;
window.application.blocks['stone-button'] = renderStoneButton;
window.application.blocks['scissors-button'] = renderScissorsButton;
window.application.blocks['papper-button'] = renderPapperButton;

function turnCheck() {
  request(httpBack + '/game-status', { token: window.application.player.token, id: window.application.player.gameId }, function (data) {
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
  turnText.textContent = 'Твой Ход';
  turnText.classList.add('turn-block');
  container.appendChild(turnText);
}

function renderDoubleTurnBlock(container) {
  const doubleTurnUpText = document.createElement('h1');
  const doubleTurnBottomText = document.createElement('h2');
  doubleTurnUpText.textContent = 'Да вы мылите одинаково!';
  doubleTurnBottomText.textContent = 'Давай еще разок';
  doubleTurnUpText.classList.add('turn-block');
  doubleTurnBottomText.classList.add('turn-block');
  container.appendChild(doubleTurnUpText);
  container.appendChild(doubleTurnBottomText);
}

function renderStoneButton(container) {
  const stoneButton = document.createElement('button');
  stoneButton.textContent = 'Камень';
  stoneButton.classList.add('stone-button');
  stoneButton.classList.add('button');
  container.appendChild(stoneButton);

  stoneButton.addEventListener('click', e => {
    disableAllButtons(container);

    request(httpBack + '/play', { token: window.application.player.token, id: window.application.player.gameId, move: 'rock' }, function (data) {
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
      }
    });
  });
}

function renderScissorsButton(container) {
  const scissorsButton = document.createElement('button');
  scissorsButton.textContent = 'Ножницы';
  scissorsButton.classList.add('scissors-button');
  scissorsButton.classList.add('button');
  container.appendChild(scissorsButton);

  scissorsButton.addEventListener('click', e => {
    disableAllButtons(container);

    request(httpBack + '/play', { token: window.application.player.token, id: window.application.player.gameId, move: 'scissors' }, function (data) {
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
      }
    });
  });
}
function renderPapperButton(container) {
  const papperButton = document.createElement('button');
  papperButton.textContent = 'Бумага';
  papperButton.classList.add('papper-button');
  papperButton.classList.add('button');
  container.appendChild(papperButton);

  papperButton.addEventListener('click', e => {
    disableAllButtons(container);

    request(httpBack + '/play', { token: window.application.player.token, id: window.application.player.gameId, move: 'paper' }, function (data) {
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

function renderWaitingTurnScreen() {
  app.textContent = '';
  const waitingTurnScreen = document.createElement('div');
  waitingTurnScreen.classList.add('waiting-enemy-block');
  waitingTurnScreen.classList.add('loader');
  waitingTurnScreen.classList.add('screen');
  app.appendChild(waitingTurnScreen);

  window.application.timers.push(setInterval(turnCheck, 500));
}

window.application.screens['waiting-game-screen'] = renderWaitingGameScreen;

window.application.blocks['waiting-game-block'] = renderWaitingGameBlock;

function waitingForStart() {
  request(httpBack + '/game-status', { token: window.application.player.token, id: window.application.player.gameId }, function (data) {
    if (data.status === 'error') {
      console.log(data.status + ' ' + data.message);
    } else {
      let gameStatus = data['game-status'];
      if (gameStatus.status !== 'waiting-for-start') {
        window.application.renderScreen('turn');
      }
    }
  });
}

function renderWaitingGameBlock(container) {
  const waitingGameText = document.createElement('h1');
  waitingGameText.textContent = 'Идет поиск противника..';
  waitingGameText.classList.add('waiting-game-block');
  container.appendChild(waitingGameText);
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
}

function disableAllButtons(container) {
  const allButtons = container.querySelectorAll('.button');

  for (let currentButton of allButtons) {
    currentButton.disabled = true;
    currentButton.classList.remove('hover');
  }
}
