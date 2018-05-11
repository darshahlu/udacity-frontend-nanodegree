
// Game constants / elements
const gameBoardBackdrop = document.querySelector("#game-board-backdrop");
const cardTypes = ["card-a", "card-b"]
const totalCards = cardTypes.length * 2; // 2 of each card type

// Game state
let selectedCards = []
let foundCards = 0;
let totalMoves = 0;

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
  while (gameBoardBackdrop.firstChild) {
    gameBoardBackdrop.removeChild(gameBoardBackdrop.firstChild);
  }
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
  newCard.classList.add('card');
  newCard.classList.add(cardType);
  const newCardFront = document.createElement('div');
  newCardFront.classList.add('card-front');
  const newCardBack = document.createElement('div');
  newCardBack.classList.add('card-back');
  newCard.appendChild(newCardFront);
  newCard.appendChild(newCardBack);
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

function updateMovesAndRating() {
  totalMoves += 1;
  // update dom
  // update star
}

// Card-related functions
function isCardFront(element) {
  return element.nodeName === 'DIV' && element.classList[0] === 'card-front'
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
    console.log("chads match");
    foundCards += 2;
    checkIfGameIsWon();
  } else {
    console.log("chads mismatch");
    setTimeout(hideCard, 1000, cardA);
    setTimeout(hideCard, 1000, cardB);
  }
}

function checkIfGameIsWon() {
  console.log("checkIfGameIsWon");
  if (isGameWon()) {
    console.log('You won!');
    resetGameStateAndClearBoard();
    createAndDisplayDeck();
  }
}

// Listeners
gameBoardBackdrop.addEventListener("click", cardClickedListener);

function cardClickedListener(event) {
  if (isCardFront(element = event.target) && isOkToSelectCard()) {
    const card = event.target.parentElement;
    showCard(card);
    selectCard(card);
    if (bothCardsSelected()) {
      updateMovesAndRating();
      checkIfCardsMatch(cardA = selectedCards[0], cardB = selectedCards[1]);
      clearSelectedCards();
    }
  }
}
