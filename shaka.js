// import { checkboxValue, radioValue, selectValue } from "./eachGameOptions/out.js";

let numbersOption = {
    time: 3,
    reader: 'on',
    language: 'english'
}, playerScore = 0

let canIMove = true, power_1 = 0, power_2 = 0, timer = numbersOption.time + 1, ready1 = false, ready2 = false, index = 0,
    optionPressed = null, inputFocus = false, position_index_1 = 1, position_index_2 = 10,
    randomLetter, letterIndex = 1, buttons, utterance, buttons_1, buttons_2, clickedLetter,
wantedButton, randomArray = [], i = 0, j = 0, randomNumber, group, canIOpenGame = false,
    tens, string, inWord = '', buttonsLetter,
    headPartContents_2, headPartContents_1, letterEnds = false,
    pages, canICount = false,
    otherChecked_1 = [...document.querySelectorAll('.founded-by-player2')],
    otherChecked_2 = [...document.querySelectorAll('.founded-by-player1')],
    randomed_1 = randomPowered(0, otherChecked_1.length - 1),
    randomed_2 = randomPowered(0, otherChecked_2.length - 1),
    controller1 = {
        color: '#008000',
        up: 'KeyW',
        right: 'KeyD',
        down: 'KeyS',
        left: 'KeyA',
        confirm: 'CapsLock',
    }, controller2 = {
        color: '#ffa500',
        up: 'ArrowUp',
        right: 'ArrowRight',
        down: 'ArrowDown',
        left: 'ArrowLeft',
        confirm: 'Enter',
    }
