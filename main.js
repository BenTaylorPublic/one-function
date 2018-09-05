/**
 * Times I've broke my browser with an infite loop: 3
 */

// Called initially from the body onload event
// Every resulting call is done internally via RECURSION
async function OneFunction(param) {
    console.log(param);
    console.log(typeof param);
    if (param == null) {
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
        var currentLocation = {
            x: 80,
            y: 45
        };

        while (true) { //TODO: Break on escape
            var somethingChanged = false;
            if (window.keyLeft) {
                window.keyLeft = false;
                currentLocation.x--;
                somethingChanged = true;
            }
            if (window.keyRight) {
                window.keyRight = false;
                currentLocation.x++;
                somethingChanged = true;
            }
            if (window.keyUp) {
                window.keyUp = false;
                currentLocation.y--;
                somethingChanged = true;
            }
            if (window.keyDown) {
                window.keyDown = false;
                currentLocation.y++;
                somethingChanged = true;
            }
            if (somethingChanged) {
                var newCell = document.getElementById("cell-" + currentLocation.x + "-" + currentLocation.y);
                newCell.className = "blackCell";
                console.log("SET");
            }
            // Sleep 10ms, otherwise UI DIES
            await new Promise(resolve => setTimeout(resolve, 10));
        }
        return;
    } else if (callType === 1) {
        // TODO: Single game loop logic
        return;
    }

    throw "You should never get here";
}