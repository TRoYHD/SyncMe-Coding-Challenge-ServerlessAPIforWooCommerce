const axios = require("axios");

// Fetch categories from WooCommerce store
const fetchCategoriesFromWooCommerce = async (wooBaseUrl, consumerKey, consumerSecret) => {
  try {
    // Fetch categories from WooCommerce
    const response = await axios.get(`${wooBaseUrl}/wp-json/wc/v3/products/categories`, {
      auth: { username: consumerKey, password: consumerSecret },
    });

    // Map the response to return only relevant fields for storing in DynamoDB
    return response.data.map(category => ({
      id: category.id.toString(), 
      name: category.name,
      slug: category.slug,
      parent: category.parent,
      description: category.description,
      display: category.display,
      image: category.image ? category.image.src : null, // Only store image URL
      menu_order: category.menu_order,
    }));
  } catch (error) {
    console.error("Error fetching categories from WooCommerce:", error.response?.data || error.message);
    throw new Error("Failed to fetch categories from WooCommerce.");
  }
};

module.exports = { fetchCategoriesFromWooCommerce };