const levels = [3, 2, 1, 'Go!']
const screenIcon = document.querySelector('#screen')
const white = [...document.querySelectorAll('.white-theme')]
const dark = [...document.querySelectorAll('.dark-theme')]
const startInputs = [...document.querySelectorAll('section#numbers-head input')]
const optionInputs = [...document.querySelectorAll('#options #player-controls input')]
const optionInputs1 = [...document.querySelectorAll('#options #player-controls #controls1 input')]
const optionInputs2 = [...document.querySelectorAll('#options #player-controls #controls2 input')]
const player1 = {
    name: 'KWIZERA Emmanuel',
    move: 0,
    power: 0,
    saves: 0,
    stolen: 0,
    score: 0,
}
const player2 = {
    name: 'GATETE Fidel',
    move: 0,
    power: 0,
    saves: 0,
    stolen: 0,
    score: 0,
}
const flipInputs = document.querySelectorAll('#names dir.flip')
const playersName = document.querySelectorAll('#names dir.flip input')
const interval = setInterval(levelDisplay, 1000);
const names = document.querySelector('#names')
const numbersContainer = document.querySelector('section#numbers-parent')
const randomNumberArray = getRndInteger(1, 100)
const words = [
    [
        'na', 'mirongo', 'rimwe', 'kabiri', 'gatatu', 'kane', 'gatanu', 'gatandatu', 'karindwi', 'umunane',
        'ikenda', 'icumi', 'cumi', 'makumyabiri', 'itatu', 'ine', 'itanu', 'itandatu', 'irindwi',
        'nane', 'ikenda', 'ijana', "n'"
    ], [
        'na', 'moja', 'mbili', 'tatu', 'nne', 'tano', 'sita', 'saba', 'nane', 'kumi', 'ishirini', ''
    ], [
        'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
        'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty', 'thirty',
        'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety', 'one hundred',
    ], [
        'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix',
        'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf',
        'vingt', 'vingt-et-un', 'vingt-deux', 'vingt-trois', 'vingt-quatre', 'vingt-cinq', 'vingt-six',
        'vingt-sept', 'vingt-huit', 'vingt-neuf', 'trente', 'trente-et-un', 'trente-deux', 'trente-trois',
        'trente-quatre', 'trente-cinq', 'trente-six', 'trente-sept', 'trente-huit', 'trente-neuf',
        'quarante', 'quarante-et-un', 'quarante-deux', 'quarante-trois', 'quarante-quatre', 'quarante-cinq',
        'quarante-six', 'quarante-sept', 'quarante-huit', 'quarante-neuf', 'cinquante', 'cinquante-et-un',
        'cinquante-et-deux', 'cinquante-trois', 'cinquante-quatre', 'cinquante-cinq', 'cinquante-six',
        'cinquante-sept', 'cinquante-huit', 'cinquante-neuf', 'soixante', 'soixante-et-un', 'soixante-deux',
        'soixante-trois', 'soixante-quatre', 'soixante-cinq', 'soixante-six', 'soixante-sept', 'soixante-huit',
        'soixante-neuf', 'soixante-dix', 'soixante-dix-et-onze', 'soixante-dix-douze', 'soixante-dix-treize',
        'soixante-dix-et-quatorze', 'soixante-dix-et-seize', 'soixante-dix-et-sept', 'soixante-dix-et-huit',
        'soixante-dix-et-neuf', 'quatre-vingts', 'quatre-vingt-un', 'quatre-vingt-deux', 'quatre-vingt-trois',
        'quatre-vingt-quatre', 'quatre-vingt-cinq', 'quatre-vingt-six', 'quatre-vingt-sept', 'quatre-vingt-huit',
        'quatre-vingt-neuf', 'quatre-vingt-dix', 'quatre-vingt-onze', 'quatre-vingt-douze', 'quatre-vingt-treize',
        'quatre-vingt-quatorze', 'quatre-vingt-quinze', 'quatre-vingt-seize', 'quatre-vingt-dix-sept',
        'quatre-vingt-dix-huit', 'quatre-vingt-neuf', 'cent'
    ], [
        'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII',
        'XVIII', 'XIX', 'XX', 'XXI', 'XXII', 'XXIII', 'XXIV', 'XXV', 'XXVI', 'XXVII', 'XXVIII', 'XXIX', 'XXX', 'XXXI',
        'XXXII', 'XXXIII', 'XXXIV', 'XXXV', 'XXXVI', 'XXXVII', 'XXXVIII', 'XXXIX', 'XL', 'XLI', 'XLII', 'XLIII', 'XLIV',
        'XLV', 'XLVI', 'XLVII', 'XLVIII', 'XLIX', 'L', 'LI', 'LII', 'LIII', 'LIV', 'LV', 'LVI', 'LVII', 'LVIII', 'LIX',
        'LX', 'LXI', 'LXII', 'LXIII', 'LXIV', 'LXV', 'LXVI', 'LXVII', 'LXVIII', 'LXIX', 'LXX', 'LXXI', 'LXXII', 'LXXIII',
        'LXXIV', 'LXXV', 'LXXVI', 'LXXVII', 'LXXVIII', 'LXXIX', 'LXXX', 'LXXXI', 'LXXXII', 'LXXXIII', 'LXXXIV', 'LXXXV',
        'LXXXVI', 'LXXXVII', 'LXXXVIII', 'LXXXIX', 'XC', 'XCI', 'XCII', 'XCIII', 'XCIV', 'XCV', 'XCVI', 'XCVII', 'XCVIII',
        'XCIX', 'C'
   ]
]

const cover = document.querySelector('#pause-cover')
const scoreElement_2 = [...document.querySelectorAll('.founded-by-player2')]
const inputs = [...document.querySelectorAll('section#numbers-head input')]
const playerWithHighScore = document.querySelector('#game-over #winner span')
// ¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬
// ¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬
// ¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬

const optionOpen = document.querySelector('button#startOption')
const optionClose = document.querySelector('button#endOption')
const optionParent = document.querySelector('#options')

optionOpen.addEventListener('click', () => {
    optionParent.style.display = 'flex'
})
optionClose.addEventListener('click', () => {
    optionParent.style.display = 'none'
})

