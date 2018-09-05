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
            gameOver: false
        };

        while (!gameState.gameOver) { //TODO: Break on escape
            OneFunction({
                callType: 1,
                gameState: gameState
            });
            // Sleep 10ms, otherwise UI DIES
            await new Promise(resolve => setTimeout(resolve, 10));
        }
        console.info("GAME OVER - Main game loop over, refresh to replay");
        return;
    } else if (callType === 1) {
        if (window.keyLeft) {
            window.keyLeft = false;
            if (param.gameState.facing != 2) {
                param.gameState.facing = 0;
            }
        }
        if (window.keyUp) {
            window.keyUp = false;
            if (param.gameState.facing != 3) {
                param.gameState.facing = 1;
            }
        }
        if (window.keyRight) {
            window.keyRight = false;
            if (param.gameState.facing != 0) {
                param.gameState.facing = 2;
            }
        }
        if (window.keyDown) {
            window.keyDown = false;
            if (param.gameState.facing != 1) {
                param.gameState.facing = 3;
            }
        }

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

        try {
            var newCell = document.getElementById("cell-" + param.gameState.headX + "-" + param.gameState.headY);
            newCell.className = "blackCell";
        } catch (ex) {
            console.info("Issue with drawing the head");
            console.info(param.gameState);
            param.gameState.gameOver = true;
        }
        return;
    }

    throw "You should never get here";
}