'use strict';

var Alexa = require('alexa-sdk');
var assert = require('assert');
var dateFormat = require('dateformat');
var dboper = require('./operations');

var APP_ID = "amzn1.ask.skill.6a51579c-c159-46ce-969b-440a7470f215";
var SKILL_NAME = 'Filtered Portal';

var STOP_MESSAGE="Error"
exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        console.log("went in new session function");

        this.attributes['speechOutput'] = 'Welcome to ' + SKILL_NAME + ' .I can give you the details of all the interviews on your requested date.' + 'Which Date interviews are you looking for?';

        this.attributes['repromptSpeech'] = 'To find the interviews on  particular date, say something like, Tell me about Interview on 2017-04-09';
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])

    },
    'Interview': function () {
        console.log("went in new Date function");
        if(this.event.request.intent.slots.D.value!=undefined){
            var self = this;
            var date = this.event.request.intent.slots.D.value;
            if(date==undefined){
                self.tell(STOP_MESSAGE)
            }
            else{

                if(date==undefined) {

                        // var params = result.candidate[0].candidateName
                        self.emit('Unhandled');
                    }
                    else{

                        dboper.getDetails(function (result) {
                            for (var i=0;i<result.candidate.length;i++) {

                                if (date == result.candidate[i].submitDate) {
                                    var Result = "On " + date + " you have interview with " + result.candidate[i].candidateName + " for the position of " + result.candidate[i].Position;

                                    self.emit(':tell', Result);

                                }

                                else {
                                    console.log("Failed")
                                }
                            }

                        })


                    }
                // })
                };
                }

        else{
            // If the user either does not reply to the welcome message or says something that is not
            // understood, they will be prompted again with this text.
            this.attributes['speechOutput'] = 'Welcome to ' + SKILL_NAME + ' .I can give you the details of all the interviews on your requested date.' + 'Which Date interviews are you looking for?';

            this.attributes['repromptSpeech'] = 'To find the interviews on  particular date, say something like, Tell me about Interview on 2017-04-09';
            this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
        }
    },

    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'Unhandled': function() {
        this.emit(':tell', 'Sorry, I was unable to understand and process your request. Please try again.');
        this.emit('SessionEndedRequest');
    }
};