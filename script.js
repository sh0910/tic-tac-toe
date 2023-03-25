/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
'use strict';

const container = document.querySelector('.game-container');
const modal = document.querySelector('.modal');
const modalText = document.querySelector('.modal-text');
const btnPlayAgain = document.querySelector('.btn-again');

let gameBoard = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];

// Players using factories
const Player = function (name, value) {
	return { name, value };
};

const player1 = Player('You', 'X'); // {name: 'You', value: 'X'}
const player2 = Player('Computer', 'O');

// toggle activePlayer
let activePlayer = player1;

const getComputerChoice = function () {
	const availableBoxes = gameBoard
		.map((box, i) => (box === ' ' ? i : box))
		.filter(index => index > 0);

	const boxIndex = Math.floor(Math.random() * availableBoxes.length);

	return availableBoxes[boxIndex];
};

// create board and render on UI
const generateBoard = function () {
	for (let i = 0; i <= 8; i++) {
		const div = document.createElement('div');
		div.classList = 'box';
		div.dataset.box = i;
		div.textContent = ' ';
		container.append(div);
	}
};

generateBoard();

const updateGameBoardArray = function (box) {
	gameBoard[box] = activePlayer.value;
};

const togglePlayer = function () {
	activePlayer = activePlayer === player1 ? player2 : player1;
};

const updateUI = function () {
	[...container.childNodes].forEach((boxDiv, i) => {
		boxDiv.textContent = gameBoard[i];
	});
};

container.addEventListener('click', function (e) {
	const boxNumber = e.target.dataset.box;

	// If box already has X/O, return
	if (gameBoard[boxNumber] !== ' ') return;

	updateGameBoardArray(boxNumber);

	updateUI();
	checkWinner();

	// If modal showing, computer won't choose a box
	if (!modal.classList.contains('hidden')) return;

	togglePlayer();

	// If computer is active player, then computer makes a move
	if (activePlayer === player2) {
		setTimeout(() => {
			const computerChoiceBox = getComputerChoice();
			updateGameBoardArray(computerChoiceBox);
			updateUI();
			checkWinner();
			togglePlayer();
		}, 1000);
	}
});

const winningCombos = ['012', '345', '678', '036', '147', '258', '048', '246'];

const checkWinningCombo = function (str) {
	const winningComboArr = winningCombos.map(combo =>
		[...combo].every(char => str.includes(char))
	);
	if (winningComboArr.includes(true)) {
		modal.classList.remove('hidden');
		modalText.innerHTML = `${activePlayer.name} wins! 🥳`;
	} else if (!gameBoard.includes(' ')) {
		modal.classList.remove('hidden');
		modalText.innerHTML = `It's a tie!`;
	}
};

const checkWinner = function () {
	const activePlayerIndexes = gameBoard
		.map((a, i) => (a === activePlayer.value ? i : 'no'))
		.filter(num => num >= 0);

	if (activePlayerIndexes.length < 3) return;

	const activePlayerNums = activePlayerIndexes.join('');
	checkWinningCombo(activePlayerNums);
};

btnPlayAgain.addEventListener('click', function () {
	modal.classList.add('hidden');

	// reset Gameboard
	activePlayer = player1;
	gameBoard = gameBoard.map(box => ' ');
	updateUI();
});
