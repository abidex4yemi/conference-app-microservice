const http = require('http');
const axios = require('axios');
const config = require('../config')[process.env.NODE_ENV || 'development'];

const log = config.log();
const service = require('../server/services')(config);

const server = http.createServer(service);

const PORT = 0;

server.listen(PORT);

server.on('listening', () => {
  const serviceRegistry = () => {
    axios.put(
      `http://localhost:3000/register/${config.name}/${config.version}/${
        server.address().port
      }`
    );
  };

  const unregisterService = () => {
    axios.delete(
      `http://localhost:3000/register/${config.name}/${config.version}/${
        server.address().port
      }`
    );
  };

  serviceRegistry();

  const interval = setInterval(serviceRegistry, 20000);

  const cleanup = async () => {
    clearInterval(interval);
    await unregisterService();
  };

  process.on('uncaughtException', async () => {
    await cleanup();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    await cleanup();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await cleanup();
    process.exit(0);
  });

  log.info(
    `Server listening on port ${server.address().port} in ${service.get(
      'env'
    )} mode`
  );
});
