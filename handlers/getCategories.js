const AWS = require('aws-sdk');
const ssm = new AWS.SSM();
const sqs = new AWS.SQS(); // Initialize the SQS instance

const IMPORT_QUEUE_URL = process.env.IMPORT_QUEUE_URL; // Queue URL from environment variables

// Helper function to fetch parameters from SSM
const getParameter = async (name) => {
  const params = {
    Name: name,
    WithDecryption: true, // To decrypt the parameter if it's encrypted
  };

  const result = await ssm.getParameter(params).promise();
  return result.Parameter.Value;
};

exports.handler = async (event) => {
  try {
    console.log("Received event:", JSON.stringify(event, null, 2)); // Debugging

    let requestBody;

    // Ensure event.body is parsed correctly
    if (typeof event.body === "string") {
      requestBody = JSON.parse(event.body);
    } else {
      requestBody = event.body; // Assume it's already parsed
    }

    // Retrieve parameters from SSM
    const wooBaseUrl = await getParameter('/WooBaseUrl');
    const consumerKey = await getParameter('/WooConsumerKey');
    const consumerSecret = await getParameter('/WooConsumerSecret');

    if (!wooBaseUrl || !consumerKey || !consumerSecret) {
      console.error("Missing required parameters from SSM.");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required parameters." })
      };
    }

    console.log("Using SSM parameters:", { wooBaseUrl, consumerKey, consumerSecret });

    // Send the import task to SQS
    const messageBody = JSON.stringify({
      wooBaseUrl,
      consumerKey,
      consumerSecret
    });

    console.log("Sending message to SQS:", messageBody);

    const params = {
      QueueUrl: IMPORT_QUEUE_URL,
      MessageBody: messageBody
    };

    // Send message to SQS
    await sqs.sendMessage(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Import process has started. It will run asynchronously." }),
    };

  } catch (error) {
    console.error("Error sending message to SQS:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to start import process", details: error.message }),
    };
  }
};
