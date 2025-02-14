const dynamoDB = require("../repositories/dynamoService");
const wooCommerceService = require("../repositories/wooService");
const { v4: uuidv4 } = require("uuid"); // Generate unique IDs if needed

// Fetch categories from WooCommerce and store them in DynamoDB
const getCategories = async (wooBaseUrl, consumerKey, consumerSecret) => {
  try {
    // Step 1: Set Import Status to "pending"
    await dynamoDB.updateImportStatus("pending", wooBaseUrl);

    // Step 2: Fetch categories from WooCommerce
    const categories = await wooCommerceService.fetchCategoriesFromWooCommerce(
      wooBaseUrl, consumerKey, consumerSecret
    );

    // Step 3: Set Import Status to "in-progress"
    await dynamoDB.updateImportStatus("in-progress", wooBaseUrl);

    // Step 4: Store categories in DynamoDB
    for (const category of categories) {
      if (!category.id) {
        category.id = uuidv4(); // Ensure every category has a unique ID if needed
      }

      await dynamoDB.storeCategory(category); // Store category in DynamoDB
    }

    // Step 5: Set Import Status to "completed"
    await dynamoDB.updateImportStatus("completed", wooBaseUrl);

    return categories; // Return categories after storing
  } catch (error) {
    console.error("Error retrieving categories:", error);

    // In case of failure, update the status to "failed"
    await dynamoDB.updateImportStatus("failed", wooBaseUrl);
    throw new Error("Failed to retrieve categories.");
  }
};

// Retrieve all categories stored in DynamoDB
const getStoredCategories = async () => {
  return await dynamoDB.getStoredCategories();
};

const deleteCategoryFromStore = async (categoryId) => {
  console.log(`Deleting category from store: ${categoryId}`);
  return await dynamoDB.deleteCategory(categoryId); 
};
// Retrieve the last import status (status, source, timestamp)
const getImportStatus = async () => {
  try {
    return await dynamoDB.getImportStatus();
  } catch (error) {
    console.error("Error fetching import status:", error);
    throw new Error("Failed to fetch import status.");
  }
}

module.exports = { 
  getCategories, 
  getStoredCategories, 
  deleteCategoryFromStore,
  getImportStatus 
};
