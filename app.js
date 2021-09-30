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
  startGameButton.textContent = 'Начнем игру!';
  startGameButton.classList.add('startGame-button');
  startGameButton.classList.add('button');

  startGameButton.addEventListener('click', event => {
    request('http://localhost:3000/ping', '', function (data) {
      if (data.status === 'ok') {
        window.application.renderScreen('login-screen');
      }
    });
  });
  container.appendChild(startGameButton);
}

function renderStartGameScreen() {
  const app = document.querySelector('.app');
  app.textContent = '';

  const startGameScreen = document.createElement('div');
  startGameScreen.classList.add('startGame-screen');

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
  loginButton.textContent = 'Зарегистрировать/проверить игрока';
  loginButton.classList.add('play-button');
  loginButton.classList.add('button');

  loginButton.addEventListener('click', event => {
    if (loginInput.value !== '') {
      request('http://localhost:3000/login', { login: loginInput.value }, function (data) {
        if (data.status === 'ok') {
          window.application.player.token = data.token;
          request('http://localhost:3000/player-status', { token: window.application.player.token }, function (element) {
            if (element['player-status'].status === 'lobby') {
              window.application.renderScreen('lobby-screen');
            }
            if (element['player-status'].status === 'game') {
              window.application.renderScreen('turn-screen');
            }
          });
        }
        else {
          console.log(data.messague);
        }
      });
    } else {
      console.log(data.messague);
    }
  });
  container.appendChild(loginInput);
  container.appendChild(loginButton);
}

function renderLoginScreen() {
  const app = document.querySelector('.app');
  app.textContent = '';

  const loginScreen = document.createElement('div');
  loginScreen.classList.add('login-screen');
  app.appendChild(loginScreen);

  const authBlock = document.createElement('div');
  authBlock.classList.add('authorization-block');
  loginScreen.appendChild(authBlock);

  window.application.renderBlock('login-block', authBlock);
  window.application.renderBlock('login-button', authBlock);
}
