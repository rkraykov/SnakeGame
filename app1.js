document.addEventListener('DOMContentLoaded', () => {
	const score = document.querySelector('.score span');
	const grid = document.querySelector('.grid');
	const newGameBtn = document.querySelector('.new_game');
	const timer = document.querySelector('.timer');
	const headerStar = document.getElementsByTagName('img');
	const width = 14;
	const height = 14;
	const area = width * height;
	let apple;
	let direction = 1;
	let currentScore = 0;
	let currentSnake = [71,72,73];
	let snakeHead = 73;
	let seconds = 60;
	let rotate = 'rotate(0deg)';
	let snakeClass = 'snake';
	let allBricks = [];
	let goTruBricks = false;
	let squares;
	let interval;
	let timerInterval;
	let bricks;
	let star;
	let directionsArray = [];



	for (let i = 0; i < area; i++) {
		let div = document.createElement('div');
		grid.appendChild(div);
	}
	squares = document.querySelectorAll('.grid div');
	document.addEventListener('keyup', control);


	function newGame() {
		let head = currentSnake[currentSnake.length-1];
		currentSnake.forEach(i => squares[i].classList.remove('snake'));
		currentSnake.forEach(i => squares[i].classList.remove('dead_snake'));
		squares[head].classList.remove('head');
		squares[head].classList.remove('dead_head');
		squares[head].style.transform = 'rotate(0deg)';
		allBricks.forEach((i) => {
			squares[i].classList.remove('bricks');
			squares[i].style.opacity = '1';
		});
		if (apple >= 0) squares[apple].classList.remove('apple');
		if (star >= 0) {
			squares[star].classList.remove('star');
			star = -1;
		}

		clearInterval(interval);
		clearInterval(timerInterval);
		direction = 1;
		currentScore = 0;
		score.innerText = currentScore;
		seconds = 60;
		currentSnake = [71,72,73];
		snakeHead = 73;
		rotate = 'rotate(0deg)';
		snakeClass = 'snake';
		goTruBricks = false;
		allBricks = [];
		directionsArray = [];
		timer.style.visibility = "hidden";
		headerStar[0].style.visibility = "hidden";

		drawSnake();
		randomApple();
		interval = setInterval(moveSnake, 500);
		timerInterval = setInterval(startTimer, 1000);
	}

	function startTimer(){
		seconds--;
		timer.innerText = seconds;
		if (seconds === 20) showStar(true);
		else if (seconds === 0) {
			seconds = 60;
			goTruBricks = false;
			timer.style.visibility = "hidden";
			headerStar[0].style.visibility = "hidden";
			allBricks.forEach(i => squares[i].style.opacity = '1');
			showStar(false);
		}
	}

	function showStar(show){
		if (show) {
			do {star = randomNum();}
			while ((currentSnake.indexOf(star) >= 0) || 
				(allBricks.indexOf(star) >= 0) || 
				(star === apple));
			squares[star].classList.add('star');
		} else {
			if (star >= 0) squares[star].classList.remove('star');
			star = -1;
		}
	}


	function drawSnake(){
		for (let i = 0, penultimate = currentSnake.length - 1; i < penultimate; i++) {
			squares[currentSnake[i]].classList.add(snakeClass);
		}

		if (snakeClass === 'snake'){
			squares[snakeHead].classList.add('head');
		} else {
			squares[snakeHead].classList.remove('head');
			squares[snakeHead].classList.add('dead_head');
			squares[snakeHead].style.transform = rotate;
		}
	}

	function moveSnake() {
		if (directionsArray.length > 0) {
			let first = directionsArray.shift();
			direction = first[0];
			rotate = first[1];
		}
		snakeHead = currentSnake[currentSnake.length - 1];
		let newHead = snakeHead + direction;

		if ((newHead > area-1 ) || (newHead < 0) ||
			((direction === 1) && (newHead % width === 0)) ||
			((direction === -1) && (newHead % height === height-1)) ||
			(currentSnake.indexOf(newHead) >= 0) ||
			((allBricks.indexOf(newHead) >= 0) && !goTruBricks)) {

			snakeClass = 'dead_snake';
			drawSnake();
			clearInterval(interval);
			clearInterval(timerInterval);
		} else {
			currentSnake.push(newHead);
			if (newHead === apple) {
				squares[apple].classList.remove('apple');
				randomApple();
				currentScore++;
				score.innerHTML = currentScore;
				if (currentScore % 2 === 0) randomBricks();
			} else if (newHead === star){
				goTruBricks = true;
				seconds = 20;
				showStar(false);
				timer.innerHTML = '20';
				timer.style.visibility = "visible";
				headerStar[0].style.visibility = "visible";
				allBricks.forEach(i => squares[i].style.opacity = '0.5');
				squares[currentSnake.shift()].classList.remove('snake');
			} else {
				squares[currentSnake.shift()].classList.remove('snake');
			}
			squares[snakeHead].classList.remove('head');
			squares[snakeHead].style.transform = 'rotate(0deg)';
			squares[snakeHead].classList.add('snake');
			squares[newHead].classList.add('head');
			squares[newHead].style.transform = rotate;
		}
	}

	function randomApple() {
		do {apple = randomNum();}
		while (currentSnake.indexOf(apple) >= 0 || (allBricks.indexOf(apple) >= 0));
		squares[apple].classList.add('apple');
	}

	function randomBricks() {
		do {bricks = randomNum();}
		while (currentSnake.indexOf(bricks) >= 0 || (bricks === apple));
		squares[bricks].classList.add('bricks');
		if (goTruBricks) squares[bricks].style.opacity = '0.5';
		allBricks.push(bricks);
	}

	function randomNum(){
		return Math.floor(Math.random() * area);
	}

	function control(e) {
		if (e.keyCode === 39) {
			direction = 1; // right arrow
			rotate = 'rotate(0deg)';
		} else if (e.keyCode === 38) {
			direction = -width; //  up arrow
			rotate = 'rotate(270deg)';
		} else if (e.keyCode === 37) {
			direction = -1; // left arrow
			rotate = 'rotate(180deg)';
		} else if (e.keyCode === 40) {
			direction = +width; // down arrow
			rotate = 'rotate(90deg)';
		}

		directionsArray.push([direction, rotate]);
	}

	newGameBtn.addEventListener('click', newGame);
	
});