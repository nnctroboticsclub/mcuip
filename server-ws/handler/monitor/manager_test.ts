import { expect, test } from "bun:test";
import { MonitorManager } from "./manager";

const packet = {
  "c": "0",
  "d": {
    a: "0"
  }
};

test("Port Creation", async () => {
  const manager = new MonitorManager();

  const port1 = manager.createMonitor("port1");
  const port2 = manager.createMonitor("port2");

  expect(port1.name).toBe(manager.getMonitor("port1")?.name);
  expect(port2.name).toBe(manager.getMonitor("port2")?.name);
});

test("Port forwarding A to B", async () => {
  const manager = new MonitorManager();

  const port1 = manager.createMonitor("port1");
  const port2 = manager.createMonitor("port2");

  manager.connect(port1, port2);

  let port2_cb_data = {};

  port2.on("rx", (data) => {
    port2_cb_data = data;
  });

  port1.tx(packet);
  expect(port2_cb_data).toEqual(packet);
});

test("Port forwarding B to A", async () => {
  const manager = new MonitorManager();

  const port1 = manager.createMonitor("port1");
  const port2 = manager.createMonitor("port2");

  manager.connect(port2, port1);

  let port2_cb_data = {};

  port2.on("rx", (data) => {
    port2_cb_data = data;
  });

  port1.tx(packet);
  expect(port2_cb_data).toEqual(packet);
});