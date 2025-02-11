const AWS = require('aws-sdk');
const sqs = new AWS.SQS();
const IMPORT_QUEUE_URL = process.env.IMPORT_QUEUE_URL; // Queue URL from environment variables

exports.handler = async (event) => {
  try {
    const { wooBaseUrl, consumerKey, consumerSecret } = JSON.parse(event.body);

    if (!wooBaseUrl || !consumerKey || !consumerSecret) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing required parameters." }) };
    }

    // Send the import task to SQS
    const messageBody = JSON.stringify({
      wooBaseUrl,
      consumerKey,
      consumerSecret
    });

    const params = {
      QueueUrl: IMPORT_QUEUE_URL,  // The SQS queue URL
      MessageBody: messageBody      // The task details
    };

    // Send the message to SQS
    await sqs.sendMessage(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Import process has started. It will run asynchronously." }),
    };
  } catch (error) {
    console.error("Error sending message to SQS:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to start import process" }),
    };
  }
};
