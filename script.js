'use strict';

const container = document.querySelector('.game-container');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const modalText = document.querySelector('.modal-text');
const btnPlayAgain = document.querySelector('.btn-again');

let gameBoard = Array(9).fill(' ');

const Player = function (name, value) {
	return { name, value };
};

const player1 = Player('Player', 'X');
const player2 = Player('Computer', 'O');

// toggle activePlayer
let activePlayer = player1;

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

const getComputerChoice = function () {
	const availableBoxes = gameBoard
		.map((box, i) => (box === ' ' ? i : box))
		.filter(index => index > 0);

	const boxIndex = Math.floor(Math.random() * availableBoxes.length);

	return availableBoxes[boxIndex];
};

const updateGameBoardArray = function (box) {
	gameBoard[box] = activePlayer.value;
};

const togglePlayer = function () {
	activePlayer = activePlayer === player1 ? player2 : player1;
};

const updateUI = function () {
	[...container.childNodes].forEach((box, i) => {
		const boxDiv = box;
		boxDiv.textContent = gameBoard[i];
	});
};

const openModal = function () {
	modal.classList.remove('hidden');
	overlay.classList.remove('hidden');
};

const closeModal = function () {
	modal.classList.add('hidden');
	overlay.classList.add('hidden');
};

const winningCombos = ['012', '345', '678', '036', '147', '258', '048', '246'];

const checkWinningCombo = function (str) {
	const winningComboArr = winningCombos.map(combo =>
		[...combo].every(char => str.includes(char))
	);
	if (winningComboArr.includes(true)) {
		openModal();

		modalText.innerHTML = `${activePlayer.name} wins!`;
	} else if (!gameBoard.includes(' ')) {
		openModal();
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

btnPlayAgain.addEventListener('click', function () {
	activePlayer = player1;
	gameBoard.length = 0;
	gameBoard = Array(9).fill(' ');
	closeModal();
	updateUI();
});
