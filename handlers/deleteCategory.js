const categoryService = require("../services/categoryService");

exports.handler = async (event) => {
  try {
    console.log("Incoming event:", JSON.stringify(event, null, 2));

    // Extract category ID from path parameters
    const categoryId = event.pathParameters?.id;
    
    if (!categoryId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing category ID in request path." }),
      };
    }

    // Delete category from DynamoDB
    const result = await categoryService.deleteCategoryFromStore(categoryId);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: result.message }),
    };
  } catch (error) {
    console.error("Error deleting category:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to delete category." }),
    };
  }
};
