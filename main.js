document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const levelDisplay = document.getElementById('level-display');
    const scoreDisplay = document.getElementById('score-display');
    const gameOverPopup = document.getElementById('game-over-popup');
    const retryButton = document.getElementById('retry-button');
    const nextLevelButton = document.getElementById('next-level-button');

    const width = 8;
    const squares = [];
    const candyColors = [
        'url(images/red-candy.png)',
        'url(images/yellow-candy.png)',
        'url(images/orange-candy.png)',
        'url(images/purple-candy.png)',
        'url(images/green-candy.png)',
        'url(images/blue-candy.png)'
    ];
    let score = 0;
    let currentLevel = 1;
    let targetScore = 100;

    function showLevel() {
        levelDisplay.textContent = `第 ${currentLevel} 关`;
    }

    function showScore() {
        scoreDisplay.textContent = `分数: ${score}`;
    }

    function showGameOverPopup() {
        gameOverPopup.classList.remove('hidden');
    }

    function hideGameOverPopup() {
        gameOverPopup.classList.add('hidden');
    }

    function resetGame() {
        hideGameOverPopup();
        score = 0;
        currentLevel = 1;
        targetScore = 100;
        squares.forEach(square => gameBoard.removeChild(square));
        squares.length = 0;
        createBoard();
    }

    function nextLevel() {
        currentLevel++;
        targetScore += 50;
        hideGameOverPopup();
        squares.forEach(square => gameBoard.removeChild(square));
        squares.length = 0;
        createBoard();
    }

    function createBoard() {
        showLevel();
        showScore();
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div');
            square.setAttribute('draggable', true);
            square.setAttribute('id', i);
            let randomColor = Math.floor(Math.random() * candyColors.length);
            square.style.backgroundImage = candyColors[randomColor];
            gameBoard.appendChild(square);
            squares.push(square);
        }
        addEventListeners();
    }

    function addEventListeners() {
        squares.forEach(square => square.addEventListener('dragstart', dragStart));
        squares.forEach(square => square.addEventListener('dragend', dragEnd));
        squares.forEach(square => square.addEventListener('dragover', dragOver));
        squares.forEach(square => square.addEventListener('dragenter', dragEnter));
        squares.forEach(square => square.addEventListener('dragleave', dragLeave));
        squares.forEach(square => square.addEventListener('drop', dragDrop));
    }

    let colorBeingDragged;
    let colorBeingReplaced;
    let squareIdBeingDragged;
    let squareIdBeingReplaced;

    function dragStart() {
        colorBeingDragged = this.style.backgroundImage;
        squareIdBeingDragged = parseInt(this.id);
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function dragEnter(e) {
        e.preventDefault();
    }

    function dragLeave() {
        this.style.backgroundImage = '';
    }

    function dragDrop() {
        colorBeingReplaced = this.style.backgroundImage;
        squareIdBeingReplaced = parseInt(this.id);
        this.style.backgroundImage = colorBeingDragged;
        squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced;
    }

    function dragEnd() {
        let validMoves = [
            squareIdBeingDragged - 1,
            squareIdBeingDragged - width,
            squareIdBeingDragged + 1,
            squareIdBeingDragged + width
        ];
        let validMove = validMoves.includes(squareIdBeingReplaced);

        if (squareIdBeingReplaced && validMove) {
            let isValid = checkValidMove();
            if (!isValid) {
                squares[squareIdBeingReplaced].style.backgroundImage = colorBeingReplaced;
                squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
            }
        } else {
            squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
        }
        squareIdBeingReplaced = null;
    }

    function checkValidMove() {
        let valid = checkRowForMatches() || checkColumnForMatches();
        if (valid) {
            moveDown();
            return true;
        }
        return false;
    }

    function checkRowForMatches() {
        for (let i = 0; i < 61; i++) {
            let rowOfThree = [i, i + 1, i + 2];
            let rowOfFour = [i, i + 1, i + 2, i + 3];
            let rowOfFive = [i, i + 1, i + 2, i + 3, i + 4];
            let rowOfSix = [i, i + 1, i + 2, i + 3, i + 4, i + 5];
            let decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === '';

            if (rowOfSix.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                score += 60;
                rowOfSix.forEach(index => {
                    squares[index].style.backgroundImage = '';
                });
                return true;
            } else if (rowOfFive.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                score += 50;
                rowOfFive.forEach(index => {
                    squares[index].style.backgroundImage = '';
                });
                return true;
            } else if (rowOfFour.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                score += 40;
                rowOfFour.forEach(index => {
                    squares[index].style.backgroundImage = '';
                });
                return true;
            } else if (rowOfThree.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                score += 30;
                rowOfThree.forEach(index => {
                    squares[index].style.backgroundImage = '';
                });
                return true;
            }
        }
        return false;
    }

    function checkColumnForMatches() {
        for (let i = 0; i < 47; i++) {
            let columnOfThree = [i, i + width, i + width * 2];
            let columnOfFour = [i, i + width, i + width * 2, i + width * 3];
            let columnOfFive = [i, i + width, i + width * 2, i + width * 3, i + width * 4];
            let columnOfSix = [i, i + width, i + width * 2, i + width * 3, i + width * 4, i + width * 5];
            let decidedColor = squares[i].style.backgroundImage;
            const isBlank = squares[i].style.backgroundImage === '';

            if (columnOfSix.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                score += 60;
                columnOfSix.forEach(index => {
                    squares[index].style.backgroundImage = '';
                });
                return true;
            } else if (columnOfFive.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                score += 50;
                columnOfFive.forEach(index => {
                    squares[index].style.backgroundImage = '';
                });
                return true;
            } else if (columnOfFour.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                score += 40;
                columnOfFour.forEach(index => {
                    squares[index].style.backgroundImage = '';
                });
                return true;
            } else if (columnOfThree.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
                score += 30;
                columnOfThree.forEach(index => {
                    squares[index].style.backgroundImage = '';
                });
                return true;
            }
        }
        return false;
    }

    function moveDown() {
        for (let i = 0; i < 55; i++) {
            if (squares[i + width].style.backgroundImage === '') {
                squares[i + width].style.backgroundImage = squares[i].style.backgroundImage;
                squares[i].style.backgroundImage = '';
                const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
                const isFirstRow = firstRow.includes(i);
                if (isFirstRow && squares[i].style.backgroundImage === '') {
                    let randomColor = Math.floor(Math.random() * candyColors.length);
                    squares[i].style.backgroundImage = candyColors[randomColor];
                }
            }
        }
    }

    function checkGameOver() {
        if (score >= targetScore) {
            showGameOverPopup();
        }
    }

    retryButton.addEventListener('click', resetGame);
    nextLevelButton.addEventListener('click', nextLevel);

    window.setInterval(function() {
        moveDown();
        checkRowForMatches();
        checkColumnForMatches();
        showScore();
        checkGameOver();
    }, 100);

    createBoard();
});
