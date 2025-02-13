const categoryService = require("../services/categoryService");

exports.handler = async (event) => {
  try {
    const status = await categoryService.getImportStatus();
    return { statusCode: 200, body: JSON.stringify({ status }) };
  } catch (error) {
    console.error("Error checking import status:", error);
    return { statusCode: 500, body: JSON.stringify({ error: "Server Error" }) };
  }
};
