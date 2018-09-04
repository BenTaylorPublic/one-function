// Called initially from the body onload event
// Every resulting call is done internally via RECURSION
function OneFunction(param) {
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

        OneFunction({
            callType: 0
        });
        return;
    }

    // Not the initial setup
    const callType = param.callType;
    if (callType === 0) {
        // TODO: Main game loop
    } else if (callType === 1) {
        // TODO: Single game loop logic
    }
}
