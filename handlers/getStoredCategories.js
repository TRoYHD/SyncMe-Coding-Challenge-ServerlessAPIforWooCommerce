const categoryService = require("../services/categoryService");

exports.handler = async () => {
  try {
    // Fetch stored categories from DynamoDB
    const categories = await categoryService.getStoredCategories();

    return {
      statusCode: 200,
      body: JSON.stringify({ categories }),
    };
  } catch (error) {
    console.error("Error retrieving stored categories:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to retrieve stored categories." }),
    };
  }
};
