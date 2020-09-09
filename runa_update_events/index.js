// Dependencies
var aws = require('aws-sdk');

// Get reference to DynamoDB client
var ddb = new aws.DynamoDB();

exports.handler = function(event, context, callback) {
    console.log(`Processing ${event.Records.length} events`);

    event.Records.forEach(function(record) {
        // Params
        var params = {
          TableName: 'RUNA_EVENTS',
          Item: {
            'EVENT_ID': {N: '001'},
            'EVENT_NAME': {S: record.body}
          }
        };

        // Add the item to the table
        ddb.putItem(params, function(err, data) {
          if (err) {
            console.error("Error", err);
          } else {
            console.log("Success", data);
          }
        });
    });
};
