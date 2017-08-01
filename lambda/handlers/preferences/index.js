const Alexa = require('alexa-sdk');
const LocationPreferenceHandler = require('./location');
const Utils = require('../utils');
const STATE = 'ChoosePreferences';

exports.isStateRelated = function(intent) {
    if (intent && intent.name !== undefined) {
        return intent.name.includes('Preferences');
    }
    return false;
}

exports.STATE = STATE;
exports.handler = Alexa.CreateStateHandler(STATE, {
    // TODO:  This is basically a dialog, but I'm afraid of the Beta ;)
    'NewSession': function () {
        // Root page
        this.emit('NewSession');
    },

    'PromptPreferences': function() {
        if (this.attributes.preferences === undefined) {
            this.attributes.preferences = {};
        }
        const location = Utils.getLocationPreference(this);
        Utils.debug(this, 'location is', location);
        if (location === undefined) {
            this.handler.state = LocationPreferenceHandler.STATE;
            this.emitWithState('PromptLocation');
        }
        this.emit(':ask', `Your stored location is ${location}. Is this correct?`);
    },

    'AMAZON.YesIntent': function() {
        Utils.clearCounts(this);
        // Root page
        this.emit('Begin');
    },

    'AMAZON.NoIntent': function() {
        this.emitWithState('SetLocationPreferenceIntent');
    },

    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Have a good week!');
    },

    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'Okay, have a great week!');
    },


    'ResetPreferencesIntent': function() {
        delete this.attributes.preferences;
        this.emitWithState('PromptPreferences');
    },

    'SetLocationPreferenceIntent': function() {
        this.handler.state = LocationPreferenceHandler.STATE;
        this.emitWithState('PromptLocation');
    },

    'Unhandled': function() {
        Utils.debug(this, 'Unhandled preferences');
        this.emitWithState('PromptPreferences');
    }

});
