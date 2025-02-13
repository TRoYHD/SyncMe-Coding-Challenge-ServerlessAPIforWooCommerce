const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const DYNAMODB_TABLE = process.env.DYNAMODB_TABLE;

// Store category in DynamoDB with a unique ID if missing
const storeCategory = async (category) => {
  try {
    if (!category.id) {
      category.id = uuidv4(); // Generate a unique ID if not provided
    }

    await dynamoDB.put({ TableName: DYNAMODB_TABLE, Item: category }).promise();
    return category; // Return stored category
  } catch (error) {
    console.error("Error storing category in DynamoDB:", error);
    throw new Error("Failed to store category.");
  }
};

// Update import status in DynamoDB
const updateImportStatus = async (status) => {
  try {
    const statusId = "importStatus"; // Can be a fixed ID or generated dynamically for multiple statuses

    await dynamoDB.put({
      TableName: IMPORT_STATUS_TABLE,  // Use the correct table for import status
      Item: { id: statusId, status },
    }).promise();
  } catch (error) {
    console.error("Error updating import status in DynamoDB:", error);
    throw new Error("Failed to update import status.");
  }
};

// Retrieve import status from DynamoDB
const getImportStatus = async () => {
  try {
    const result = await dynamoDB.get({
      TableName: IMPORT_STATUS_TABLE,  // Use the correct table for import status
      Key: { id: "importStatus" }, // Ensure this ID is consistent with how you update
    }).promise();

    return result.Item ? result.Item.status : "Not Started";
  } catch (error) {
    console.error("Error fetching import status from DynamoDB:", error);
    throw new Error("Failed to fetch import status.");
  }
};
module.exports = {
  storeCategory,
  updateImportStatus,
  getImportStatus,
};
