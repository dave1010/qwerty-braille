// todo:
// forget pressed keys after a time (if others are held down)
// allow editing in textarea, maybe with a toggle like capslock
// github
// contractions
// multi-chord
// turn into a browser extension

var log = $('#log')[0],
    pressedKeys = {};

var pressedDiv = document.getElementById('pressed');
var chordDiv = document.getElementById('chord');
var characterDiv = document.getElementById('character');
var outputDiv = document.getElementById('output');
var output = '';

var currentChord = [];


var allCodes = {
    70: '1', // f 1 ⠁
    68: '2', // d 2 ⠂
    83: '3', // s 3 ⠄
    74: '4', // j 4 ⠈
    75: '5', // k 5 ⠐
    76: '6'  // l 6 ⠠
};

// ordered a-z
var brailleMap = {
    "1": "a",
    "12": "b",
    "14": "c",
    "145": "d",
    "15": "e",
    "124": "f",
    "1245": "g",
    "125": "h",
    "24": "i",
    "245": "j",
    "13": "k",
    "123": "l",
    "134": "m",
    "1345": "n",
    "135": "o",
    "1234": "p",
    "12345": "q",
    "1235": "r",
    "234": "s",
    "2345": "t",
    "136": "u",
    "1236": "v",
    "2456": "w",
    "1346": "x",
    "13456": "y",
    "1356": "z",

 	"2": ",", 
 	"23": ";", 
 	"25": ":", 
 	"256": ".", 
 	"236": "?", 
 	"235": "!", 
    "3": "‘",
    "36": "-"
};

unsupported = function(chord) {
    alert('Unsupported ' + chord);
}

var multiChords = {
    "3456": unsupported,
    "3": unsupported,
    "45": unsupported,
    "456": unsupported,
    "5": unsupported,
    "6": unsupported
};

/*
Character 	Braille 	Braille dots
number indicator 	⠼ 	3456
1 	⠼⠁ 	3456 1
2 	⠼⠃ 	3456 12
3 	⠼⠉ 	3456 14
4 	⠼⠙ 	3456 145
5 	⠼⠑ 	3456 15
6 	⠼⠋ 	3456 124
7 	⠼⠛ 	3456 1245
8 	⠼⠓ 	3456 125
9 	⠼⠊ 	3456 24
0 	⠼⠚ 	3456 245

Character 	Braille 	Braille dots
“ 	⠄⠶ 	3 2356
“ 	⠘⠦ 	45 236
” 	⠘⠴ 	45 356
‘ 	⠄⠦ 	3 236
’ 	⠄⠴ 	3 356
( 	⠐⠣ 	5 126
) 	⠐⠜ 	5 345
/ 	⠸⠌ 	456 34
\ 	⠸⠡ 	456 16
– (en dash) 	⠠⠤ 	6 36
— (em dash) 	⠐⠠⠤ 	5 6 36
*/




function currentKeys() {
    var current = [];
    for (code in allCodes) {
        if (pressedKeys[code] === true) {
            current.push(allCodes[code]);
        }
    }
    return current.sort();
}

function allUp() {
    chordDiv.innerHTML = numbersToBraille(currentChord);
    
    var chord = currentChord.sort().join('');

    if (multiChords[chord] !== undefined) {
        characterDiv.innerHTML = "🔜";

        // multiChords[chord](chord);
    } else if (brailleMap[chord] !== undefined) {
        characterDiv.innerHTML = brailleMap[chord];
        output += brailleMap[chord]
    } else {
        characterDiv.innerHTML = "✖";

    }

    currentChord = [];

    updateOutput();
}

function updateOutput() {
    outputDiv.innerHTML = output + '<span style="color:green;font-size:200%">‸</span>';
}

function showKeys() {
    pressedDiv.innerHTML = numbersToBraille(currentKeys());
}

function numbersToBraille(numbers) {
    // starting at 0
    var cells = [
        numbers.includes('1'),
        numbers.includes('2'),
        numbers.includes('3'),
        numbers.includes('4'),
        numbers.includes('5'),
        numbers.includes('6')
    ];

    var icons = cells.map(x => x ? '🔘': '⭕');
    return '<pre>'+ icons[0] + icons[3] + "\n" + icons[1] + icons[4] + "\n" + icons[2] + icons[5] + '</pre>';
}

$(document.body).keydown(function (evt) {
    // already pressed now
    if (pressedKeys[evt.keyCode] === true) {
        return;
    }

    // unsupported key
    if (allCodes[evt.keyCode] === undefined) {
        return;
    }

    pressedKeys[evt.keyCode] = true;

    // previously pressed
    if (currentChord.includes(allCodes[evt.keyCode])) {
        return;
    }

    currentChord.push(allCodes[evt.keyCode])
    // currentChord = currentChord.sort();

    showKeys();
});

$(document.body).keyup(function (evt) {
    // space
    if (evt.keyCode === 32) {
        output += ' ';
        updateOutput();
        return;
    }

    // backspace
    if (evt.keyCode === 8) {
        output = output.slice(0, -1);
        updateOutput();
        return;
    }
    
    // unsupported key
    if (allCodes[evt.keyCode] === undefined) {
        return;
    }
    
    showKeys();

    delete pressedKeys[evt.keyCode];

    if (Object.keys(pressedKeys).length === 0) {
        allUp();
    }
});
