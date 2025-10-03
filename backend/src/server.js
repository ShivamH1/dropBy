const http = require('http');
const app = require('./index');
const { initializeSocket } = require("./socket");

const server = http.createServer(app);
const PORT = process.env.PORT || 8080;
initializeSocket(server);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
