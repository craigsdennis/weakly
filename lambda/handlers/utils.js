function incrementDay(context) {
    const totalDays = context.attributes.counts.length;
    if (context.attributes['eventChoiceIndex'][0] < totalDays) {
        // Safely increment the day
        context.attributes['eventChoiceIndex'][0] += 1;
        return true;
    }
    return false;
}

function decrementDay(context) {
    if (context.attributes['eventChoiceIndex'][0] > 0) {
        // Safely decrement the day
        context.attributes['eventChoiceIndex'][0] -= 1;
        return true;
    }
    return false;
}

function incrementEvent(context) {
    const dayInfo = dayInfoFromContext(context);
    const currentIndex = context.attributes['eventChoiceIndex'];
    if (dayInfo.count > currentIndex[1]) {
        // Safely increment the event
        context.attributes['eventChoiceIndex'][1] += 1;
        return true;
    }
    return false;
}

function decrementEvent(context) {
    if (context.attributes['eventChoiceIndex'][1] > 0) {
        // Safely decrement the event
        context.attributes['eventChoiceIndex'][1] -= 1;
        return true;
    }
    return false;
}

function dayInfoFromContext(context) {
    const eventChoiceIndex = context.attributes['eventChoiceIndex'];
    const eventCounts = context.attributes.counts;
    // First dimension is day
    return eventCounts[eventChoiceIndex[0]];
}

function eventPageNumberFromContext(context) {
    const eventChoiceIndex = context.attributes['eventChoiceIndex'];
    // Second dimension is event index
    return eventChoiceIndex[1] + 1;
}

function forwardIfRelated(context, Handler, otherwiseFn) {
    const intent = context.event.request.intent;
    if (Handler && Handler.isStateRelated && Handler.isStateRelated(intent)) {
        context.handler.state = Handler.STATE;
        context.emitWithState(intent.name);
    } else {
        otherwiseFn();
    }
}

function setCounts(context, counts) {
    context.attributes.counts = counts;
}

function clearCounts(context) {
    context.attributes.eventChoiceIndex = [0, 0];
    delete context.attributes.counts;
    delete context.attributes.currentEvent;
}

function hasCounts(context) {
    return context.attributes.counts !== undefined;
}

function currentEventFromContext(context) {
    return context.attributes.currentEvent;
}

function setCurrentEvent(context, event) {
    context.attributes.currentEvent = event;
}

function getLocationPreference(context) {
    return context.attributes.preferences.location;
}

function setLocationPreference(context, location) {
    context.attributes.preferences.location = location;
    context.emit(':saveState');
}

function isReady(context) {
    if (context.attributes.preferences === undefined) {
        return false;
    }
    if (getLocationPreference(context) === undefined) {
        return false;
    }
    return true;
}

function debug(context, ...args) {
    console.log(`===(${context.attributes.STATE})===>`, ...args);
}


module.exports = {
    dayInfoFromContext,
    eventPageNumberFromContext,
    currentEventFromContext,
    setCurrentEvent,
    setCounts,
    clearCounts,
    hasCounts,
    incrementDay,
    decrementDay,
    incrementEvent,
    decrementEvent,
    getLocationPreference,
    setLocationPreference,
    isReady,
    forwardIfRelated,
    debug
};