optionInputs.forEach(input => {
    input.addEventListener('focus', e => {
        if (e.target.getAttribute('type') === 'text') {
            inputFocus = true 
            e.target.style.outline = 'auto'
        }
    })
});
addEventListener('keyup', e => {
    optionPressed = e.code
    if (inputFocus) {
        e.target.value = optionPressed
        inputFocus = false
        e.target.style.outline = 'none'
    }
    updateControllers()
})
addEventListener('keydown', pressed => {
    if (pressed.keyCode === 32 && index >= 3) {
        if (cover.classList.contains('pause')) {
            cover.classList.remove('pause')
        } else {
            cover.classList.add('pause')
        }
    }
})
addEventListener('keydown', pressed => {
    if (pressed.code === controller1.right) {
        move_1(1, pressed.keyCode)
    }
    if (pressed.code === controller1.left) {
        move_1(-1, pressed.keyCode)
    }
    if (pressed.code === controller1.down) {
        move_1(10, pressed.keyCode)
    }
    if (pressed.code === controller1.up) {
        move_1(-10, pressed.keyCode)
    }
    if (pressed.code === controller1.confirm) {
        check_1(position_index_1)
    }
})
addEventListener('keydown', pressed => {
    if (pressed.code === controller2.right) {
        move_2(1, pressed.keyCode)
    }
    if (pressed.code === controller2.left) {
        move_2(-1, pressed.keyCode)
    }
    if (pressed.code === controller2.down) {
        move_2(10, pressed.keyCode)
    }
    if (pressed.code === controller2.up) {
        move_2(-10, pressed.keyCode)
    }
    if (pressed.code === controller2.confirm) {
        check_2(position_index_2)
    }
})
addEventListener('load', () => {
    pageSelect()
    numbersDisplayer()
    kinyarwandaWord(10)
    movement_1(position_index_1, null, buttons_1);
    movement_2(position_index_2, null, buttons_2);
})
addEventListener('keyup', pressed => { ready(pressed) })

// ¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬
// ¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬
// ¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬¬

function levelDisplay() {
    const startButton = document.querySelector('#numbers #start')
    if (canIOpenGame) {
        if (index >= 3) {
            clearInterval(interval)
            startButton.focus()
            openFullScreen()
            openGame()
        }
        startButton.innerHTML = levels[index]
        startInputs[0].focus()
        index++
    }
}
function updateControllers() {
    controller1 = {
        // color: optionInputs1[0].value,
        up: optionInputs1[0].value,
        right: optionInputs1[1].value,
        down: optionInputs1[2].value,
        left: optionInputs1[3].value,
        confirm: optionInputs1[4].value,
    }
    controller2 = {
        // color: optionInputs2[0].value,
        up: optionInputs2[0].value,
        right: optionInputs2[1].value,
        down: optionInputs2[2].value,
        left: optionInputs2[3].value,
        confirm: optionInputs2[4].value,
    }
}
function ready(pressed) {
    if (playersName[0].value.trim() !== playersName[1].value.trim() && ready !== 2) {
        if (playersName[0].value.trim().length > 2) {
            if (pressed.code === controller1.confirm) {
                startInputs[0].value = playersName[0].value.trim()
                player1.name = playersName[0].value.trim()
                flipInputs[0].classList.add('ready')
                ready1 = true
            }
        }
        if (playersName[1].value.trim().length > 2) {
            if (pressed.code === controller2.confirm) {
                startInputs[1].value = playersName[1].value.trim()
                player2.name = playersName[1].value.trim()
                flipInputs[1].classList.add('ready')
                ready2 = true
            }
        }
        if (ready1 && ready2) {
            canIOpenGame = true
        }

    }
}
function openGame() {
    names.classList.add('open')
}
function openFullScreen() {
    var elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
    }
    screenIcon.setAttribute('onclick', 'closeFullScreen()')
    screenIcon.setAttribute('class', 'fas fa-compress')
    // screenIcon.classList[1] = 'fa-compress'
}
function closeFullScreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
    }
    screenIcon.setAttribute('onclick', 'openFullScreen()')
    screenIcon.setAttribute('class', 'fas fa-expand')
    // screenIcon.classList[1] = 'fa-expand'
}
function theme() {
    if (white.length < 1) {
        for (i = 0; i < dark.length; i++) {
            dark[i].classList.remove('dark-theme')
            dark[i].classList.add('white-theme')
        }
        return
    }
    if (dark.length < 1) {
        for (i = 0; i < white.length; i++) {
            white[i].classList.remove('white-theme')
            white[i].classList.add('dark-theme')
        }
    }
}
function numbersDisplayer() {
    for (i = 1; i <= 10; i++) {
        numbersContainer.innerHTML += `<div id="group${i}"></div>`;
        for (j = 1; j <= 10; j++) {
            group = numbersContainer.querySelector(`div#group${i}`)
            group.innerHTML += `<button class="number dark-theme"></button>`;
        }
    }
    buttons = [...numbersContainer.querySelectorAll(`button.number`)]
    for (i = 0; i < randomArray.length; i++) {
        buttons[i].innerHTML = randomArray[i]
    }
}
function getRndInteger(min, max) {
    while (i < max) {
        randomNumber = Math.floor(Math.random() * (max - min + 1)) + min
        if (randomArray.indexOf(randomNumber) === -1) {
            randomArray.push(randomNumber)
            i++;
        }
    }
    return randomArray
}

