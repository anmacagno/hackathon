# AWS Serverless POC
In this hackathon we implemented a proof of concept using AWS services (IAM, S3, SQS, DynamoDB, Lambda, Elastic Transcoder and CloudWatch).

## runa_resize_image

This function will be executed when a new image is stored in an S3 bucket and the objective is to resize the original image.

- npm install async
- npm install --arch=x64 --platform=linux sharp

## runa_transcode_video

This function will be executed when a new video is stored in an S3 bucket and the objective is to generate a preview of the original video.

## runa_update_events

This function will be executed when there are elements in an SQS queue and the objective is to insert the paylod of the messages in a DynamoDB database.
