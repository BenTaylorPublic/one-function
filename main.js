// Called initially from the body onload event
// Every resulting call is done internally via RECURSION
async function OneFunction(param) {
    const yLimit = 45;
    const xLimit = 80;
    if (param == null) {
        console.info("Generating the board");
        /*
         * When the param is null, it's the initial setup of the game board
         * After, we start the main game loop 
         */
        var body = document.getElementsByTagName("body")[0];
        var table = document.createElement("table");

        for (let y = 0; y < yLimit; y++) { //For each row
            var tableRow = document.createElement("tr");
            for (let x = 0; x < xLimit; x++) { //For each column
                var tableCell = document.createElement("td");
                tableCell.id = "cell-" + x.toString() + "-" + y.toString();
                tableRow.appendChild(tableCell);
            }
            table.appendChild(tableRow);
        }
        body.appendChild(table);

        // Attaching the keydown events to the window
        window.addEventListener("keydown", (event) => {
            OneFunction(event);
        });

        console.info("Finished generating the board");
        OneFunction({
            callType: 0
        });
        return;
    }

    // Not the initial setup
    const callType = param.callType;

    if (callType == null) {
        // Hopefully a keyboard event
        if (param.keyCode === 37) {
            window.keyLeft = true;
        } else if (param.keyCode === 38) {
            window.keyUp = true;
        } else if (param.keyCode === 39) {
            window.keyRight = true;
        } else if (param.keyCode === 40) {
            window.keyDown = true;
        }
        return;
    } else if (callType === 0) {
        console.info("Begining the main game loop");
        var gameState = {
            headX: Math.round(xLimit / 2),
            headY: Math.round(yLimit / 2),
            facing: 0,
            score: 0,
            gameOver: false,
            berryX: 25,
            berryY: 25,
            tail: []
        };

        // Populating the tail, change how long it is initially here
        for (let i = 0; i < 4; i++) {
            gameState.tail.push({
                x: gameState.headX + i,
                y: gameState.headY
            });
        }

        // Initial draw
        document.getElementById("cell-" + gameState.headX + "-" + gameState.headY).className = "blackCell";
        for (let i = 0; i < gameState.tail.length; i++) {
            document.getElementById("cell-" + gameState.tail[i].x + "-" + gameState.tail[i].y).className = "blackCell";
        }
        document.getElementById("cell-" + gameState.berryX + "-" + gameState.berryY).className = "magentaCell";

        while (!gameState.gameOver) {
            OneFunction({
                callType: 1,
                gameState: gameState
            });
            // Sleep 10ms, otherwise UI DIES
            await new Promise(resolve => setTimeout(resolve, 30));
        }
        // Remove the body and berry from board
        OneFunction({
            callType: 4,
            gameState: gameState
        });
        // Restart the game
        OneFunction({
            callType: 0
        });
        return;
    } else if (callType === 1) {
        // Single game loop function

        // Determining which way the snake is now facing
        if (window.keyLeft) {
            window.keyLeft = false;
            if (param.gameState.facing != 2) {
                param.gameState.facing = 0;
            }
        } else if (window.keyUp) {
            window.keyUp = false;
            if (param.gameState.facing != 3) {
                param.gameState.facing = 1;
            }
        } else if (window.keyRight) {
            window.keyRight = false;
            if (param.gameState.facing != 0) {
                param.gameState.facing = 2;
            }
        } else if (window.keyDown) {
            window.keyDown = false;
            if (param.gameState.facing != 1) {
                param.gameState.facing = 3;
            }
        }

        // Adding the old head to the tail
        param.gameState.tail.unshift({
            x: param.gameState.headX,
            y: param.gameState.headY
        });

        // Updating the headX and headY
        if (param.gameState.facing === 0) {
            // Left
            param.gameState.headX--;
        } else if (param.gameState.facing === 1) {
            // Up
            param.gameState.headY--;
        } else if (param.gameState.facing === 2) {
            // Right
            param.gameState.headX++;
        } else if (param.gameState.facing === 3) {
            // Down
            param.gameState.headY++;
        }

        // Collision detection - Wall
        if (param.gameState.headX < 0 || param.gameState.headX >= xLimit) {
            // Hit the left or right wall
            console.info("You hit a wall");
            param.gameState.gameOver = true;
            // Call Gameover
            OneFunction({
                callType: 3,
                gameState: param.gameState
            });
            return;
        } else if (param.gameState.headY < 0 || param.gameState.headY >= yLimit) {
            // Hit the top or bottom
            console.info("You hit a wall");
            param.gameState.gameOver = true;
            // Call Gameover
            OneFunction({
                callType: 3,
                gameState: param.gameState
            });
            return;
        }

        // Collision detection - tail
        for (let i = 0; i < param.gameState.tail.length; i++) {
            const tailCell = param.gameState.tail[i];
            if (param.gameState.headX === tailCell.x && param.gameState.headY === tailCell.y) {
                console.info("You hit your tail");
                param.gameState.gameOver = true;
                // Call Gameover
                OneFunction({
                    callType: 3,
                    gameState: param.gameState
                });
            }
        }

        // Berry collection
        if (param.gameState.headX === param.gameState.berryX && param.gameState.headY === param.gameState.berryY) {
            // Add to score
            param.gameState.score++;
            // Berry has been collected
            var randomNumberVariables1 = {
                randomNumber: 0,
                randomNumberMin: 0,
                randomNumberMax: xLimit - 1
            };
            OneFunction({
                callType: 2,
                randomNumberVariables: randomNumberVariables1
            });
            var newXLocation = randomNumberVariables1.randomNumber;

            var randomNumberVariables2 = {
                randomNumber: 0,
                randomNumberMin: 0,
                randomNumberMax: yLimit - 1
            };
            OneFunction({
                callType: 2,
                randomNumberVariables: randomNumberVariables2
            });
            var newYLocation = randomNumberVariables2.randomNumber;

            param.gameState.berryX = newXLocation;
            param.gameState.berryY = newYLocation;
            // Redrawing the berry 
            document.getElementById("cell-" + param.gameState.berryX + "-" + param.gameState.berryY).className = "magentaCell";

        } else { //Only undraw and remove the tail if no berry was collected
            // Undrawing the last tail
            try {
                document.getElementById("cell-" + param.gameState.tail[param.gameState.tail.length - 1].x + "-" + param.gameState.tail[param.gameState.tail.length - 1].y).className = "";
            } catch (ex) {
                console.error("Issue with clearing the tail");
                console.error(param.gameState);
            }
            // Removing the last tail from the array
            param.gameState.tail.pop();
        }

        // Drawing head
        try {
            document.getElementById("cell-" + param.gameState.headX + "-" + param.gameState.headY).className = "blackCell";
        } catch (ex) {
            console.error("Issue with drawing the head");
            console.error(param.gameState);
        }
        return;
    } else if (callType === 2) {
        // Random number
        param.randomNumberVariables.randomNumber = Math.floor(Math.random() * (param.randomNumberVariables.randomNumberMax - param.randomNumberVariables.randomNumberMin + 1)) + param.randomNumberVariables.randomNumberMin;
        return;
    } else if (callType === 3) {
        // Game over score alert
        if (param.gameState.score === 0) {
            // Let people know they're terrible
            alert("You didn't get any berries. Did you even try?");
            return;
        }

        // Game over screen and restart
        var firstMessageHalf = "Game over! You ate " + param.gameState.score;
        var berryPlural = (param.gameState.score != 1) ? " berries" : " berry";

        alert(firstMessageHalf + berryPlural);
        return;
    } else if (callType === 4) {
        // Using the game state to remove the body and berry

        for (let i = 0; i < param.gameState.tail.length; i++) {
            try {
                document.getElementById("cell-" + param.gameState.tail[i].x + "-" + param.gameState.tail[i].y).className = "";
            } catch (ex) {
                console.error("Issue with clearing the game board upon death (tail)");
                console.error(param.gameState);
            }
        }

        try {
            document.getElementById("cell-" + param.gameState.berryX + "-" + param.gameState.berryY).className = "";
        } catch (ex) {
            console.error("Issue with clearing the game board upon death (berry)");
            console.error(param.gameState);
        }

        return;
    }

    throw "You should never get here";
}