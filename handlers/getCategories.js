const categoryService = require("../services/categoryService");

exports.handler = async (event) => {
  try {
    const { wooBaseUrl, consumerKey, consumerSecret } = JSON.parse(event.body);

    if (!wooBaseUrl || !consumerKey || !consumerSecret) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing required parameters." }) };
    }

    // Fetch categories from WooCommerce and store them in DynamoDB
    const categories = await categoryService.getCategories(wooBaseUrl, consumerKey, consumerSecret);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Categories fetched and stored successfully", categories }),
    };
  } catch (error) {
    console.error("Error retrieving categories:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
