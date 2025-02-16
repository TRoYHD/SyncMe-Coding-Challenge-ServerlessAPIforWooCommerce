const dynamoDB = require("../repositories/dynamoService");
const wooCommerceService = require("../repositories/wooService");

const processImport = async (
  importId,
  wooBaseUrl,
  consumerKey,
  consumerSecret
) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("Process Import Started", {
        importId,
        wooBaseUrl,
        time: new Date().toISOString(),
      });

      // Step 2: Update status to "in-progress"
      await dynamoDB.updateImport(importId, "in-progress");
      console.log("Status updated to in-progress", { importId });

      // Step 3: Fetch categories
      console.log("About to fetch categories from WooCommerce", {
        importId,
        wooBaseUrl,
        hasConsumerKey: !!consumerKey,
        hasConsumerSecret: !!consumerSecret,
      });

      const categories =
        await wooCommerceService.fetchCategoriesFromWooCommerce(
          wooBaseUrl,
          consumerKey,
          consumerSecret
        );

      // Step 4: Store categories
      console.log("Storing categories in DynamoDB", {
        importId,
        categoryCount: categories.length,
      });
      const storePromises = categories.map((category) =>
        dynamoDB.storeCategory(category)
      );

      await Promise.all(storePromises);
      console.log("Categories stored successfully", { importId });

      // Step 5: Update status to "completed"
      console.log("Updating status to completed", { importId });
      await dynamoDB.updateImport(importId, "completed");
      console.log("Import process completed successfully", { importId });

      resolve();
    } catch (error) {
      console.error("Error in processImport:", {
        importId,
        errorMessage: error.message,
        errorStack: error.stack,
        phase: "processing",
      });

      try {
        await dynamoDB.updateImport(importId, "failed");
      } catch (updateError) {
        console.error("Failed to update status:", {
          importId,
          error: updateError.message,
        });
      }

      reject(error);
    }
  }).catch((error) => {
    console.error("Caught in promise wrapper:", {
      importId,
      error: error.message,
    });
    throw error;
  });
};

const getImportStatus = async () => {
  try {
    return await dynamoDB.getImportStatus();
  } catch (error) {
    console.error("Error fetching import status:", error);
    throw new Error("Failed to fetch import status.");
  }
};

module.exports = {
  getImportStatus,
  processImport,
};
