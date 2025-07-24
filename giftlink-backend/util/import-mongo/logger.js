// A simple logger utility

module.exports = {
  info: (msg) => {
    console.log(`INFO: ${msg}`);
  },
  error: (msg) => {
    console.error(`ERROR: ${msg}`);
  }
};
