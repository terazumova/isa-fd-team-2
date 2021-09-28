// затягиваем аудио
let audioEl = document.querySelector(".audio");
const app = document.querySelector(".app");

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
window.application.screens["lobby-screen"] = renderLobbyScreen;
window.application.screens["win-screen"] = renderWinScreen;
window.application.screens["fail-screen"] = renderFailScreen;

// Elements
window.application.blocks["win-block"] = renderWinBlock;
window.application.blocks["fail-block"] = renderFailBlock;
window.application.blocks["lobby-block"] = renderLobbyBlock;

window.application.blocks["lobby-button"] = renderLobbyButton;
window.application.blocks["play-button"] = renderPlayButton;

//Вызов
window.application.renderScreen("lobby-screen");

// Lobby block text
function renderLobbyBlock(container) {
  const winText = document.createElement("h1");
  const winBlockText = document.createElement("textarea");
  winText.textContent = "GAMER: Nick, Wins, Fails";
  winText.classList.add("win-title");
  winBlockText.classList.add("lobby-list");
  container.appendChild(winText);
  container.appendChild(winBlockText);
}

// Lobby Screen Fn ////////////////
function renderLobbyScreen() {
  app.textContent = "";
  const winScreen = document.createElement("div");
  winScreen.classList.add("lobby-screen");
  app.appendChild(winScreen);
  window.application.renderBlock("lobby-block", winScreen);
  //window.application.renderBlock("lobby-button", winScreen);
  window.application.renderBlock("play-button", winScreen);
  const replayButton = document.querySelector(".play-button");
  replayButton.textContent = "ИГРАТЬ";
}

// Fail Screen Fn
function renderFailScreen() {
  const app = document.querySelector(".app");
  app.textContent = "";
  const failScreen = document.createElement("div");
  failScreen.classList.add("fail-screen");
  app.appendChild(failScreen);
  window.application.renderBlock("fail-block", failScreen);
  window.application.renderBlock("lobby-button", failScreen);
  window.application.renderBlock("play-button", failScreen);
  const replayButton = document.querySelector(".play-button");
  replayButton.textContent = "Играть еще!";
}

function renderWinBlock(container) {
  const winText = document.createElement("h1");
  winText.textContent = "Вы победили!";

  winText.classList.add("result-title");

  container.appendChild(winText);
}

function renderFailBlock(container) {
  const failText = document.createElement("h1");
  failText.textContent = "Вы проиграли!";

  failText.classList.add("result-title");

  container.appendChild(failText);
}

function renderLobbyButton(container) {
  const lobbyButton = document.createElement("button");
  lobbyButton.textContent = "Перейти в лобби";

  lobbyButton.classList.add("button lobby-button");

  lobbyButton.addEventListener("click", event => {
    window.application.renderScreen("lobby-screen");
  });

  container.appendChild(lobbyButton);
}

function renderPlayButton(container) {
  const playButton = document.createElement("button");
  playButton.textContent = "Играть!";

  playButton.classList.add("button play-button");

  playButton.addEventListener("click", event => {
    // request("/start", { token: window.application.token }, function (data) {
    //   if (data.status === "ok") {
    //     window.application.gameId = data["player-status"].game.id;
    //     window.application.renderScreen("waiting-enemy-screen");
    //   }
    // });
    window.application.renderScreen("waiting-enemy-screen");
  });

  container.appendChild(playButton);
}

function renderResultImage(container, imagePath) {
  const image = document.createElement("img");
  image.setAttribute("src", imagePath);
  image.classList.add("result-image");
  container.appendChild(image);
}

function renderWinScreen() {
  const app = document.querySelector(".app");
  app.textContent = "";

  const winScreen = document.createElement("div");
  winScreen.classList.add("win-screen");

  app.appendChild(winScreen);

  renderResultImage(winScreen, "img/happy.png");

  window.application.renderBlock("win-block", winScreen);
  window.application.renderBlock("lobby-button", winScreen);
  window.application.renderBlock("play-button", winScreen);

  const replayButton = document.querySelector(".play-button");
  replayButton.textContent = "Играть еще!";
}

function renderFailScreen() {
  const app = document.querySelector(".app");
  app.textContent = "";

  const failScreen = document.createElement("div");
  failScreen.classList.add("fail-screen");

  app.appendChild(failScreen);

  renderResultImage(failScreen, "img/sad.png");

  window.application.renderBlock("fail-block", failScreen);
  window.application.renderBlock("lobby-button", failScreen);
  window.application.renderBlock("play-button", failScreen);

  const replayButton = document.querySelector(".play-button");
  replayButton.textContent = "Играть еще!";
}
