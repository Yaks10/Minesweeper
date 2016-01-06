(function () {

    var rows = 10,
        cols = 10,
        bombCount = 10,
        width = 30,
        height = 30,
        board = [];


// Creating Game Board


    var canvas = document.getElementById("gCanvas");
    var context = canvas.getContext("2d");

    init();
    putBomb();
    draw();


    /**
     * This is public function
     *
     * 1. could be called once in initialization phase
     * 2. should be called on user click
     *
     * NOTE: ctx should be used (to draw something) only in this function, or other helper functions
     * that are being called ONLY from this function.
     * NOTE: no other draw functions should be called from other functions excpt 'draw' one
     */
    function draw() {

        // 1. always clear the board completely
        context.clearRect(0, 0, 400, 400);

        // 2. always draw grid
        context.fillStyle = "#c9c9c9";
        context.fillRect(0, 0, 300, 300);

        for (var i = 0; i < rows + 1; i++) {

            context.moveTo(0, i * width);
            context.lineTo(300, i * width);
            context.stroke();

        }
        for (var j = 0; j < cols + 1; j++) {

            context.moveTo(j * width, 0);
            context.lineTo(j * width, 300);
            context.stroke();

        }

        // 3. always draw all items
            // loope over all items, and check if need to draw particular item
                // if no leave blank
                // if yes, draw content

        for (i = 0; i < rows; i++) {
            for (j = 0; j < cols; j++) {
                var currentCell = board[i * rows + j];
                var x = j * width;
                var y = i * height;

                if (currentCell.visible == true) {
                    context.font = "20px Arial";
                    context.fillStyle = "red";
                    context.fillText(currentCell.content, x + 10, y + 20);
                }
            }
        }

    }


    function openZeroFields(pos) {

        // to eliminate duplicate walking thru cells
        if (board[pos].visited == true) {
            return;
        } else {
            board[pos].visited = true;
        }

        // we always need to open clicked cell, no matter what is it

        if (board[pos].content != 0) {
            board[pos].visible = true;
        } else if (board[pos].content != "*") {

            board[pos].visible = true;

            if (pos % rows != 0) {
                openZeroFields(pos - 1);
            }
            if ((pos + 1) % rows != 0) {
                openZeroFields(pos + 1);
            }
            if (pos > rows && pos < (rows * cols) - rows) {
                openZeroFields(pos - rows);
            }
            if (pos < (rows * cols) - rows) {
                openZeroFields(pos + rows);
            }
        }
    }

    /**
    //  //  Call this function IFF "*" was clicked
    */

    function gameFinish() {
        for (var i = 0; i < rows * cols; i++) {
            board[i].visible = true;
        }

        draw();
    }

//init array elements
    function init() {

        for (var i = 0; i < rows * cols; i++) {

            board[i] = {};
            board[i].content = 0;
            board[i].visible = false;
        }

        clearVisited();
    }


    /**
     //  //  This function will put "*" and numbers around cell containing "*".
                In the first loop (while) i have putted bombs ("*"), in the second, numbers ....
     */
// Bomb Init
    function putBomb() {

        var putedBombCount = 0;

        while (putedBombCount != bombCount) {

            var bombPlace = Math.round(Math.random() * 100);
            if (bombPlace == 100) {
                bombPlace = 99;
            }

            board[bombPlace].content = "*";
            putedBombCount++;
        }

        for (var i = 0; i < 100; i++) {

            if (board[i].content == "*") {

                if (i % 10 != 0 && board[i - 1].content != "*") {                                   // left

                    board[i - 1].content += 1;
                }

                if ((i - 9) % 10 != 0 && board[i + 1].content != "*") {                             //right

                    board[i + 1].content += 1;
                }

                if (i > rows && i < rows * cols - 1 ) {    // top, top-left, top-right

                    if (board[i - rows].content != "*") {
                        board[i - rows].content += 1;
                    }

                    if (board[i - rows - 1].content != "*" && i % 10 != 0) {

                        board[i - rows - 1].content += 1;
                    }
                    if (board[i - rows + 1].content != "*" && (i - 9) % 10 != 0) {

                        board[i - rows + 1].content += 1;
                    }
                }


                if (i < (rows * cols) - rows) {                   //bottom, bottom-right, bottom-left

                    if (board[i + rows].content != "*") {

                        board[i + rows].content += 1;
                    }

                    if (board[i + rows - 1].content != "*" && i % 10 != 0) {

                        board[i + rows - 1].content += 1;
                    }
                    if (board[i + rows + 1].content != "*" && (i - 9) % 10 != 0) {

                        board[i + rows + 1].content += 1;
                    }
                }
            }
        }
    }


// Catch click event
    document.addEventListener('click', function (e) {

        var mouseX = (event.clientX - (canvas.offsetLeft - canvas.scrollLeft)) - 2;
        var mouseY = (event.clientY - (canvas.offsetTop - canvas.scrollTop)) - 2;
        clearVisited();
        var position = cordToCell(mouseX, mouseY);

        // 1. call to my recursive function
        // 2. call draw function


        if (board[position].content == "*") {

            gameFinish(); // make all cells visible and draw board
        }
        else if (board[position].content == 0) {

            board[position].visible = true;
            openZeroFields(position);
            draw();
        } else {

            board[position].visible = true;
            draw();
        }

    }, false);


// convert clicked cordinates to cell position in array
    function cordToCell(x, y) {
        return parseInt(y / 30) * rows + parseInt(x / 30);
    }

    function clearVisited() {
        for (var i = 0; i < rows * cols; i++) {
            board[i].visited = false;
        }
    }

})()