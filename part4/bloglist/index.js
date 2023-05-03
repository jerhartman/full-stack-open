// index file for app

const app = require('./app');
const config = require('./utils/config');
const logger = require('./utils/logger');

const PORT = config.PORT || 3003;
app.listen(PORT, () => {
  logger.info(`listening on port ${PORT}`);
});