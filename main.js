/**
 * Times I've broke my browser with an infite loop: 3
 */

// Called initially from the body onload event
// Every resulting call is done internally via RECURSION
async function OneFunction(param) {
    if (param == null) {
        console.info("Generating the board");
        /*
         * When the param is null, it's the initial setup of the game board
         * After, we start the main game loop 
         */
        var body = document.getElementsByTagName("body")[0];
        var table = document.createElement("table");

        // Game board will by 160:90 for now
        for (let y = 0; y < 90; y++) { //For each row
            var tableRow = document.createElement("tr");
            for (let x = 0; x < 160; x++) { //For each column
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
        // TODO: Escape key
        return;
    } else if (callType === 0) {
        console.info("Begining the main game loop");
        var gameState = {
            headX: 80,
            headY: 45,
            facing: 0,
            gameOver: false,
            berryX: 25,
            berryY: 25,
            tail: [
                {
                    x: 81,
                    y: 45
                },
                {
                    x: 82,
                    y: 45
                },
                {
                    x: 83,
                    y: 45
                },
                {
                    x: 84,
                    y: 45
                }
            ]
        };

        // Initial draw
        document.getElementById("cell-" + gameState.headX + "-" + gameState.headY).className = "blackCell";
        for (let i = 0; i < gameState.tail.length; i++) {
            document.getElementById("cell-" + gameState.tail[i].x + "-" + gameState.tail[i].y).className = "blackCell";
        }
        document.getElementById("cell-" + gameState.berryX + "-" + gameState.berryY).className = "magentaCell";


        while (!gameState.gameOver) { //TODO: Break on escape
            OneFunction({
                callType: 1,
                gameState: gameState
            });
            // Sleep 10ms, otherwise UI DIES
            await new Promise(resolve => setTimeout(resolve, 30));
        }
        console.info("GAME OVER - Main game loop over, refresh to replay");
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

        // Collision detection
        if (param.gameState.headX < 0 || param.gameState.headX >= 160) {
            // Hit the left or right wall
            console.info("You hit a wall");
            param.gameState.gameOver = true;
            return;
        } else if (param.gameState.headY < 0 || param.gameState.headY >= 90) {
            // Hit the top or bottom
            console.info("You hit a wall");
            param.gameState.gameOver = true;
            return;
        }


        // Berry collection
        if (param.gameState.headX === param.gameState.berryX && param.gameState.headY === param.gameState.berryY) {
            // Berry has been collected
            var randomNumberVariables1 = {
                randomNumber: 0,
                randomNumberMin: 0,
                randomNumberMax: 160 - 1
            };
            OneFunction({
                callType: 2,
                randomNumberVariables: randomNumberVariables1
            });
            var newXLocation = randomNumberVariables1.randomNumber;

            var randomNumberVariables2 = {
                randomNumber: 0,
                randomNumberMin: 0,
                randomNumberMax: 90 - 1
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
                console.error("Issue with drawing the head");
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
    }

    throw "You should never get here";
}