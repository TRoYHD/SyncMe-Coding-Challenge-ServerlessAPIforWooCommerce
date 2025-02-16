const { processImport } = require("../services/categoryService");
const { createImport } = require("../dbService/dynamoService");

exports.handler = async (event) => {
  try {
    console.log("Received SQS event:", JSON.stringify(event, null, 2));

    for (const record of event.Records) {
      try {
        const { wooBaseUrl, consumerKey, consumerSecret } = JSON.parse(
          record.body
        );
        if (!wooBaseUrl || !consumerKey || !consumerSecret) {
          console.error("Invalid SQS message format:", record.body);
          continue;
        }
        const importId = await createImport();
        await processImport(importId, wooBaseUrl, consumerKey, consumerSecret);
      } catch (error) {
        console.error("Failed to process SQS message:", error);
      }
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Import process completed." }),
    };
  } catch (error) {
    console.error("Error processing SQS message:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to process import." }),
    };
  }
};