function englishWord(num) {
    string = `${num + ''}`
    if (string.length === 1) {
        inWord = words[2][string - 1]
    }
    if (string.length === 2) {
        if (string[0] == 1) {
            inWord = words[2][parseInt(string[1]) + 9]
        }
        if (string[0] != 0) {
            if (string[1] == 0 && string != 10) {
                inWord = `${words[2][parseInt(string[0] - 1) + 18]}`
            }
            if (string[1] != 0 && string > 20) {
                inWord = `${words[2][parseInt(string[0] - 1) + 18]} ${words[2][parseInt(string[1] - 1)]}`
            }
        }
    }
    if (string.length === 3 && string == 100) {
        inWord = words[2][27]
    }
    reader(`find ${inWord}`)
    return inWord
}
function reader(text) {
    if (numbersOption.reader !== 'off') {
        utterance = new SpeechSynthesisUtterance(text)
        utterance.rate = Number.isFinite(numbersOption.readingSpeed) ? numbersOption.readingSpeed : 1
        speechSynthesis.cancel()
        speechSynthesis.speak(utterance)
    }
}
function otherCheckedFunction() {
    otherChecked_1 = [...document.querySelectorAll('.founded-by-player2')]
    otherChecked_2 = [...document.querySelectorAll('.founded-by-player1')]
    console.log(otherChecked_2, otherChecked_1)
}
function randomPowered(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }
function move_1(goTo, key) {
    movement_1(position_index_1 += goTo, key);
}
function powered_1() {
    power_2 = 0
    power_1 += 1
    otherCheckedFunction()
    if (power_1 == 3) {
        player1.power++
        if (!otherChecked_1.length < 1) {
            otherChecked_1[randomed_1].classList.remove("founded-by-player2")
            otherChecked_1[randomed_1].classList.add("stolen1")
            scoreCounter_2()
        }
    }
}
function check_1(position_index_1) {
    headPartContents_1 = [...document.querySelectorAll('section#numbers-head span')]
    if (buttons_1[position_index_1 - 1].innerHTML == headPartContents_1[1].className) {
        buttons_1[position_index_1 - 1].classList.add("founded-by-player1")
        headPartContents_1[1].className = parseInt(headPartContents_1[1].className) + 1
        if (numbersOption.language === 'kinyarwanda') {
            headPartContents_1[1].textContent = kinyarwandaWord(parseInt(headPartContents_1[1].className))
        } else if (numbersOption.language === 'english') {
            headPartContents_1[1].textContent = englishWord(parseInt(headPartContents_1[1].className))
        } else if (numbersOption.language === 'france') {
            headPartContents_1[1].textContent = frenchWord(parseInt(headPartContents_1[1].className))
        } else if (numbersOption.language === 'roman') {
            headPartContents_1[1].textContent = romanWord(parseInt(headPartContents_1[1].className))
        }
        powered_1()
        scoreCounter_2()
        scoreCounter_1()
        gameOverShowWinner()
    }
    if (buttons_1[position_index_1 - 1].classList.contains('stolen1')) {
        buttons_1[position_index_1 - 1].classList.remove('stolen1')
        buttons_1[position_index_1 - 1].classList.add("founded-by-player1")
        player1.stolen++
        scoreCounter_1()
        power_1 = 0
    }
    if (buttons_1[position_index_1 - 1].classList.contains('stolen2')) {
        buttons_1[position_index_1 - 1].classList.remove('stolen2')
        buttons_1[position_index_1 - 1].classList.add("founded-by-player1")
        player1.saves++
        scoreCounter_1()
        power_1 = 0
    }
}
function scoreCounter_1() {
    const scoreElement_1 = [...document.querySelectorAll('.founded-by-player2')]
    headPartContents_1 = document.querySelector('section#numbers-head span#player2')
    player1.score = scoreElement_1.length
    headPartContents_1.textContent = player1.score 
    console.log(scoreElement_1)
}
function movement_1(goTo, key) {
    buttons_1 = [...document.querySelectorAll('section#numbers-parent div button')]
    if (goTo === 110 || goTo === 101) { position_index_1 = 1 }
    if (goTo === 101 && key === 40) { position_index_1 = 2 }
    if (101 < goTo && goTo < 110) { position_index_1 -= 99 }
    if (goTo < 1) { position_index_1 += 99 }
    if (goTo === -9) { position_index_1 = 100 }
    buttons_1.forEach(button => {
        if (button.classList.contains("position-of-player1")) {
            button.classList.remove("position-of-player1")
            player1.move++
        }
    });
    buttons_1[position_index_1 - 1].classList.add("position-of-player1")
}
function move_2(goTo, key) {
    movement_2(position_index_2 += goTo, key);
}
function powered_2() {
    power_1 = 0
    power_2 += 1
    otherCheckedFunction()
    if (power_2 == 3) {
        player2.power++
        if (!otherChecked_2.length < 1) {
            otherChecked_2[randomed_2].classList.remove("founded-by-player1")
            otherChecked_2[randomed_2].classList.add("stolen2")
            scoreCounter_2()
            scoreCounter_1()
        }
    }
}
function check_2(position_index_2) {
    headPartContents_2 = [...document.querySelectorAll('section#numbers-head span')]
    if (buttons_2[position_index_2 - 1].innerHTML == headPartContents_2[1].className) {
        buttons_2[position_index_2 - 1].classList.add("founded-by-player2")
        headPartContents_2[1].className = parseInt(headPartContents_2[1].className) + 1
        player2.score++
        if (numbersOption.language === 'kinyarwanda') {
            headPartContents_2[1].textContent = kinyarwandaWord(parseInt(headPartContents_2[1].className))
        } else if (numbersOption.language === 'english') {
            headPartContents_2[1].textContent = englishWord(parseInt(headPartContents_2[1].className))
        } else if (numbersOption.language === 'france') {
            headPartContents_2[1].textContent = frenchWord(parseInt(headPartContents_2[1].className))
        } else if (numbersOption.language === 'roman') {
            headPartContents_2[1].textContent = romanWord(parseInt(headPartContents_2[1].className))
        }
        powered_2()
        scoreCounter_2()
        scoreCounter_1()
        gameOverShowWinner()
    }
    if (buttons_2[position_index_2 - 1].classList.contains('stolen1')) {
        buttons_2[position_index_2 - 1].classList.remove('stolen1')
        buttons_2[position_index_2 - 1].classList.add("founded-by-player2")
        scoreCounter_2()
        scoreCounter_1()
        player2.saves++
        power_2 = 0
    }
    if (buttons_2[position_index_2 - 1].classList.contains('stolen2')) {
        player2.stolen++
        buttons_2[position_index_2 - 1].classList.remove('stolen2')
        buttons_2[position_index_2 - 1].classList.add("founded-by-player2")
        scoreCounter_2()
        scoreCounter_1()
        power_2 = 0
    }
}
function scoreCounter_2() {
    const scoreElement_2 = [...document.querySelectorAll('.founded-by-player1')]
    headPartContents_2 = document.querySelector('section#numbers-head span#player1')
    player2.score = scoreElement_2.length
    headPartContents_2.textContent = player2.score
}
function movement_2(goTo, key) {
    buttons_2 = [...document.querySelectorAll('section#numbers-parent div button')]
    if (goTo === 110 || goTo === 101) { position_index_2 = 1 }
    if (goTo === 101 && key === 40) { position_index_2 = 2 }
    if (101 < goTo && goTo < 110) { position_index_2 -= 99 }
    if (goTo < 1) { position_index_2 += 99 }
    if (goTo === -9) { position_index_2 = 100 }
    buttons_2.forEach(button => {
        if (button.classList.contains("position-of-player2")) {
            button.classList.remove("position-of-player2")
            player2.move++
        }
    });
    buttons_2[position_index_2 - 1].classList.add("position-of-player2")
}
function gameRecords() {

}
function gameOverShowWinner() {
    const gameover = document.querySelector('#game-over')
    const gameoverNames = [...document.querySelectorAll('#game-over .names p')]
    const gameoverMoves = [...document.querySelectorAll('#game-over #move span')]
    const gameoverPowers = [...document.querySelectorAll('#game-over #power span')]
    const gameoverSaves = [...document.querySelectorAll('#game-over #saves span')]
    const gameoverStolens = [...document.querySelectorAll('#game-over #stolen span')]
    const gameoverScores = [...document.querySelectorAll('#game-over #score span dir')]
    scoresAndFound = [...document.querySelectorAll('section#numbers-head span')]
    if (scoresAndFound[1].className == `101`) {
        gameover.style.display = 'flex'
        gameoverNames[0].textContent = player1.name
        gameoverNames[1].textContent = player2.name
        gameoverMoves[0].textContent = player1.move
        gameoverMoves[1].textContent = player2.move
        gameoverPowers[0].textContent = player1.power
        gameoverPowers[1].textContent = player2.power
        gameoverSaves[0].textContent = player1.saves
        gameoverSaves[1].textContent = player2.saves
        gameoverStolens[0].textContent = player1.stolen
        gameoverStolens[1].textContent = player2.stolen
        gameoverScores[0].textContent = player2.score
        gameoverScores[1].textContent = player1.score
        if (parseInt(player1.score) > parseInt(player2.score)) {
            playerWithHighScore.textContent = player2.name
        } else if (parseInt(player2.score) > parseInt(player1.score)) {
            playerWithHighScore.textContent = player1.name
        } else {
            playerWithHighScore.textContent = player1.name
            player2.score
        }
        scoresAndFound[1].parentElement.textContent = `Done`
    }
}
function pageSelect() {
    pages = [...document.querySelector('#pages').children]
    pages.forEach(page => {
        page.addEventListener('mouseover', () => {
            for (let i = 0; i < pages.length; i++) {
                if (pages[i].classList.contains('over')) {
                    pages[i].classList.remove('over')
                }
            }
            page.classList.add('over')
        })
    });
}
function page2Confirme() {
    const sections = document.querySelectorAll('#container > section')
    const start = sections[0].querySelector('#names')
    const intro = document.querySelector('#introPage')
    intro.style.display = 'none'
    start.style.display = 'flex'
    sections.forEach(section => {
        section.style.display = 'none'
    });
    sections[0].style.display = 'flex'
    selectValue('language')
    selectValue('time')
}
buttonValue()
function buttonValue() {
    const numbersButton = document.querySelector(`button#numbersChoice`)
    numbersButton.addEventListener('click', () => {
        page2Confirme()
    })
}

