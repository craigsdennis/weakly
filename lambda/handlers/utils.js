function incrementDay(context) {
    const totalDays = context.attributes['events'].length;
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
    const currentIndex = context.attributes['eventChoiceIndex'];
    if (context.attributes['listings'].length > currentIndex[1]) {
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

function updateListings(context, listings) {
    context.attributes['listings'] = listings;
    // Reset the event index
    context.attributes['eventChoiceIndex'][1] = 0;
}

function dayInfoFromContext(context) {
    const eventChoiceIndex = context.attributes['eventChoiceIndex'];
    const eventCounts = context.attributes['events'];
    // First dimension is day
    return eventCounts[eventChoiceIndex[0]];
}

function eventInfoFromContext(context) {
    const eventChoiceIndex = context.attributes['eventChoiceIndex'];
    // Second dimension is event index
    return context.attributes['listings'][eventChoiceIndex[1]];
}

module.exports = {
    'dayInfoFromContext': dayInfoFromContext,
    'eventInfoFromContext': eventInfoFromContext,
    'incrementDay': incrementDay,
    'decrementDay': decrementDay,
    'incrementEvent': incrementEvent,
    'decrementEvent': decrementEvent,
    'updateListings': updateListings
};