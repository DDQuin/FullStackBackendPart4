/* eslint-disable linebreak-style */
/* eslint-disable consistent-return */
/* eslint-disable no-console */
const http = require('http');
const app = require('./app'); // varsinainen Express-sovellus
const config = require('./utils/config');
const logger = require('./utils/logger');

const server = http.createServer(app);

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
