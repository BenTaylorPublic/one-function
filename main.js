OneFunction();
function OneFunction(param) {
    if (param == null) {
        //TODO: Main game setup
        OneFunction({
            callType: 0
        });
        return;
    }
    const callType = param.callType;
    if (callType === 0) {
        // TODO: Main game loop
    } else if (callType === 1) {
        // TODO: Single game loop logic
    }
}
