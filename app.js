window.application.screens['login-screen'] = renderLoginScreen;
window.application.screens['startGame-screen'] = renderStartGameScreen;

window.application.blocks['login-block'] = renderLoginBlock;
window.application.blocks['startGame-block'] = renderStartGameBlock;

window.application.blocks['login-button'] = renderLoginButton;
window.application.blocks['startGame-button'] = renderStartGameButton;

window.application.renderScreen('startGame-screen')


/* ********* БЛОК ЭКРАНА СТАРТА ********* */
function renderStartGameBlock(container) {
    const startGameTitle = document.createElement('h1');
    startGameTitle.textContent = 'Камень-ножницы-бумага';
    startGameTitle.classList.add('startGame-title');

    const startGameParagraph = document.createElement('p');
    startGameParagraph.textContent = 'Прописываем правила игры';
    startGameParagraph.classList.add('startGame-paragraph');

    container.appendChild(startGameTitle);
    container.appendChild(startGameParagraph);
}

function renderStartGameButton(container) {
    const startGameButton = document.createElement('button');
    startGameButton.textContent = 'Я понял правила, давай уже играть!';
    startGameButton.classList.add('startGame-button');

    startGameButton.addEventListener('click', event => {
        request('/ping', '', function (data) { //прописать бекэнд
            if (data.status === 'ok') {
                window.application.renderScreen('login-screen');
            }
            else {
                console.log('Проблемы с бекэндом'); //прописать стили и мб добавить блок при отсутствии соединения?
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

    loginButton.addEventListener('click', event => {
        if (loginInput.value !== '') {
            request('/login', loginInput.value, function (data) {
                //ставить setInterval пока не случится data.status === ok?
                if (data.status === 'ok') {
                    player.token = data.token
                    request('/player-status', { token: window.application.player.token }, function (element) {
                        if (element.player - status.status === 'lobby') { //при сохранении добавляет пробел, может отразиться на работе
                            window.application.renderScreen('lobby-screen');
                        }
                        if (element.player - status.status === 'game') {//при сохранении добавляет пробел, может отразиться на работе
                            window.application.renderScreen('turn-screen');
                        }
                        else {
                            console.log('Ошибка');
                        }
                    });
                }
            });
        }
        else {
            console.log('отсутствует логин'); //прописать стили и мб добавить блок при отсутствии логина?
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
    loginScreen.appendChild(authBlock)

    window.application.renderBlock('login-block', authBlock);
    window.application.renderBlock('login-button', authBlock);
}
