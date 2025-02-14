const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const DYNAMODB_TABLE = process.env.DYNAMODB_TABLE;
const IMPORT_STATUS_TABLE = process.env.IMPORT_STATUS_TABLE; // Import status table

// Store category in DynamoDB with a unique ID if missing
const storeCategory = async (category) => {
  try {
    if (!category.id) {
      category.id = uuidv4(); // Generate a unique ID if not provided
    }

    await dynamoDB.put({ TableName: DYNAMODB_TABLE, Item: category }).promise();
    return category; // Return stored category
  } catch (error) {
    console.error(`Error storing category ${JSON.stringify(category)} in DynamoDB:`, error);
    throw new Error("Failed to store category.");
  }
};

// Update import status in DynamoDB with source and timestamp
const updateImportStatus = async (status, soruse) => {
  try {
    const statusId = uuidv4(); // Generate a unique ID for each status record

    const item = {
      id: statusId,
      status,
      soruse,
      timestamp: new Date().toISOString(), // Timestamp for the import
    };
    console.log('IMPORT_STATUS_TABLE:', IMPORT_STATUS_TABLE); // Add this line for debugging

    if (!IMPORT_STATUS_TABLE) {
      throw new Error('Missing IMPORT_STATUS_TABLE environment variable');
    }
    await dynamoDB.put({
      TableName: IMPORT_STATUS_TABLE,
      Item: item,
    }).promise();
  } catch (error) {
    console.error("Error updating import status in DynamoDB:", error);
    throw new Error("Failed to update import status.");
  }
};

// Retrieve the latest import status from DynamoDB
const getImportStatus = async () => {
  try {
    const result = await dynamoDB.scan({
      TableName: IMPORT_STATUS_TABLE,
      ScanIndexForward: false,  // Fetch the latest first
    }).promise();

    if (result.Items && result.Items.length > 0) {
      // Assuming 'changestatus', 'soruse', and 'timestamp' are now valid column names
      return result.Items[0];  // Return the most recent import status
    }

    return { changestatus: "No imports yet", soruse: "N/A", timestamp: "N/A" };  // Ensure to match your new column names
  } catch (error) {
    console.error("Error fetching import status from DynamoDB:", error);
    throw new Error("Failed to fetch import status.");
  }
};
// Retrieve all categories stored in DynamoDB
const getStoredCategories = async () => {
  try {
    const result = await dynamoDB.scan({ TableName: DYNAMODB_TABLE }).promise();
    return result.Items || []; // Return items or empty array
  } catch (error) {
    console.error("Error retrieving categories from DynamoDB:", error);
    throw new Error("Failed to retrieve stored categories.");
  }
};
// Delete a category from DynamoDB
const deleteCategory = async (categoryId) => {
  try {
    console.log(`Deleting category with ID: ${categoryId}`);

    const params = {
      TableName: DYNAMODB_TABLE,
      Key: { id: String(categoryId) }, // Ensure ID is a string
    };

    await dynamoDB.delete(params).promise();
    
    console.log(`Category ${categoryId} deleted successfully.`);
    return { message: "Category deleted successfully from DynamoDB" };
  } catch (error) {
    console.error("Error deleting category from DynamoDB:", error);
    throw new Error("Failed to delete category.");
  }
};

module.exports = {
  storeCategory,
  updateImportStatus,
  getImportStatus,
  getStoredCategories,
  deleteCategory
};
