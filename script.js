let deck = [];

function createDeck() {
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
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function dealCard() {
    if (deck.length === 0) {
        console.log("Reshuffling the deck.");
        createDeck();
        shuffleDeck();
    }
    return deck.pop();
}

let playerHand = [];
let dealerHand = [];



function displayCards(hand, elementId) {
    const handDiv = document.getElementById(elementId);
    handDiv.innerHTML = ''; // Clear current cards
    for (let card of hand) {
        handDiv.innerHTML += `<div class="card">${card.value} of ${card.suit}</div>`;
    }
}

function displayMessage(message) {
    const messageDiv = document.getElementById("gameMessages");
    messageDiv.innerText = message;
}


function startGame() {
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
}

function getScore(hand) {
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
}

function playerHit() {
    playerHand.push(dealCard());

    let playerScore = getScore(playerHand);
    displayCards(playerHand, 'playerHand');

    if (playerScore > 21) {
        displayMessage("Player busts with a score of " + playerScore);
        // Handle end of game, e.g., reveal dealer's hand, reset for a new game, etc.
    } else {
        displayMessage("Player hits and now has a score of " + playerScore);
    }
}

function playerStand() {
    displayMessage("Player stands with a score of " + getScore(playerHand));
    dealerTurn();
}

function dealerTurn() {
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
}


function determineWinner() {
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
}

function offerNewGame() {
    // Add a message or a button for the player to start a new game
    displayMessage("Game over. Click 'New Game' to play again.");
}

function resetGame() {
    playerHand = [];
    dealerHand = [];

    createDeck();
    shuffleDeck();

    startGame();
    displayMessage("Game has been reset. New round starts.");
}


// Event listeners for player actions (hit, stand, etc.)
document.getElementById("hitButton").addEventListener("click", playerHit);
document.getElementById("standButton").addEventListener("click", playerStand);
document.getElementById("resetButton").addEventListener("click", resetGame);

// Ensure the HTML is fully loaded before starting the game
document.addEventListener('DOMContentLoaded', function() {
    startGame();
});