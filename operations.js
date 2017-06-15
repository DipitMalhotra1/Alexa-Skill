/**
 * Created by dipit on 6/15/17.
 */
'use strict';
var request = require('request');
var _ = require('lodash');

var url = 'http://alexa-filtered.herokuapp.com/status/false';
var interviews={}
var date = require('date-and-time');
interviews.candidate=new Array()

var getDate= function(date){
    var d = new Date(date);
    var curr_date = d.getDate();
    var curr_month = d.getMonth() + 1; //Months are zero based
    var curr_year = d.getFullYear();

    if(curr_month < 10)
        curr_month = "0"+curr_month;
    if(curr_date < 10)
        curr_date = "0"+curr_date;
    var curr_date_format = curr_year+"-"+curr_month+"-"+curr_date;
    return curr_date_format;

}





var getDetails= function (callback) {



    request.get({
        url: url,
        json: true,
        headers: {'User-Agent': 'request'}
    }, (err, res, data) => {
        if (err) {

            console.log('Error:', err);
        } else if (res.statusCode !== 200) {

            console.log('Status:', res.statusCode);
        } else {
            for (var i = 0; i < data.length; i++) {
                var temp_item = data[i];
                var d= new Date(temp_item.submitDate)
                interviews.candidate.push({
                    "Status": temp_item.isFinished,
                    "candidateName": _.get(temp_item, 'submitter[0].displayName'),
                    "submitDate":getDate(temp_item.submitDate),
                    "Position": temp_item.interviewName
                });


            }
            callback (interviews);
        }
    })
};




// getDetails(function(result){
//     console.log(result)
// })

module.exports.getDetails=getDetails