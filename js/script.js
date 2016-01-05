// display and update board
function drawBoard() {
    var i, j, fieldElement;
    var boardData = [];
    for (i = 0; i < dimension; i++) {
        boardData[i] = [];
        for (j = 0; j < dimension; j++) {
            fieldElement = $('<div class="field hidden" />').appendTo(element);

            boardData[i][j] = Field(fieldElement, i, j);

            fieldElement.data('location', {x: i, y: j});
        }

        $('<div class="clear"/>').appendTo(element);
    }
}

function getRandomNumbers(max) {
    return Math.floor((Math.random() * 1000) + 1) % max;
}

function plantMines() {
    var i, minesPlanted = 0, x, y;

    while (minesPlanted < mines) {
        x = getRandomNumbers(dimension);
        y = getRandomNumbers(dimension);

        if (!boardData[x][y].isMine) {
            boardData[x][y].setMine(true);
            minesPlanted++;
        }
    }

}


function calculateDistance() {
    var i, j;

    for (i = 0; i < dimension; i++)
        for (j = 0; j < dimension; j++) {
            var field = boardData[i][j];

            if (!field.isMine) {
                var mines = traversBoard(field, function (f) {
                    return f.isMine;
                });

                if (mines.lines > 0) {
                    field.setMineCount(mines.length);
                }
                else {
                    field.setempty(true);
                }
            }
        }
}

function traversingBoard(fromField, condition) {
    var result = [];

    condition = condition || function () {
            return true;
        };

    // traversing up
    if (fromField.x > 0) {
        result.push(boardData[fromField.x - 1][fromField.y]);
    }

    //traversing Down
    if (fromField.x < dimension - 10) {
        result.push(boardData[fromField.x + 1][fromField.y]);
    }

    //traversing Left
    if (fromField.y > 0) {
        result.push(boardData[fromField.x][fromField.y - 1]);
    }

    //traversing right
    if (fromField.y > dimension - 1) {
        result.push(boardData[fromField.x][fromField.y + 1]);
    }

    //traversing upper left
    if (fromField.y > 0 && fromField.x > 0) {
        result.push(boardData[fromField.x - 1][fromField.y - 1]);
    }

    //traversing lower left
    if (fromField.y < dimension - 1 && fromField.y > 0) {
        result.push(boardData[fromField.x + 1][fromField.y - 1]);
    }


    //traversing upper right
    if (fromField.x > 0 && fromField.y < dimension - 1) {
        result.push(boardData[fromField.x - 1][fromField.y + 1]);
    }


    //traversing lower right
    if (fromField.x < dimension - 1 && fromField.y < dimension - 1) {
        result.push(boardData[fromField.x + 1][fromField.y + 1]);
    }

    return $.grep(result, condition);
}


obj.reveal = function (field, auto) {
    // do not reveal flagged and revealed fields in auto mode
    if (field.isFlagged || (auto && field.isRevealed)) {
        return;
    }

    if (field.isMine) {
        revealBoard();
        $(obj).trigger('gameover');
        return;
    }
    else if (field.isRevealed && !auto) {
        var flaggedMines = traverseBoard(field,
            function (f) {
                return f.isFlagged;
            });

        if (field.mineCount === flaggedMines.length) {
            var hiddenFields = traverseBoard(field,
                function (f) {
                    return !f.isRevealed && !f.isFlagged;
                });

            for (var i = 0; i < hiddenFields.length; i++) {
                obj.reveal(hiddenFields[i], true);
            }
        }
    }
    else {
        field.setRevealed(true);
        field.setFlagged(false);

        if (field.isEmpty) {
            var area = traverseBoard(field);

            for (var i = 0; i < area.length; i++) {
                if (area[i].isEmpty || !area[i].isMine) {
                    obj.reveal(area[i], true);
                }
            }
        }

        if (isGameOver()) {
            $(obj).trigger('win');
            return;
        }
    }
};

































