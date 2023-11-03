import { expect, test } from "bun:test";
import { MonitorManager } from "./manager";

test("Port Creation", async () => {
  const manager = new MonitorManager();

  const port1 = manager.createMonitor("port1");
  const port2 = manager.createMonitor("port2");
});
test("Get#SerialPortManager", async () => {
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

  let port2_cb_data = { "data": 0 } as { [key: string]: any };

  port2.on("rx", (data) => {
    port2_cb_data = data;
  });

  port1.tx({ "data": 3 });
  expect(port2_cb_data.data).toBe(3);
});

test("Port forwarding B to A", async () => {
  const manager = new MonitorManager();

  const port1 = manager.createMonitor("port1");
  const port2 = manager.createMonitor("port2");

  manager.connect(port2, port1);

  let port2_cb_data = { "data": 0 } as { [key: string]: any };

  port2.on("rx", (data) => {
    port2_cb_data = data;
  });

  port1.tx({ "data": 3 });
  expect(port2_cb_data.data).toBe(3);
});