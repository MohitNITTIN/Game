const GAME_MODE = "Normal";
const GAME_TOTAL_TILES = 16;
const GAME_START = "Start Game";
const GAME_RESET = "Reset Game";

let utilities = null;
let tiles = null;

let gameSequence = [];
let gameSequenceCount = 0;
let playerSequence = [];
let playerSequenceCount = 0;

let game = document.getElementById("game");
let gameButton = document.getElementById("btn-game");
let gameMessage = document.getElementById("game-message");
let scoreBoard = document.getElementById("score-board")


class Utilities {

    shuffle(data) {
        data.sort(() => Math.random() - 0.5);
        return data;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

class Tiles {

    #tiles = [];

    constructor(totalTiles) {
        for (let i = 0; i < totalTiles; i++) {
            this.#tiles.push(document.getElementById("tile-" + i));
        }
    }

    loadTiles() {
        this.#tiles.forEach(element => {
            element.classList.remove("invisible");
            element.classList.add("tiles");
            element.classList.add("start-animate");
            element.classList.add("pe-none");
        });
    }

    resetTiles() {
        this.#tiles.forEach(element => {
            element.classList.remove("start-animate");
            element.classList.add("invisible");
        });
    }

    disableTilesClick() {
        this.#tiles.forEach(element => {
            element.classList.add("pe-none");
        });
    }

    enableTilesClick() {
        this.#tiles.forEach(element => {
            element.classList.remove("pe-none");
        });

    }

    async glowTile(tileNumber, utilities) {
        this.disableTilesClick();
        this.#tiles[tileNumber].classList.remove("start-animate");
        this.#tiles[tileNumber].classList.add("glow-animate");
        await utilities.sleep(1000);
        this.#tiles[tileNumber].classList.remove("glow-animate");
        await utilities.sleep(250);
        this.enableTilesClick();
    }
}

function setupGame(utilities) {
    for (let i = 0; i < GAME_TOTAL_TILES; i++) {
        gameSequence.push(i);
    }

    utilities.shuffle(gameSequence);
    gameSequenceCount = 0;
    scoreBoard.innerHTML = "Score: 0/" + GAME_TOTAL_TILES;
}

async function startGame() {
    tiles.loadTiles();
    await utilities.sleep(1250);
    setupGame(utilities);
    nextSequence();
}

async function nextSequence() {
    gameSequenceCount++;

    if (gameSequenceCount <= GAME_TOTAL_TILES) {
        tiles.disableTilesClick();
        await utilities.sleep(400);
        game.classList.add("body-mode-watch");
        game.classList.remove("body-mode-player-turn");
        gameMessage.innerHTML = "Watch";
        await utilities.sleep(800);

        for (let i = 0; i < gameSequenceCount; i++) {
            await tiles.glowTile(gameSequence[i], utilities);
        }

        playerTurn();
    } else {
        playerWins();
    }
}

function playerTurn() {
    playerSequence = [];
    playerSequenceCount = 0;
    game.classList.add("body-mode-player-turn");
    game.classList.remove("body-mode-watch");
    gameMessage.innerHTML = "Your Turn";
}

function playerSelect(tileNumber) {
    if (isValidTiles(tileNumber)) {
        playerSequence.push(tileNumber);
        playerSequenceCount++;
        if (playerSequenceCount == gameSequenceCount) {
            scoreBoard.innerHTML = "Score: " + gameSequenceCount + "/" + GAME_TOTAL_TILES;
            nextSequence();
        }
    }
    else {
        gameOver();
    }
}

function isValidTiles(tileNumber) {
    for (let i = 0; i < playerSequenceCount; i++) {
        if (tileNumber == playerSequence[i]) {
            return false;
        }
    }

    for (let i = 0; i < gameSequenceCount; i++) {
        if (tileNumber == gameSequence[i]) {
            return true;
        }
    }
    return false;
}

function playerWins() {
    gameMessage.innerHTML = "You Win!";
    endGame();
}

function gameOver() {
    gameMessage.innerHTML = "Game Over!";
    endGame();
}

function restartGame() {
    scoreBoard.innerHTML = "Score: 0/" + GAME_TOTAL_TILES;
    gameMessage.innerHTML = "...";
    endGame();
}

function endGame() {
    gameSequence = [];
    tiles.resetTiles();
}

function main() {
    gameButton.value = GAME_START;
    gameButton.innerHTML = GAME_START;

    gameButton.addEventListener("click", function () {
        if (gameButton.value == GAME_START) {
            gameButton.value = GAME_RESET;
            gameButton.innerHTML = GAME_RESET;
            startGame();
        } else if (gameButton.value == GAME_RESET) {
            gameButton.value = GAME_START;
            gameButton.innerHTML = GAME_START;
            restartGame();
        }
        gameButton.blur();
    });

    scoreBoard.innerHTML = "Score: 0/" + GAME_TOTAL_TILES;

    utilities = new Utilities();
    tiles = new Tiles(GAME_TOTAL_TILES);
}

main();