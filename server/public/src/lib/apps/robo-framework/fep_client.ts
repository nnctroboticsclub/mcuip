import { getContext, setContext } from "svelte";
import { get, writable, type Writable } from "svelte/store";

export default class FEPClient {
  public server_uri: Writable<string> = writable(`ws://${globalThis?.location?.hostname ?? "localhost"}:8100`);
  public sock: Writable<WebSocket | null> = writable(null);

  constructor() { }

  async connect() {
    const socket = new WebSocket(get(this.server_uri));
    socket.onmessage = (event) => {
      console.log(event.data);
    }
    socket.onclose = () => {
      console.log("Disconnected from FEP server");
    }
    socket.onerror = (event) => {
      console.error("Error connecting to FEP server", event);
    }

    await new Promise((resolve) => {
      socket.onopen = resolve;
    });
    console.log("Connected to FEP server");


    this.sock.set(socket);
  }

  static getInstance() {
    return getContext<FEPClient>("fep_client");
  }

  static createInstance() {
    const fep_client = new FEPClient();
    setContext("fep_client", fep_client);
    return fep_client;
  }
}