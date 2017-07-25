const Alexa = require('alexa-sdk');
const Utils = require('../utils');
const PreferencesHandler = require('../preferences');
const STATE = 'ChooseLocationPreference';


exports.STATE = STATE;
exports.handler = Alexa.CreateStateHandler(STATE, {
    'NewSession': function () {
        // Root page
        this.handler.state = '';
        this.emitWithState('NewSession');
    },

    'PromptLocation': function() {
        const location = Utils.getLocationPreference(this);
        let msg = 'We need you to define your location. For example say "Set location to Portland, Oregon"';
        if (location !== undefined) {
            msg = `Your current location is ${location}.  To change this, say something like "Set location to Portland, Oregon"`;
        }
        this.emit(':ask', msg);
    },

    'SetLocationPreferenceIntent': function() {
        const location = this.event.request.intent.slots.Location.value;
        Utils.setLocationPreference(this, location);
        this.handler.state = PreferencesHandler.STATE;
        this.emitWithState('PromptPreferences');
    },

    'AMAZON.HelpIntent': function () {
        this.emitWithState('PromptLocation');
    },

    'Unhandled': function() {
        Utils.debug(this, 'Unhandled location');
        this.emitWithState('PromptLocation');
    }

});
