const app = document.querySelector('.app')

window.application.screens['turn'] = renderTurnScreen
window.application.screens['double-turn'] = renderDoubleTurnScreen
window.application.screens['waiting-enemy-screen'] = renderWaitingTurnScreen

window.application.blocks['turn-block'] = renderTurnBlock
window.application.blocks['double-turn-block'] = renderDoubleTurnBlock
window.application.blocks['stone-button'] = renderStoneButton
window.application.blocks['scissors-button'] = renderScissorsButton
window.application.blocks['papper-button'] = renderPapperButton

window.application.renderScreen('turn')

function turnCheck(){
  request("/game-status", {token: window.application.player.token}, {id: window.application.player.token}, function(data){
    if (data.status === "error"){
      console.log(data.messague)
    } else{
      let gameStatus = data[game-status]
      if(gameStatus.status === "win") {
          window.application.renderScreen('win-screen')
        }else if(gameStatus.status === "lose"){
          window.application.renderScreen('fail-screen')
        }else if(gameStatus.status === "waiting-for-your-move"){
          window.application.renderScreen('double-turn')}


    }
  })
}

function renderTurnBlock(container){
  const turnText = document.createElement('h1')
  turnText.textContent = 'Твой Ход'
  turnText.classList.add('turn-block')
  container.appendChild(turnText)
}

function renderDoubleTurnBlock(container){
  const doubleTurnUpText = document.createElement('h1')
  const doubleTurnBottomText = document.createElement('h2')
  doubleTurnUpText.textContent = 'Да вы мылите одинаково!'
  doubleTurnBottomText.textContent = 'Давай еще разок'
  doubleTurnUpText.classList.add('turn-block')
  doubleTurnBottomText.classList.add('turn-block')
  container.appendChild(doubleTurnUpText)
  container.appendChild(doubleTurnBottomText)
}


function renderStoneButton(container){
  const stoneButton = document.createElement('button')
  stoneButton.textContent = 'Камень'
  stoneButton.classList.add('stone-button')
  container.appendChild(stoneButton)

  stoneButton.addEventListener('click', e =>{
        request("/play", {token: window.application.player.token}, {id: window.application.player.token}, "move=rock", function (data) {
      if (data.status !== "error"){
        let gameStatus = data[game-status]
        if (gameStatus.status === "waiting-for-enemy-move") {
          window.application.renderScreen('waiting-enemy-screen')
        }else if(gameStatus.status === "win") {
          window.application.renderScreen('win-screen')
        }else if(gameStatus.status === "lose"){
          window.application.renderScreen('fail-screen')
        }else if(gameStatus.status === "waiting-for-your-move"){
          window.application.renderScreen('double-turn')
        }
      } else{
        console.log(data.status)
      }
    })   
  })

}

function renderScissorsButton(container){
  const scissorsButton = document.createElement('button')
  scissorsButton.textContent = 'Ножницы'
  scissorsButton.classList.add('scissors-button')
  container.appendChild(scissorsButton)

  scissorsButton.addEventListener('click', e =>{
        request("/play", {token: window.application.player.token}, {id: window.application.player.token}, "move=scissors", function (data) {
      if (data.status !== "error"){
        let gameStatus = data[game-status]
        if (gameStatus.status === "waiting-for-enemy-move") {
          window.application.renderScreen('waiting-enemy-screen')
        }else if(gameStatus.status === "win") {
          window.application.renderScreen('win-screen')
        }else if(gameStatus.status === "lose"){
          window.application.renderScreen('fail-screen')
        }else if(gameStatus.status === "waiting-for-your-move"){
          window.application.renderScreen('double-turn')
          }
        } else{
        console.log(data.status)}
      }
    )   
  })
  
}
function renderPapperButton(container){
  const papperButton = document.createElement('button')
  papperButton.textContent = 'Бумага'
  papperButton.classList.add('papper-button')
  container.appendChild(papperButton)

  papperButton.addEventListener('click', e =>{
        request("/play", {token: window.application.player.token}, {id: window.application.player.token}, "move=paper", function (data) {
      if (data.status !== "error"){
        let gameStatus = data[game-status]
        if (gameStatus.status === "waiting-for-enemy-move") {
          window.application.renderScreen('waiting-enemy-screen')
        }else if(gameStatus.status === "win") {
          window.application.renderScreen('win-screen')
        }else if(gameStatus.status === "lose"){
          window.application.renderScreen('fail-screen')
        }else if(gameStatus.status === "waiting-for-your-move"){
          window.application.renderScreen('double-turn')
          }
        }else{
        console.log(data.status)}
      }
    )   
  })
  
}

function renderTurnScreen(){
  app.textContent = ''
  const turnScreen = document.createElement('div')
  turnScreen.classList.add('turn-screen')
  app.appendChild(turnScreen)

  window.application.renderBlock('turn-block', turnScreen)
  window.application.renderBlock('stone-button', turnScreen)
  window.application.renderBlock('scissors-button', turnScreen)
  window.application.renderBlock('papper-button', turnScreen)
}

function renderDoubleTurnScreen(){
  app.textContent = ''
  const doubleTurnScreen = document.createElement('div')
  doubleTurnScreen.classList.add('turn-screen')
  app.appendChild(turnScreen)

  window.application.renderBlock('double-turn-block', doubleTurnScreen)
  window.application.renderBlock('stone-button', doubleTurnScreen)
  window.application.renderBlock('scissors-button', doubleTurnScreen)
  window.application.renderBlock('papper-button', doubleTurnScreen)
}

function renderWaitingTurnScreen(){   
  app.textContent = ''
  const waitingTurnScreen = document.createElement('div')
  waitingTurnScreen.classList.add('waiting-enemy-block')
  waitingTurnScreen.classList.add('loader')
  app.appendChild(waitingTurnScreen)

  setInterval(turnCheck, 500)
}