// Design Pattern: MVC

let modelController = (function () {
    let data = [[' ', ' ', ' '],[' ', ' ', ' '],[' ', ' ', ' ']];
    let playero = 0;
    let playerx = 0;

    let resetData = function (turn) {
        data = [[' ', ' ', ' '],[' ', ' ', ' '],[' ', ' ', ' ']];
    };

    return {
        getData: function () {
            return data;
        },

        putdata: function(row, col, turn) {
            data[row][col] = turn;
        },

        logData: function () {
            return data;
        },

        updatePlayero: function() {
            return ++playero;
        },

        updatePlayerx: function() {
            return ++playerx;
        },

        reset: function() {
            resetData();
        },
    }
})();




// userInterface Controller
let viewController = (function (modelCtrl) {
    let DOMStrings = {
        container: ".container",
        won: ".won",
        loss: ".loss",
        tie: '.tie',
        win: ".win",
        hide: "hide",
        playerWin: ".player-win",
        turn: ".turn",
        roundStat: "round-stat",
        playerOScore: "player-o-score",
        playerXScore: "player-x-score",
        playerO: "player-o",
        playerX: "player-x",
        winNote: "win-note",
    };

    let DOMElements = {
        roundStat: document.querySelector(`.${DOMStrings.roundStat}`),
        playerOScore: document.querySelector(`.${DOMStrings.playerOScore}`),
        playerXScore: document.querySelector(`.${DOMStrings.playerXScore}`),
        playerO: document.querySelector(`.${DOMStrings.playerO}`),
        playerX: document.querySelector(`.${DOMStrings.playerX}`),
    };

    let insert = function (row, col, turn) {
        document.getElementById(row.toString() + "-" + col.toString()).textContent = turn;
    };

    let tieDispaly = function () {
        // document.querySelector(DOMStrings.tie).style.display='inline-block';
        DOMElements.roundStat.classList.remove(DOMStrings.hide);
        DOMElements.roundStat.textContent = "Game Tied";

    };

    let wonDispaly = function (turn) {
        DOMElements.roundStat.classList.remove(DOMStrings.hide);
        DOMElements.roundStat.textContent = `Player ${turn.toUpperCase()} Won`;
        changeTurn(turn);
    };
    let clearScreen = function () {
        let i, j, element;
        for(i = 0; i < 3; i++) {
            for(j = 0; j < 3;j++) {
                element = i.toString() + "-" + j.toString();
                document.getElementById(element).textContent="";
            }
        }
        DOMElements.roundStat.classList.add(DOMStrings.hide);
        modelCtrl.reset();
    };

    let changeTurn = (turn) => {
        if (turn === 'o') {
            document.querySelector(DOMStrings.turn).style.left = "18%";
        } else {
            document.querySelector(DOMStrings.turn).style.left = "68%";
        }
    };

    const updateScore = (turn, score) => {
        if (turn === "o") {
            DOMElements.playerOScore.textContent = score;
        } else if (turn === "x") {
            DOMElements.playerXScore.textContent = score;
        }
    };

    const animateScoreBox = (turn) => {
        const player = document.querySelector(`.player-${turn}`);
        player.classList.add(DOMStrings.winNote);
        setTimeout(() => {
            player.classList.remove(DOMStrings.winNote)
        }, 2000);
    };

    return {
        getDOMStrings: function () {
            return DOMStrings;
        },

        insert : function (row, col, turn) {
            insert(row, col, turn);
        },

        tie: function () {
            tieDispaly();
        },

        won: function (turn) {
            wonDispaly(turn);
        },

        changeTurn: function(turn) {
            changeTurn(turn);
        },

        loss: function () {
            lossDispaly();
        },

        reset: function() {
            clearScreen();
        },

        updateScore: function (turn, score) {
            updateScore(turn, score);
        },

        animateScoreBox: function (turn) {
            animateScoreBox(turn);
        },

    };
})(modelController);




