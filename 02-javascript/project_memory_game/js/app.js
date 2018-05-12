// TODO: Congrats popup
// TODO: display timer
// TODO: Restart button
// TODO (opt): animate correct and incorrect guesses.

// Game constants / elements
const gameBoardBackdrop = document.querySelector("#game-board-backdrop");
const starScore = document.querySelector("#star-score");
const moveAmount = document.querySelector("#move-amount");

const cardContainerClassName = 'card-container';
const cardClassName = 'card'
const cardFrontClassName = 'card-front';
const cardBackClassName = 'card-back';

const cardTypes = [
  "card-monkey", "card-pizza", "card-hotdog", "card-dragon",
  "card-pug", "card-woman", "card-baby", "card-cactus", 'new-card',
]
const totalCards = cardTypes.length * 2; // 2 of each card type
const fewestPossibleMoves = totalCards / 2;

// Game state
let selectedCards = []
let foundCards = 0;
let totalMoves = 0;
let gameStartTime = null;
let gameEndTime = null;

// Card selection-related functions
function isOkToSelectCard() {
  return selectedCards.length < 2
}

function bothCardsSelected() {
  return selectedCards.length === 2
}

function clearSelectedCards() {
  selectedCards.length = 0;
}

function isGameWon() {
  return foundCards === totalCards;
}

function resetGameStateAndClearBoard() {
  clearSelectedCards()
  foundCards = 0;
  totalMoves = 0;
  gameStartTime = null;
  gameEndTime = null;
  while (gameBoardBackdrop.firstChild) {
    gameBoardBackdrop.removeChild(gameBoardBackdrop.firstChild);
  }
  displayLatestScore();
}

// Fisher–Yates shuffle from https://bost.ocks.org/mike/shuffle/
function shuffle(array) {
  var m = array.length,
    t, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

function getShuffledDeck() {
  const deck = [];
  for (let cardType of cardTypes) {
    deck.push(cardType);
    deck.push(cardType);
  }
  return shuffle(deck);
}

function createCard(cardType) {
  const newCard = document.createElement('div');
  newCard.classList.add(cardContainerClassName);
  newCard.classList.add(cardType);
  const newCardFront = document.createElement('div');
  newCardFront.classList.add(cardFrontClassName);
  newCardFront.classList.add(cardClassName);
  const newCardBack = document.createElement('div');
  newCardBack.classList.add(cardBackClassName);
  newCardBack.classList.add(cardClassName);
  newCard.appendChild(newCardBack);
  newCard.appendChild(newCardFront);

  return newCard
}

function createAndDisplayDeck() {
  const deckFragment = document.createDocumentFragment();
  const deck = getShuffledDeck()
  for (let i = 0; i < totalCards; i++) {
    let card = createCard(cardType = deck.pop())
    deckFragment.appendChild(card)
  }
  gameBoardBackdrop.appendChild(deckFragment);
}

function updateMoves() {
  totalMoves += 1;
}

function getStarRating() {
  let starRating = 0;
  if (totalMoves < fewestPossibleMoves * 2.5) {
    starRating += 1;
  }
  if (totalMoves < fewestPossibleMoves * 2) {
    starRating += 1;
  }
  if (totalMoves < fewestPossibleMoves * 1.5) {
    starRating += 1;
  }
  return starRating;
}

function getStarDisplay(starRating) {
  const emptyStar = '\u2606';
  const filledStar = '\u2605';
  switch (starRating) {
    case 0:
      return emptyStar + emptyStar + emptyStar;
    case 1:
      return filledStar + emptyStar + emptyStar;
    case 2:
      return filledStar + filledStar + emptyStar;
    case 3:
      return filledStar + filledStar + filledStar;
  }
}

function displayLatestScore() {
  moveAmount.textContent = totalMoves;
  const starRating = getStarRating();
  const starDisplay = getStarDisplay(starRating);
  starScore.textContent = starDisplay;
  console.log(`${starRating} stars: ${starDisplay}`);
}

// Card-related functions
function isCardBack(element) {
  return element.nodeName === 'DIV' && element.classList[0] === cardBackClassName;
}

function showCard(card) {
  card.style.transform = "rotateY(180deg)";
}

function hideCard(card) {
  card.style.removeProperty("transform");
}

function selectCard(card) {
  selectedCards.push(card);
}

function isMatchingCardPair(cardA, cardB) {
  return cardA.classList[1] === cardB.classList[1]
}

function checkIfCardsMatch(cardA, cardB) {
  console.log("checkIfCardsMatch");
  if (isMatchingCardPair(cardA, cardB)) {
    console.log("cards match");
    foundCards += 2;
    checkIfGameIsWon();
  } else {
    console.log("cards mismatch");
    setTimeout(hideCard, 1000, cardA);
    setTimeout(hideCard, 1000, cardB);
  }
}

function checkIfGameIsWon() {
  console.log("checkIfGameIsWon");
  if (isGameWon()) {
    gameEndTime = performance.now()
    const elapsedTime = (gameEndTime - gameStartTime) / 1000;
    console.log('You won! Took ' + elapsedTime.toFixed(2) + 's');
    resetGameStateAndClearBoard();
    createAndDisplayDeck();
  }
}

// Listeners
gameBoardBackdrop.addEventListener("click", cardClickedListener);

function cardClickedListener(event) {
  if (isCardBack(element = event.target) && isOkToSelectCard()) {
    const card = event.target.parentElement;
    if (gameStartTime === null) {
      gameStartTime = performance.now()
    }
    showCard(card);
    selectCard(card);
    if (bothCardsSelected()) {
      updateMoves();
      displayLatestScore();
      checkIfCardsMatch(cardA = selectedCards[0], cardB = selectedCards[1]);
      clearSelectedCards();
    }
  }
}

resetGameStateAndClearBoard();
createAndDisplayDeck();
