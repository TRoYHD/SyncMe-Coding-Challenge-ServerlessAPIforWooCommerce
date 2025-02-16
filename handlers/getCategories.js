const AWS = require('aws-sdk');
const ssm = new AWS.SSM();
const sqs = new AWS.SQS(); // Initialize the SQS instance

const IMPORT_QUEUE_URL = process.env.IMPORT_QUEUE_URL; // Queue URL from environment variables

const getParameter = async (name) => {
  try {
    const result = await ssm.getParameter({ Name: name, WithDecryption: true }).promise();
    return result.Parameter.Value;
  } catch (error) {
    console.error(`Error fetching SSM parameter ${name}:`, error);
    throw new Error(`Failed to fetch SSM parameter: ${name}`);
  }
};

exports.handler = async (event) => {
  try {
    const wooBaseUrl = await getParameter('/WooBaseUrl');
    const consumerKey = await getParameter('/WooConsumerKey');
    const consumerSecret = await getParameter('/WooConsumerSecret');

    if (!wooBaseUrl || !consumerKey || !consumerSecret) {
      throw new Error("Missing required parameters from SSM.");
    }

    console.log("Using SSM parameters:", { wooBaseUrl });
    
    const messageBody = JSON.stringify({ wooBaseUrl, consumerKey, consumerSecret });
    console.log("Sending message to SQS:", messageBody);

    await sqs.sendMessage({ QueueUrl: IMPORT_QUEUE_URL, MessageBody: messageBody }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Import process has started." }),
    };
  } catch (error) {
    console.error("Error starting import process:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to start import.", details: error.message }),
    };
  }
};
