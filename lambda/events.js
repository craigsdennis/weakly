const Eventful = require('./lib/eventful');
const moment = require('moment');

exports.countsForWeek = function(location, starting='today') {
    if (starting === 'today') {
        starting = new Date();
    }
    const startingMoment = moment(starting);
    const moments = [startingMoment];
    // Gets the following Sunday
    const endingMoment = startingMoment.clone().endOf('week').add(1, 'days');
    // Build a range of dates
    let nextDay = startingMoment.clone().add(1, 'days');
    while (!nextDay.isSame(endingMoment, 'day')) {
        moments.push(nextDay);
        nextDay = nextDay.clone().add(1, 'days');
    }
    moments.push(endingMoment);
    const searches = moments.map(m => searchDay(location, m, true));
    return Promise.all(searches).then(results => {
        return results.map((count, index) => {
            return {
                friendlyDay: moments[index].format('dddd MMMM Do'),
                day: moments[index].format(),
                count: count
            };
        });
    });
}

function searchDay(location, day='today', isCountOnly=false, pageNumber=1) {
    if (day === 'today') {
        day = new Date();
    }
    const startingMoment = moment(day);
    // Trailing zeros are weird Eventful API requirements
    const fmt = 'YYYYMMDD00';
    return new Promise((resolve, reject) => {
        const searchParams = {
            page_size: 1,
            page_number: pageNumber,
            category: 'music,comedy',
            include: 'categories,popularity',
            date: `${startingMoment.format(fmt)}-${startingMoment.format(fmt)}`,
            sort_order: 'popularity',
            location: location,
            change_multi_day_start: true,
            within: 15
        };
        if (isCountOnly) {
            searchParams.count_only = true;
        }
        Eventful.searchEvents(searchParams).then(data => {
            if (isCountOnly) {
                resolve(data.total_items);
            } else {
                let eventsResponse = data.events.event;
                if (!Array.isArray(eventsResponse)) {
                    eventsResponse = [eventsResponse];
                }
                const eventData = eventsResponse.map(event => {
                    return {
                        id: 'EVENTFUL::' + event.id,
                        url: event.url,
                        title: event.title.replace('&', 'and'),
                        startTime: event.start_time,
                        venue: event.venue_name.replace('&', 'and')
                    };
                });
                resolve(eventData);
            }
        });
    });
};

exports.searchDay = searchDay;