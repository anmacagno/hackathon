// Dependencies
var aws = require('aws-sdk');
var util = require('util');
var path = require('path');

// Get reference to ElasticTranscoder client
var transcoder = new aws.ElasticTranscoder({region: 'us-east-1'});

exports.handler = function(event, context, callback) {

    // Read options from the event
    console.log("Reading options from event:\n", util.inspect(event, {depth: 5}));
    var srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    var dstKey = srcKey.replace('originals', 'transcoded');

    // Job params
    var params = {
        PipelineId: '1599490378122-wkdz3j',
        Input: {
            Key: srcKey,
            TimeSpan: {
                StartTime: '00:00:00.000',
                Duration: '00:00:02.000' // 2 seconds
            },
            FrameRate: 'auto',
            Resolution: 'auto',
            AspectRatio: 'auto',
            Interlaced: 'auto',
            Container: 'auto'
        },
        Output: {
            Key: dstKey,
            ThumbnailPattern: dstKey.replace(path.extname(dstKey), '') + '-{count}',
            PresetId: '1599490626621-3nn602' // Generic 720p
        }
    };

    // Transcode video from S3
    transcoder.createJob(params, function(err, data) {
        if (err) {
            console.error(`Unable to transcode ${srcKey} to ${dstKey} due to an error: ${err}`);
        } else {
            console.log(`Successfully transcoded ${srcKey} to ${dstKey}`);
        }
        callback(null, "Success");
    });
};
