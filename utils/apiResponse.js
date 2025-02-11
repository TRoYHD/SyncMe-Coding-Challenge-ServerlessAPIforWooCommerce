const success = (data) => ({
    statusCode: 200,
    body: JSON.stringify(data),
  });
  
  const error = (message, err) => ({
    statusCode: 500,
    body: JSON.stringify({ error: message, details: err.message }),
  });
  
  module.exports = { success, error };
  