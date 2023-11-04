Bun.serve({
  port: 80,
  websocket: {
    open: (ws) => {
      console.log(`New client connected: ${ws.remoteAddress}`);
    },
    close: (ws) => {
      console.log(`Client disconnected: ${ws.remoteAddress}`);
    },
    message: (ws, message) => {
      console.log(`Message from ${ws.remoteAddress}: ${message}`);
    }
  },
  fetch: (req, server) => {
    console.log(`Request: ${req.method} ${req.url}`);

    if (server.upgrade(req)) {
      return;
    }

    return new Response("The supports only WebSocket.", {
      status: 400,
      statusText: "Bad Request"
    });
  }
})