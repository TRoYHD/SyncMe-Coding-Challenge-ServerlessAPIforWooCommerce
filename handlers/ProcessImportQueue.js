const categoryService = require("../services/categoryService");
const { updateImportStatus } = require("../repositories/dynamoService");

exports.handler = async (event) => {
  try {
    console.log("Received event:", JSON.stringify(event, null, 2));

    for (const record of event.Records) {
      console.log("Received message body:", record.body);

      let messageBody;
      try {
        messageBody = JSON.parse(record.body);
      } catch (err) {
        console.error("Failed to parse SQS message body:", record.body);
        continue;
      }

      const { wooBaseUrl, consumerKey, consumerSecret } = messageBody;

      if (!wooBaseUrl || !consumerKey || !consumerSecret) {
        console.error("Missing required parameters in SQS message:", messageBody);
        continue;
      }

      try {
        // Update status to "in-progress" before fetching
        await updateImportStatus("in-progress", wooBaseUrl);

        const categories = await categoryService.getCategories(wooBaseUrl, consumerKey, consumerSecret);

        console.log("Categories fetched and stored successfully:", categories);

        // Update status to "success" after successful import
        await updateImportStatus("success", wooBaseUrl);
      } catch (fetchError) {
        console.error("Error fetching categories:", fetchError);

        // Update status to "failed" in case of error
        await updateImportStatus("failed", wooBaseUrl);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Import process completed successfully." }),
    };

  } catch (error) {
    console.error("Error processing SQS message:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to process import.", details: error.message }),
    };
  }
};
