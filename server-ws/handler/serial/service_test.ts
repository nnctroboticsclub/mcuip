import { expect, test } from "bun:test";
import { SerialService } from "./service";
import { TestJSONRootRouter } from "../../json_router/test";
import { SerialPortManager } from "./manager";
import { GlobalState } from "../global_state";

const port1_name = "COM1";
const port2_name = "COM2";


const commands = {
  "new_device1": {
    "service": "serial",
    "command": "new",
    "port_name": port1_name
  },
  "new_device2": {
    "service": "serial",
    "command": "new",
    "port_name": port2_name
  },
  "connect1to2": {
    "service": "serial",
    "command": "connect",
    "port_name_A": port1_name,
    "port_name_B": port2_name
  },
  "connect2to1": {
    "service": "serial",
    "command": "connect",
    "port_name_A": port2_name,
    "port_name_B": port1_name
  },

  "tx_p1p2": {
    "service": "serial",
    "command": "tx",
    "port_name": port1_name,
    "tx_data": "Hello from port1"
  },
  "rx_p1p2": {
    "service": "serial",
    "command": "rx",
    "port_name": port2_name,
    "rx_data": "Hello from port1"
  },

  "tx_p2p1": {
    "service": "serial",
    "command": "tx",
    "port_name": port2_name,
    "tx_data": "Hello from port2"
  },
  "rx_p2p1": {
    "service": "serial",
    "command": "rx",
    "port_name": port1_name,
    "rx_data": "Hello from port2"
  },

};

function getRouter() {
  const router = new TestJSONRootRouter("service");
  const serial_manager = GlobalState.getInstance().serial_manager;
  new SerialService(router, serial_manager);

  return router;
}


test("New command test", () => {
  GlobalState.getInstance().reset();
  const router = new TestJSONRootRouter("service");
  const serial_manager = new SerialPortManager();
  new SerialService(router, serial_manager);

  router.route(commands.new_device1);

  const port = serial_manager.get_port(port1_name);
  expect(port).toBeDefined();
});

test("Connect command test", () => {
  GlobalState.getInstance().reset();
  const router = getRouter();

  router.route(commands.new_device1);
  router.route(commands.new_device2);
  router.route(commands.connect1to2);
});


test("tx(+connect) command test", () => {
  GlobalState.getInstance().reset();
  const router = getRouter();
  router.route(commands.new_device1);
  router.route(commands.new_device2);
  router.route(commands.connect1to2);

  router.route(commands.tx_p1p2);
  expect(router.data).toEqual(commands.rx_p1p2);

  router.route(commands.tx_p2p1);
  expect(router.data).toEqual(commands.rx_p2p1);
});


test("TX Separated test", () => {
  GlobalState.getInstance().reset();
  const router1 = getRouter();
  router1.route(commands.new_device1);

  const router2 = getRouter();
  router2.route(commands.new_device2);
  router2.route(commands.connect2to1);

  const router3 = getRouter();

  router1.route(commands.tx_p1p2);
  expect(router1.data).toEqual({});
  expect(router2.data).toEqual(commands.rx_p1p2);
  expect(router3.data).toEqual({});

  router2.data = {};

  router2.route(commands.tx_p2p1);
  expect(router1.data).toEqual(commands.rx_p2p1);
  expect(router2.data).toEqual({});
  expect(router3.data).toEqual({});
});
