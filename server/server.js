const { createServer } = require('./src/server');
const { app, httpServer, socketServer } = createServer();
const port = process.env.PORT || 4000;
httpServer.listen(port, () => {
  console.log(`Planora backend running on http://localhost:${port}`);
});
