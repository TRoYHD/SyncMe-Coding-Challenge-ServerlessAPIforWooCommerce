const axios = require("axios");

// Fetch categories from WooCommerce store
const fetchCategoriesFromWooCommerce = async (wooBaseUrl, consumerKey, consumerSecret) => {
  try {
    const response = await axios.get(`${wooBaseUrl}/wp-json/wc/v3/products/categories`, {
      auth: { username: consumerKey, password: consumerSecret },
    });

    return response.data; // Return the categories data fetched from WooCommerce
  } catch (error) {
    console.error(
      "Error fetching categories from WooCommerce:",
      error.response?.data || error.message
    );
    throw new Error("Failed to fetch categories from WooCommerce.");
  }
};

module.exports = { fetchCategoriesFromWooCommerce };