let checking = (function (viewCtrl, modelCtrl) {
    let checkIns = function (row, col, turn) {
        let data, check = false;
        data = modelCtrl.getData();
        check = data[row][col] === ' ';
        if(check === true) {
            let check;
            modelCtrl.putdata(row, col, turn);
            viewCtrl.insert(row, col, turn);
            check = checkWon(data, turn);
            if(check === true) {
                return 2;
            }
            check = checkTie();
            if(check === true) {
                viewCtrl.tie();
            }
            return 1;
        } else {
            return 0;
        }
    };

    let checkTie = function () {
        let data;
        data = modelCtrl.getData();
        for(let i = 0; i < 3; i++) {
            if(data[i].includes(' ')) {
                return false;
            }
        }
        return true;
    };

    let checkWon = function (data, turn) {
        if(checkForCol(data, turn) | checkForRows(data, turn) | checkForDiag(data, turn) | checkForRdiag(data, turn)) {
            viewCtrl.won(turn);
            return true;
        }
    };

    let checkForCol = function (data, turn) {
        let col = [], count = 0;
        for(let i = 0; i < 3 ; i++) {
            for(let j = 0; j < 3; j++) {
                col[j] = data[j][i]
            }
            for(let k = 0; k < 3; k++) {
                if(col[k] === turn) {
                    count++;
                } else {
                    count = 0;
                    break;
                }
            }
            if(count === 3) {
                return true;
            }
        }
        return false;
    };

    let checkForRows = function (data, turn) {
        let i = 0, j = 0, count = 0;
        for(i = 0; i < 3; i++) {
            let items = data[i];
            for(j = 0; j < 3; j++) {
                if(items[j] === turn) {
                    count++;
                } else {
                    count = 0;
                }
            }
            if(count === 3) {
                return true;
            }
        }
        return false;
    };

    let checkForDiag = function (data, turn) {
        let d0 = data[0][0], d1 = data[1][1], d2 = data[2][2];
        return turn === d0 && turn === d1 && turn === d2;


    };

    let checkForRdiag = function (data, turn) {
        let d0 = data[0][2], d1 = data[1][1], d2 = data[2][0];
        return turn === d0 && turn === d1 && turn === d2;
    };

    return {
        checkIns: function (row, col, turn) {
            return checkIns(row, col, turn);
        },

    }

})(viewController, modelController);




// machineControl
// For automation (Inprogress)
// let machineControl = (function (modelCtrl, viewCtrl, checking) {
//     let data = modelCtrl.getData();
//     let DOMStrings = viewCtrl.getDOMStrings();
//     let randomPoint = function() {
//         let pos = Math.floor(Math.random() * 9);
//
//     };
// })(modelController, viewController, checking);




// Controller
let gameController = (function (modelCtrl, viewCtrl, checking) {
    let turn = 'o';
    let setupEventListener = function() {
        let DOMStrings = viewCtrl.getDOMStrings();
        document.querySelector(DOMStrings.container).addEventListener('click', check);

    };

    let removeEventListeners = function () {
        let DOMStrings = viewCtrl.getDOMStrings();
        let element = document.querySelector(DOMStrings.container);
        element.removeEventListener('click', check, false);
    };


    let check = function (event) {
        let item_id, a, element, is_ins = 1, x = 'x', o = 'o';
        item_id = event.target.id;
        a = item_id.split('-');
        element = document.getElementById(item_id);
        try {
            is_ins = checking.checkIns(parseInt(a[0]), parseInt(a[1]), turn);
        } catch (err) {
        }
        if(is_ins === 1) {
            turn = (turn === 'o') ? 'x' : 'o';
            viewCtrl.changeTurn(turn);
        } else if(is_ins === 2) {
            let score = 0;
            if (turn === "x") {
                score = modelCtrl.updatePlayerx();
            } else if (turn === "o") {
                score = modelCtrl.updatePlayero();
            }
            viewCtrl.animateScoreBox(turn);
            viewCtrl.updateScore(turn, score);
            removeEventListeners();
        }
    };

    let clearScreen = function () {
        viewCtrl.reset();
        turn = (turn === 'o')?'x':'o';
        viewCtrl.changeTurn(turn);
    };



    return {
        init: function() {
            setupEventListener();
        },

        finish : function () {
            removeEventListener();
        },

        reset: function () {
            clearScreen();
            setupEventListener();
        }
    };
})(modelController, viewController, checking);


(function () {
    gameController.init();
})();