function radioValue(name) {
    const radios = [...document.querySelectorAll(`input[type=radio][name=${name}]`)]
    radios.forEach(radio => {
        radio.addEventListener('input', e => {
            if (name === 'reader') {
                numbersOption.reader = e.target.value
            }
            return e.target.value;
        })
    });
}

function checkboxValue(id) {
    const check = document.querySelector(`input[type=checkbox]#${id}`)
    check.addEventListener('change', e => {
        if (id === 'target-check') {
            numbersOption.showTarget = e.target.checked
        }
    })
}

function selectValue(id) {
    const select = document.querySelector(`select#${id}`)
    select.addEventListener('input', e => {
        if (id === 'time') {
            numbersOption.time = parseFloat(e.target.value)
        }
        if (id === 'reading-speed') {
            numbersOption.readingSpeed = parseFloat(e.target.value)
        }
        if (id === 'language') {
            numbersOption.language = e.target.value
            setupLanguageFind(numbersOption.language)
        }
    })
}
function setupLanguageFind(language) {
    const setup = document.querySelector('section#numbers-head > div')
    if (language === 'kinyarwanda') {
        setup.innerHTML = `<p>Shaka:</p><span id="current-target" class="1">Rimwe</span>`
    } else if (language === 'english') {
        setup.innerHTML = `<p>Find:</p><span id="current-target" class="1">One</span>`
    } else if (language === 'france') {
        setup.innerHTML = `<p>Chercher:</p><span id="current-target" class="1">Un</span>`
    } else if (language === 'roman') {
        setup.innerHTML = `<p>Find:</p><span id="current-target" class="1">I</span>`
    }
}

function frenchWord(num) { return words[3][num - 1] }
function romanWord(num) { return words[4][num - 1] }