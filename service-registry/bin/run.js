const http = require('http');
const config = require('../config')[process.env.NODE_ENV || 'development'];

const log = config.log();

const service = require('../server/service')(config);

const server = http.createServer(service);

const PORT = process.env.PORT || 3000;

server.listen(PORT);

server.on('listening', () => {
  log.info(
    `Server listening on port: ${server.address().port} in ${service.get(
      'env'
    )}`
  );
});
