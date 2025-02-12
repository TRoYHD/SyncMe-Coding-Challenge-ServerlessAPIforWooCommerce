const categoryService = require("../services/categoryService");

exports.handler = async (event) => {
  try {
    console.log("Received event:", JSON.stringify(event, null, 2)); // Debugging

    for (const record of event.Records) {
      console.log("Received message body:", record.body); // Log the received message body

      let messageBody;

      // Ensure message body is parsed correctly
      try {
        messageBody = JSON.parse(record.body);
      } catch (err) {
        console.error("Failed to parse SQS message body:", record.body);
        continue; // Skip this record if parsing fails
      }

      const { wooBaseUrl, consumerKey, consumerSecret } = messageBody;

      if (!wooBaseUrl || !consumerKey || !consumerSecret) {
        console.error("Missing required parameters in SQS message:", messageBody);
        continue; // Skip this record if parameters are missing
      }

      try {
        // Fetch categories from WooCommerce and store them in DynamoDB
        const categories = await categoryService.getCategories(wooBaseUrl, consumerKey, consumerSecret);

        console.log("Categories fetched and stored successfully:", categories);
      } catch (fetchError) {
        console.error("Error fetching categories:", fetchError);
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
