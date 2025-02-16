const axios = require("axios");

// Fetch categories from WooCommerce store
const fetchCategoriesFromWooCommerce = async (wooBaseUrl, consumerKey, consumerSecret) => {
  try {
    // Fetch categories from WooCommerce
    console.log('entering fetching catergoies', { wooBaseUrl });

    const response = await axios.get(`${wooBaseUrl}/wp-json/wc/v3/products/categories`, {
      auth: { username: consumerKey, password: consumerSecret },
    });
    console.log('we are entering the fetchiing', { response });

   // Map categories and return relevant data
   return response.data.map(category => ({
    id: category.id.toString(), // Store the category ID as string
    name: category.name,
    slug: category.slug,
    description: category.description,
    parent: category.parent,
    image: category.image ? category.image.src : null, // Store image URL if exists
    menu_order: category.menu_order,
  }));
} catch (error) {
  console.error("Error fetching categories from WooCommerce:", error);
  throw new Error("Failed to fetch categories from WooCommerce.");
}
};

module.exports = { fetchCategoriesFromWooCommerce };