const categoryService = require("../services/categoryService");

exports.handler = async (event) => {
  try {
    for (const record of event.Records) {
      const { wooBaseUrl, consumerKey, consumerSecret } = JSON.parse(record.body);

      // Fetch categories from WooCommerce and store them in DynamoDB
      const categories = await categoryService.getCategories(wooBaseUrl, consumerKey, consumerSecret);

      console.log("Categories fetched and stored successfully:", categories);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Import process completed successfully." }),
    };
  } catch (error) {
    console.error("Error processing SQS message:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to process import." }),
    };
  }
};
