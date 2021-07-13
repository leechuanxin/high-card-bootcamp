// Please implement exercise logic here
/**
 * HELPER FUNCTIONS
 * Helper functions for game logic
 */
// Get a random index ranging from 0 (inclusive) to max (exclusive).
const getRandomIndex = (max) => Math.floor(Math.random() * max);

// Shuffle an array of cards
const shuffleCards = (cards) => {
  // Loop over the card deck array once
  for (let currentIndex = 0; currentIndex < cards.length; currentIndex += 1) {
    // Select a random index in the deck
    const randomIndex = getRandomIndex(cards.length);
    // Select the card that corresponds to randomIndex
    const randomCard = cards[randomIndex];
    // Select the card that corresponds to currentIndex
    const currentCard = cards[currentIndex];
    // Swap positions of randomCard and currentCard in the deck
    cards[currentIndex] = randomCard;
    cards[randomIndex] = currentCard;
  }
  // Return the shuffled deck
  return cards;
};

const makeDeck = () => {
  // Initialise an empty deck array
  const newDeck = [];
  // Initialise an array of the 4 suits in our deck. We will loop over this array.
  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];

  // Loop over the suits array
  for (let suitIndex = 0; suitIndex < suits.length; suitIndex += 1) {
    // Store the current suit in a variable
    const currentSuit = suits[suitIndex];
    // CX: Setting of suit symbol as well as card colors
    let suitSymbol = '';
    let colour = '';

    switch (currentSuit) {
      case 'hearts':
        suitSymbol = '♥';
        colour = 'red';
        break;
      case 'diamonds':
        suitSymbol = '♦️';
        colour = 'red';
        break;
      case 'clubs':
        suitSymbol = '♣';
        colour = 'black';
        break;
      case 'spades':
      default:
        suitSymbol = '♠';
        colour = 'black';
        break;
    }

    // Loop from 1 to 13 to create all cards for a given suit
    // Notice rankCounter starts at 1 and not 0, and ends at 13 and not 12.
    // This is an example of a loop without an array.
    for (let rankCounter = 1; rankCounter <= 13; rankCounter += 1) {
      // By default, the card name is the same as rankCounter
      let cardName = `${rankCounter}`;
      // CX: Setting of display name
      let displayName = cardName;

      // If rank is 1, 11, 12, or 13, set cardName to the ace or face card's name
      if (cardName === '1') {
        cardName = 'ace';
        displayName = 'A';
      } else if (cardName === '11') {
        cardName = 'jack';
        displayName = 'J';
      } else if (cardName === '12') {
        cardName = 'queen';
        displayName = 'Q';
      } else if (cardName === '13') {
        cardName = 'king';
        displayName = 'K';
      }

      // Create a new card with the current name, suit, and rank
      const card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
        suitSymbol,
        displayName,
        colour,
      };

      // Add the new card to the deck
      newDeck.push(card);
    }
  }

  // Return the completed card deck
  return newDeck;
};

// Make a card in the DOM
const createCard = (cardInfo) => {
  const suit = document.createElement('div');
  // CX: Add color to the suit
  suit.classList.add('suit', cardInfo.colour);
  suit.innerText = cardInfo.suitSymbol;

  const name = document.createElement('div');
  name.classList.add(cardInfo.displayName, cardInfo.colour);
  // CX: Replace 3 with the display name of the card
  name.innerText = cardInfo.displayName;

  const card = document.createElement('div');
  card.classList.add('card');

  card.appendChild(name);
  card.appendChild(suit);

  return card;
};

/**
 * GLOBAL SETUP
 * Global variables that store game-wide data or DOM elements
 */

// Initialize unshuffled deck
const unshuffledDeck = makeDeck();
// Shuffled deck as a copy of unshuffled deck
let deck = shuffleCards([...unshuffledDeck]);

// represents whether the user has recently clicked and we are waiting for the delay to end,
// and to prevent user accidentally setting multiple timeouts
let canClick = true;

// Add the cardContainer DOM element as a global variable.
let cardContainer;

// Player 1 starts first
let playersTurn = 1; // matches with starting instructions
// Use let for player1Card object because player1Card will be reassigned
let player1Card;

// create two buttons
const player1Button = document.createElement('button');
const player2Button = document.createElement('button');
// Create game info div as global value
const gameInfo = document.createElement('div');
// Create a helper function for output to abstract complexity
// of DOM manipulation away from game logic
const output = (message) => {
  gameInfo.innerText = message;
};

/**
 * PLAYER ACTION CALLBACKS
 * Callbacks that get triggered when player 1 and 2 click on their respective buttons.
 */

// Event handler on player 1's button to draw card and switch
// to player 2's turn
const player1Click = () => {
  if (playersTurn === 1 && canClick === true) {
    canClick = false;

    setTimeout(() => {
      // create new deck and reshuffle if no cards left
      if (deck.length === 0) {
        deck = shuffleCards([...unshuffledDeck]);
      }

      // Pop player 1's card metadata from the deck
      player1Card = deck.pop();

      // Create card element from card metadata
      const cardElement = createCard(player1Card);
      // Empty cardContainer in case this is not the 1st round of gameplay
      cardContainer.innerHTML = '';
      // Append the card element to the card container
      cardContainer.appendChild(cardElement);

      // Switch to player 2's turn
      playersTurn = 2;
      canClick = true;
    }, 2000);
  }
};

// Event handler on player 2's button to draw card and determine winner
// Switch back to player 1's turn to repeat game
const player2Click = () => {
  if (playersTurn === 2 && canClick === true) {
    canClick = false;
    setTimeout(() => {
      // create new deck and reshuffle if no cards left
      if (deck.length === 0) {
        deck = shuffleCards([...unshuffledDeck]);
      }

      // Pop player 2's card metadata from the deck
      const player2Card = deck.pop();

      // Create card element from card metadata
      const cardElement = createCard(player2Card);
      // Append card element to card container
      cardContainer.appendChild(cardElement);

      // Switch to player 1's turn
      playersTurn = 1;
      canClick = true;

      // Determine and output winner
      if (player1Card.rank > player2Card.rank) {
        output('player 1 wins');
      } else if (player1Card.rank < player2Card.rank) {
        output('player 2 wins');
      } else {
        output('tie');
      }
    }, 2000);
  }
};

/**
 * GAME INITIALISATION
 * We can now centralise our game initialisation into a single function called `initGame`.
 */

const initGame = () => {
  // Initialise cardContainer as a div with CSS class card-container,
  // and add it to the document body. Add this logic to the initGame function.
  cardContainer = document.createElement('div');
  cardContainer.classList.add('card-container');
  document.body.appendChild(cardContainer);

  // initialize button functionality
  player1Button.innerText = 'Player 1 Draw';
  document.body.appendChild(player1Button);

  player2Button.innerText = 'Player 2 Draw';
  document.body.appendChild(player2Button);

  player1Button.addEventListener('click', player1Click);
  player2Button.addEventListener('click', player2Click);

  // fill game info div with starting instructions
  gameInfo.innerText = 'Its player 1 turn. Click to draw a card!';
  document.body.appendChild(gameInfo);
};

// CX: Run initGame() to start everything!
initGame();
