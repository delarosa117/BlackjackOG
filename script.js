let deck = [];

const createDeck = () => {
    deck = [];
    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];

    for (let suit of suits) {
        for (let value of values) {
            let card = {
                suit: suit,
                value: value
            };
            deck.push(card);
        }
    }
};

const shuffleDeck = () => {
    for (let i = deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
};

const dealCard = () => {
    if (deck.length === 0) {
        console.log("Reshuffling the deck.");
        createDeck();
        shuffleDeck();
    }
    return deck.pop();
};

let playerHand = [];
let dealerHand = [];



const displayCards = (hand, elementId) => {
    const handDiv = document.querySelector(`#${elementId}`);
    handDiv.innerHTML = ''; // Clear current cards
    for (let card of hand) {
        handDiv.innerHTML += `<div class="card">${card.value} of ${card.suit}</div>`;
    }
};

const displayMessage = (message) => {
    const messageDiv = document.querySelector("#gameMessages");
    messageDiv.innerText = message;
};



const startGame = () => {
    createDeck();
    shuffleDeck();

    playerHand = [];
    dealerHand = [];

    playerHand.push(dealCard());
    dealerHand.push(dealCard());
    playerHand.push(dealCard());
    dealerHand.push(dealCard());

    displayCards(playerHand, 'playerHand');
    displayCards(dealerHand, 'dealerHand');
    displayMessage("Welcome to Blackjack! Your move.");
};

const getScore = (hand) => {
    let score = 0;
    let hasAce = false;

    for (let card of hand) {
        if (card.value === 'Jack' || card.value === 'Queen' || card.value === 'King') {
            score += 10;
        } else if (card.value === 'Ace') {
            hasAce = true;
            score += 1;
        } else {
            score += parseInt(card.value);
        }
    }

    if (hasAce && score <= 11) {
        score += 10;
    }

    return score;
};

const playerHit = () => {
    playerHand.push(dealCard());

    let playerScore = getScore(playerHand);
    displayCards(playerHand, 'playerHand');

    if (playerScore > 21) {
        displayMessage("Player busts with a score of " + playerScore);
    } else {
        displayMessage("Player hits and now has a score of " + playerScore);
    }
};

const playerStand = () => {
    displayMessage("Player stands with a score of " + getScore(playerHand));
    dealerTurn();
};

const dealerTurn = () => {
    let dealerScore = getScore(dealerHand);

    while (dealerScore < 17) {
        dealerHand.push(dealCard());
        dealerScore = getScore(dealerHand);
    }

    displayCards(dealerHand, 'dealerHand');

    if (dealerScore > 21) {
        displayMessage("Dealer busts with a score of " + dealerScore);
    } else {
        displayMessage("Dealer stands with a score of " + dealerScore);
    }

    determineWinner();
    offerNewGame();
};


const determineWinner = () => {
    let playerScore = getScore(playerHand);
    let dealerScore = getScore(dealerHand);

    if (playerScore > 21) {
        displayMessage("Player busts. Dealer wins.");
    } else if (dealerScore > 21) {
        displayMessage("Dealer busts. Player wins.");
    } else if (playerScore > dealerScore) {
        displayMessage("Player wins with " + playerScore + " against Dealer's " + dealerScore);
    } else if (dealerScore > playerScore) {
        displayMessage("Dealer wins with " + dealerScore + " against Player's " + playerScore);
    } else {
        displayMessage("It's a tie! Both Player and Dealer have " + playerScore);
    }
};

const offerNewGame = () => {
    displayMessage("Game over. Click 'New Game' to play again.");
};

const resetGame = () => {
    playerHand = [];
    dealerHand = [];

    createDeck();
    shuffleDeck();

    startGame();
    displayMessage("Game has been reset. New round starts.");
};


document.querySelector("#hitButton").addEventListener("click", playerHit);
document.querySelector("#standButton").addEventListener("click", playerStand);
document.querySelector("#resetButton").addEventListener("click", resetGame);

document.addEventListener('DOMContentLoaded', () => {
    startGame();
});