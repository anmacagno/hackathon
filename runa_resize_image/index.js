// Dependencies
var async = require('async');
var aws = require('aws-sdk');
var sharp = require('sharp');
var util = require('util');

// Constants
var MAX_WIDTH = 750;
var MAX_HEIGHT = 450;

// Get reference to S3 client
var s3 = new aws.S3();

exports.handler = function(event, context, callback) {

    // Read options from the event
    console.log("Reading options from event:\n", util.inspect(event, {depth: 5}));
    var srcBucket = event.Records[0].s3.bucket.name;
    var srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    var dstBucket = srcBucket;
    var dstKey = srcKey.replace('originals', 'resized');
    
    // Infer the image type
    var typeMatch = srcKey.match(/\.([^.]*)$/);
    if (!typeMatch) {
        callback("Could not determine the image type.");
        return;
    }
    var imageType = typeMatch[1].toLowerCase();
    if (imageType != "jpg" && imageType != "jpeg" && imageType != "png") {
        callback(`Unsupported image type: ${imageType}`);
        return;
    }

    // Download the image from S3, transform, and upload to a different location
    async.waterfall([

        function download(next) {
            // Download the image from S3 into a buffer
            s3.getObject({ Bucket: srcBucket, Key: srcKey }, next);
        },

        function transform(response, next) {
            // Transform the image buffer in memory
            sharp(response.Body)
                .resize({
                    width: MAX_WIDTH,
                    height: MAX_HEIGHT
                })
                .toFormat(imageType)
                .toBuffer()
                .then(function(buffer) {
                    next(null, response.ContentType, buffer);
                });
        },

        function upload(contentType, data, next) {
            // Stream the transformed image to a different location
            s3.putObject({ Bucket: dstBucket, Key: dstKey, Body: data, ContentType: contentType }, next);
        }

    ], function (err) {
        if (err) {
            console.error(`Unable to resize ${srcBucket}/${srcKey} and upload to ${dstBucket}/${dstKey} due to an error: ${err}`);
        } else {
            console.log(`Successfully resized ${srcBucket}/${srcKey} and uploaded to ${dstBucket}/${dstKey}`);
        }
        callback(null, "Success");
    });
};
