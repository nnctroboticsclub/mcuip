import { expect, test } from "bun:test";
import { SerialService } from "./service";
import { TestJSONRootRouter } from "../../json_router/test";

const port1_name = "COM1";
const port2_name = "COM2";

function getRouter() {
  const router = new TestJSONRootRouter("service");
  let service = new SerialService(router);

  return router;
}

test("New command test", () => {
  const router = new TestJSONRootRouter("service");
  let service = new SerialService(router);

  router.route({
    "service": "serial",
    "command": "new",
    "port_name": port1_name
  });

  const port = service.serial_manager.get_port(port1_name);
  expect(port).toBeDefined();
});

test("Connect command test", () => {
  const router = getRouter();

  router.route({
    "service": "serial",
    "command": "new",
    "port_name": port1_name
  });

  router.route({
    "service": "serial",
    "command": "new",
    "port_name": port2_name
  });

  router.route({
    "service": "serial",
    "command": "connect",
    "port_name_A": port1_name,
    "port_name_B": port2_name
  });
});

test("tx(+connect) command test", () => {
  const router = getRouter();

  router.route({
    "service": "serial",
    "command": "new",
    "port_name": port1_name
  });

  router.route({
    "service": "serial",
    "command": "new",
    "port_name": port2_name
  });

  router.route({
    "service": "serial",
    "command": "connect",
    "port_name_A": port1_name,
    "port_name_B": port2_name
  });

  router.route({
    "service": "serial",
    "command": "tx",
    "port_name": port1_name,
    "tx_data": "Hello from port1"
  });

  expect(router.data).toEqual({
    "service": "serial",
    "command": "rx",
    "port_name": port2_name,
    "rx_data": "Hello from port1"
  });

  router.route({
    "service": "serial",
    "command": "tx",
    "port_name": port2_name,
    "tx_data": "Hello from port2"
  });

  expect(router.data).toEqual({
    "service": "serial",
    "command": "rx",
    "port_name": port1_name,
    "rx_data": "Hello from port2"
  });
})