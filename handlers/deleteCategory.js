const categoryService = require("../services/categoryService");

exports.handler = async (event) => {
  try {
    const categoryId = event.pathParameters.id;
    const { wooBaseUrl, consumerKey, consumerSecret } = JSON.parse(event.body);

    if (!categoryId || !wooBaseUrl || !consumerKey || !consumerSecret) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing required parameters." }) };
    }

    // Delete category from DynamoDB
    const result = await categoryService.deleteCategoryFromStore(categoryId);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: result.message }),
    };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
