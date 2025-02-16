const categoryService = require("../repositories/dynamoService");

exports.handler = async () => {
  try {
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
