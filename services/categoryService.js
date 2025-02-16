const dynamoDB = require("../repositories/dynamoService");
const wooCommerceService = require("../repositories/wooService");

// Fetch and store categories in DynamoDB
const getCategories = async (wooBaseUrl, consumerKey, consumerSecret) => {
  try {
    // Step 1: Set Import Status to "pending"
    const importId = await dynamoDB.createImport();

    // Start the import process in the background
    // Use Promise.race to ensure the Lambda doesn't exit too early
    await Promise.race([
      new Promise(resolve => setTimeout(resolve, 100)), // Small delay to ensure the process starts
      processImport(importId, wooBaseUrl, consumerKey, consumerSecret)
    ]);

    console.log('Import initiated, returning response', { importId });
    return { message: "Import process started", importId };

  } catch (error) {
    console.error("Error initiating import:", JSON.stringify(error));
    throw new Error("Failed to initiate import process.");
  }
};

// Modify processImport to run independently
const processImport = async (importId, wooBaseUrl, consumerKey, consumerSecret) => {
  // Wrap the entire process in a new Promise to ensure it runs independently
  return new Promise(async (resolve, reject) => {
    try {
      console.log('Process Import Started', { 
        importId,
        wooBaseUrl,
        time: new Date().toISOString()
      });

      // Step 2: Update status to "in-progress"
      await dynamoDB.updateImport(importId, "in-progress");
      console.log('Status updated to in-progress', { importId });

      // Step 3: Fetch categories - Add more detailed logging
      console.log('About to fetch categories from WooCommerce', { 
        importId,
        wooBaseUrl,
        hasConsumerKey: !!consumerKey,
        hasConsumerSecret: !!consumerSecret
      });

      const categories = await wooCommerceService.fetchCategoriesFromWooCommerce(
        wooBaseUrl, 
        consumerKey, 
        consumerSecret
      );

      // Step 4: Store categories
      console.log('Storing categories in DynamoDB', { 
        importId,
        categoryCount: categories.length 
      });
      const storePromises = categories.map(category => 
        dynamoDB.storeCategory(category)
      );
      
      await Promise.all(storePromises);
      console.log('Categories stored successfully', { importId });

      // Step 5: Update status to "completed"
      console.log('Updating status to completed', { importId });
      await dynamoDB.updateImport(importId, "completed");
      console.log('Import process completed successfully', { importId });

      resolve(); // Successfully complete the process
    } catch (error) {
      console.error('Error in processImport:', {
        importId,
        errorMessage: error.message,
        errorStack: error.stack,
        phase: 'processing'
      });

      try {
        await dynamoDB.updateImport(importId, "failed");
      } catch (updateError) {
        console.error('Failed to update status:', {
          importId,
          error: updateError.message
        });
      }

      reject(error);
    }
  }).catch(error => {
    console.error('Caught in promise wrapper:', {
      importId,
      error: error.message
    });
    throw error; // Re-throw to be caught by the main catch block
  });
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
  getImportStatus,
  processImport
};