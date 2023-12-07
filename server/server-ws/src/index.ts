import { Serve } from "bun";
import { WSData, WebSocketJSONRootRouter } from "./ws_server/ws_router";

Bun.serve<Serve<WSData>>({
  port: 80,
  websocket: {
    open: (ws) => {
      ws.data = {
        router: new WebSocketJSONRootRouter(ws)
      }
      console.log(`New client connected: ${ws.remoteAddress}`);
    },
    close: (ws) => {
      console.log(`Client disconnected: ${ws.remoteAddress}`);
    },
    message: (ws, message) => {
      // is message is Uint8Array, ignore
      if (typeof message !== "string") {
        return
      }
      console.error(`Received message from ${ws.remoteAddress}: ${message}`);
      try {
        ws.data.router.route(JSON.parse(message));
      } catch (e) {
        ws.send(JSON.stringify({
          "service": "error",
          "error": {
            "tag": "Error",
            "message": e?.toString()
          }
        }));
      }
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