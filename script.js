// Gameboard module (IIFE)
const Gameboard = (() => {
    let board = ['', '', '', '', '', '', '', '', ''];

    const getBoard = () => board;

    const placeMark = (index, mark) => {
        if (board[index] === '') {
            board[index] = mark;
            return true;
        }
        return false;
    };

    const resetBoard = () => {
        board = ['', '', '', '', '', '', '', '', ''];
    };

    const checkWin = (mark) => {
        const winPatterns = [
            [0,1,2], [3,4,5], [6,7,8], // rows
            [0,3,6], [1,4,7], [2,5,8], // columns
            [0,4,8], [2,4,6] // diagonals
        ];
        return winPatterns.some(pattern => pattern.every(index => board[index] === mark));
    };

    const checkTie = () => {
        return board.every(cell => cell !== '');
    };

    return { getBoard, placeMark, resetBoard, checkWin, checkTie };
})();

// Player factory
const Player = (name, mark) => {
    return { name, mark };
};

// Game controller module (IIFE)
const Game = (() => {
    let players = [];
    let currentPlayerIndex = 0;
    let gameOver = false;

    const startGame = (player1Name, player2Name) => {
        players = [Player(player1Name, 'X'), Player(player2Name, 'O')];
        currentPlayerIndex = 0;
        gameOver = false;
        Gameboard.resetBoard();
        console.log('Game started!');
        printBoard();
        console.log(`${players[currentPlayerIndex].name}'s turn`);
        DisplayController.renderBoard();
        DisplayController.updateStatus(`${players[currentPlayerIndex].name}'s turn`);
    };

    const playTurn = (index) => {
        if (gameOver) return false;

        const currentPlayer = players[currentPlayerIndex];
        console.log(`${currentPlayer.name} trying to play at ${index}`);
        if (Gameboard.placeMark(index, currentPlayer.mark)) {
            console.log('Mark placed successfully');
            printBoard();
            DisplayController.renderBoard();
            if (Gameboard.checkWin(currentPlayer.mark)) {
                gameOver = true;
                console.log(`${currentPlayer.name} wins!`);
                DisplayController.updateStatus(`${currentPlayer.name} wins!`);
                DisplayController.showEndButtons();
                return true;
            }
            if (Gameboard.checkTie()) {
                gameOver = true;
                console.log("It's a tie!");
                DisplayController.updateStatus("It's a tie!");
                DisplayController.showEndButtons();
                return true;
            }
            currentPlayerIndex = 1 - currentPlayerIndex;
            console.log(`${players[currentPlayerIndex].name}'s turn`);
            DisplayController.updateStatus(`${players[currentPlayerIndex].name}'s turn`);
            return true;
        }
        console.log('Spot already taken!');
        return false;
    };

    const printBoard = () => {
        const board = Gameboard.getBoard();
        console.log(`
 ${board[0]} | ${board[1]} | ${board[2]}
-----------
 ${board[3]} | ${board[4]} | ${board[5]}
-----------
 ${board[6]} | ${board[7]} | ${board[8]}
        `);
    };

    const restartGame = () => {
        startGame(players[0].name, players[1].name);
    };

    return { startGame, playTurn, restartGame, printBoard };
})();

// Display controller module (IIFE)
const DisplayController = (() => {
    const boardElement = document.getElementById('game-board');
    const statusElement = document.getElementById('game-status');
    const cells = document.querySelectorAll('.cell');

    const renderBoard = () => {
        const board = Gameboard.getBoard();
        console.log('Rendering board:', board);
        cells.forEach((cell, index) => {
            cell.textContent = board[index];
        });
    };

    const updateStatus = (message) => {
        statusElement.textContent = message;
    };

    const showEndButtons = () => {
        document.getElementById('restart-game').classList.remove('hidden');
        document.getElementById('new-game').classList.remove('hidden');
    };

    const init = () => {
        cells.forEach(cell => {
            cell.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                console.log('Clicked cell:', index);
                Game.playTurn(index);
            });
        });

        document.getElementById('start-game').addEventListener('click', () => {
            const p1Name = document.getElementById('player1-name').value || 'Player 1';
            const p2Name = document.getElementById('player2-name').value || 'Player 2';
            Game.startGame(p1Name, p2Name);
            document.getElementById('player-setup').classList.add('hidden');
            document.getElementById('game-board').classList.remove('hidden');
            document.getElementById('restart-game').classList.remove('hidden');
            document.getElementById('new-game').classList.add('hidden');
        });

        document.getElementById('restart-game').addEventListener('click', () => {
            Game.restartGame();
        });

        document.getElementById('new-game').addEventListener('click', () => {
            document.getElementById('game-board').classList.add('hidden');
            document.getElementById('restart-game').classList.add('hidden');
            document.getElementById('new-game').classList.add('hidden');
            document.getElementById('player-setup').classList.remove('hidden');
            document.getElementById('game-status').textContent = '';
        });
    };

    return { renderBoard, updateStatus, showEndButtons, init };
})();

// Initialize the display
DisplayController.init();