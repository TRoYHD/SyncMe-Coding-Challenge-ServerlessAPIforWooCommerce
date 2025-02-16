const AWS = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const DYNAMODB_TABLE = process.env.DYNAMODB_TABLE;
const IMPORT_STATUS_TABLE = process.env.IMPORT_STATUS_TABLE;

const storeCategory = async (category) => {
  try {
    await dynamoDB
      .put({
        TableName: DYNAMODB_TABLE,
        Item: { id: category.id, name: category.name },
      })
      .promise();
  } catch (error) {
    console.error(`Error storing category ${category.id}:`, error);
  }
};

const createImport = async () => {
  const importId = uuidv4();
  try {
    await dynamoDB
      .put({
        TableName: IMPORT_STATUS_TABLE,
        Item: {
          id: importId,
          status: "pending",
          createdAt: new Date().toISOString(),
        },
      })
      .promise();
    return importId;
  } catch (error) {
    console.error("Error creating import record:", error);
    throw new Error("Failed to create import.");
  }
};

const updateImport = async (importId, status) => {
  try {
    await dynamoDB
      .update({
        TableName: IMPORT_STATUS_TABLE,
        Key: { id: importId },
        UpdateExpression: "set #status = :status, #lastUpdated = :lastUpdated",
        ExpressionAttributeNames: {
          "#status": "status",
          "#lastUpdated": "lastUpdated",
        },
        ExpressionAttributeValues: {
          ":status": status,
          ":lastUpdated": new Date().toISOString(),
        },
      })
      .promise();
  } catch (error) {
    console.error(`Error updating import status (${importId}):`, error);
  }
};

const getImportStatus = async () => {
  try {
    const result = await dynamoDB
      .scan({
        TableName: IMPORT_STATUS_TABLE,
        ScanIndexForward: false,
      })
      .promise();

    if (result.Items && result.Items.length > 0) {
      return result.Items[0];
    }

    return { changestatus: "No imports yet", soruse: "N/A", timestamp: "N/A" };
  } catch (error) {
    console.error("Error fetching import status from DynamoDB:", error);
    throw new Error("Failed to fetch import status.");
  }
};
const getStoredCategories = async () => {
  try {
    const result = await dynamoDB.scan({ TableName: DYNAMODB_TABLE }).promise();
    return result.Items || [];
  } catch (error) {
    console.error("Error retrieving categories from DynamoDB:", error);
    throw new Error("Failed to retrieve stored categories.");
  }
};
const deleteCategory = async (categoryId) => {
  try {
    console.log(`Deleting category with ID: ${categoryId}`);

    const params = {
      TableName: DYNAMODB_TABLE,
      Key: { id: String(categoryId) },
    };

    await dynamoDB.delete(params).promise();

    return { message: "Category deleted successfully from DynamoDB" };
  } catch (error) {
    console.error("Error deleting category from DynamoDB:", error);
    throw new Error("Failed to delete category.");
  }
};

module.exports = {
  storeCategory,
  getImportStatus,
  getStoredCategories,
  deleteCategory,
  createImport,
  updateImport,
};
