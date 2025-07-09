const log = (message, type = 'info') => {
  const timestamp = new Date().toISOString();
  const label = type.toUpperCase();
  console.log(`[${timestamp}] [${label}] ${message}`);
};

module.exports = { log };
