const importService = require("../services/importService");

exports.handler = async (event) => {
  try {
    const status = await importService.getImportStatus();
    return { statusCode: 200, body: JSON.stringify({ status }) };
  } catch (error) {
    console.error("Error checking import status:", error);
    return { statusCode: 500, body: JSON.stringify({ error: "Server Error" }) };
  }
};
