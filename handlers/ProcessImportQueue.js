const { processImport } = require("../services/categoryService");
const { createImport } = require("../repositories/dynamoService");

exports.handler = async (event) => {  // Use the correct Lambda handler
  try {
    console.log("Received SQS event:", JSON.stringify(event, null, 2));
    
    for (const record of event.Records) {
      try {
        const { wooBaseUrl, consumerKey, consumerSecret } = JSON.parse(record.body);
        if (!wooBaseUrl || !consumerKey || !consumerSecret) {
          console.error("Invalid SQS message format:", record.body);
          continue;
        }
        const importId = await createImport();  // This will now work since it is exported
        await processImport(importId, wooBaseUrl, consumerKey, consumerSecret);  // Process the import
      } catch (error) {
        console.error("Failed to process SQS message:", error);
      }
    }
    return { statusCode: 200, body: JSON.stringify({ message: "Import process completed." }) };
  } catch (error) {
    console.error("Error processing SQS message:", error);
    return { statusCode: 500, body: JSON.stringify({ error: "Failed to process import." }) };
  }
};