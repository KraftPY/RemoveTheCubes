import Cube from './cube.js';
import { getRandomColor, getRandom, getRandomPosition, checkUniquePosition, secondsToString } from './services.js';

// ------Game settings------
const minSizeCube = 20;
const maxSizeCube = 60;
const startCubes = 15; // no more than 100
const time = 60;
// -------------------------

const dom = {
    $start: document.querySelector('#start'),
    $pause: document.querySelector('#pause'),
    $new_game: document.querySelector('#new_game'),
    $points: document.querySelector('#points'),
    $time: document.querySelector('#time'),
    $result: document.querySelector('.leaderboard'),
    $field: document.querySelector('.cubes__field'),
    $save: document.querySelector('#save'),
    $score: document.querySelector('#score'),
    $name: document.querySelector('#name'),
    $clear: document.querySelector('#clear'),
    $close: document.querySelector('.close')
};

let arrCubes = [];
let points = 0;
let curTime = time;
let isStart = false;
let timerId = null;
let leaderboard = [];

// function for leaderboard
function loadLeaderboard() {
    dom.$time.value = secondsToString(time);
    leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    if (leaderboard.length) {
        renderLeaderboard();
    } else {
        dom.$result.innerHTML = `<p>No results</p>`;
    }
}

function saveLeaderboard(newLine) {
    leaderboard.push(newLine);
    leaderboard.sort((a, b) => b.points - a.points);
    renderLeaderboard();
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

function renderLeaderboard() {
    dom.$result.innerHTML = '';
    dom.$clear.removeAttribute('disabled');
    leaderboard.forEach((el, i) => {
        const $line = document.createElement('p');
        $line.innerHTML = `<b>${i + 1}.</b> ${el.name} - ${el.points}`
        dom.$result.append($line);
    });
}
// ---------------------------------


function generateNewCubes(n) {
    if (n > 100) {
        alert('No more than 100 cubes');
        return;
    }

    for (let i = 0; i < n; i++) {
        const color = getRandomColor();
        const size = getRandom(minSizeCube, maxSizeCube);

        // generate a new unique position that the cubes did not overlap
        let position = null;
        do {
            position = getRandomPosition(dom.$field, size);
        } while (checkUniquePosition(arrCubes, size, position));

        // create new cube
        const options = {
            parent: dom.$field,
            color: color,
            size: size,
            position: position,
            isStart: isStart,
            callbacks: {
                removeFromArray: removeCube,
                upPointsEvent: addPonits,
                upTimeEvent: addTime
            }
        };
        const cube = new Cube(options);
        arrCubes.push(cube);
        if (isStart) {
            cube.addEventClick();
        }
    }
}

function removeCube(cube) {
    arrCubes = arrCubes.filter(el => el !== cube);
}

function addPonits(pts) {
    points += pts;
    dom.$points.value = (points < 10) ? '0' + points : points;

    // generate new cubes
    // if the field has less than 4 cubes, then add 2 new ones
    const n = (arrCubes.length < 4)? 2 : getRandom(0, 2);
    generateNewCubes(n);
}

function addTime(time) {
    curTime += time;
    dom.$time.value = secondsToString(curTime);
}

function removeAllCubes() {
    arrCubes.forEach(cube => cube.remove());
    arrCubes = [];
}

function endGame() {
    pauseGame();
    $('#myModal').modal('show');
    dom.$score.value = points;
}

// Listeners
function initListeners() {
    dom.$new_game.addEventListener('click', newGame);
    dom.$start.addEventListener('click', startGame);
    dom.$pause.addEventListener('click', pauseGame);
    dom.$save.addEventListener('click', saveResult);
    dom.$clear.addEventListener('click', clearStorage);
    dom.$close.addEventListener('click', closeForm);
}

function newGame() {
    isStart = false;
    removeAllCubes();
    generateNewCubes(startCubes);
    points = 0;
    dom.$points.value = '00';
    dom.$time.value = secondsToString(time);
    if (curTime !== time) {
        curTime = time;
        pauseGame();
    }
}

function startGame() {
    isStart = true;
    arrCubes.forEach(cube => cube.addEventClick());
    timerId = setInterval(() => {
        curTime -= 1;
        dom.$time.value = secondsToString(curTime);
        if (curTime === 0) {
            endGame();
        }
    }, 1000);
    dom.$start.setAttribute('hidden', '');
    dom.$pause.removeAttribute('hidden');
}

function pauseGame() {
    isStart = false;
    dom.$pause.setAttribute('hidden', '');
    dom.$start.removeAttribute('hidden');
    clearInterval(timerId);
    timerId = null;
    arrCubes.forEach(cube => cube.removeEventClick());
}

function saveResult() {
    const name = dom.$name.value.trim();
    if (name) {
        $('#myModal').modal('hide');
        const newLine = {
            name,
            points
        };
        saveLeaderboard(newLine);
        newGame();
        dom.$name.classList.remove('is-invalid');
    } else {
        dom.$name.classList.add('is-invalid');
    }

}

function clearStorage() {
    localStorage.removeItem('leaderboard');
    leaderboard = [];
    dom.$result.innerHTML = `<p>No results</p>`;
    dom.$clear.setAttribute('disabled', '');
}

function closeForm() {
    newGame();
}
// End listeners


// -------------START---------------------------------
loadLeaderboard();
initListeners();
generateNewCubes(startCubes);
