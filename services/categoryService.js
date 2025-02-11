const dynamoDB = require("../repositories/dynamoService");
const wooCommerceService = require("../repositories/dynamoService");
const { v4: uuidv4 } = require("uuid"); // Generate unique IDs if needed

// Fetch categories from WooCommerce and store them in DynamoDB
const getCategories = async (wooBaseUrl, consumerKey, consumerSecret) => {
  try {
    // Step 1: Set Import Status to "pending"
    await dynamoDB.updateImportStatus("pending");

    // Step 2: Fetch categories from WooCommerce
    const categories = await wooCommerceService.fetchCategoriesFromWooCommerce(
      wooBaseUrl, consumerKey, consumerSecret
    );

    // Step 3: Set Import Status to "in-progress"
    await dynamoDB.updateImportStatus("in-progress");

    // Step 4: Store categories in DynamoDB
    for (const category of categories) {
      if (!category.id) {
        category.id = uuidv4();
      }

      await dynamoDB.storeCategory(category); // Store category in DynamoDB
    }

    // Step 5: Set Import Status to "completed"
    await dynamoDB.updateImportStatus("completed");

    return categories;
  } catch (error) {
    console.error("Error retrieving categories:", error);

    // In case of failure, update the status to "failed"
    await dynamoDB.updateImportStatus("failed");
    throw new Error("Failed to retrieve categories.");
  }
};

// Retrieve all categories stored in DynamoDB
const getStoredCategories = async () => {
  try {
    return await dynamoDB.getAllCategories(); // Fetch stored categories
  } catch (error) {
    console.error("Error retrieving stored categories from DynamoDB:", error);
    throw new Error("Failed to retrieve stored categories.");
  }
};

// Delete a category from DynamoDB
const deleteCategoryFromStore = async (categoryId) => {
  try {
    await dynamoDB.deleteCategory(categoryId);
    return { message: "Category deleted successfully from DynamoDB" };
  } catch (error) {
    console.error("Error deleting category:", error);
    throw new Error("Failed to delete category.");
  }
};

module.exports = { getCategories, getStoredCategories, deleteCategoryFromStore };
