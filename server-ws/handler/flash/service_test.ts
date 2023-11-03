import { expect, test } from "bun:test";
import { GlobalState } from "../global_state";
import { TestJSONRootRouter } from "../../json_router/test";
import { FlashService } from "./service";

function getRouter() {
  const router = new TestJSONRootRouter("service");
  const device_manager = GlobalState.getInstance().device_manager;
  new FlashService(router, device_manager);

  return router;
}

const device_name = "device1";

const commands = {
  "create": {
    "service": "flash",
    "command": "new",
    "device_name": device_name
  },
  "subscribe": {
    "service": "flash",
    "command": "subscribe",
    "device_name": device_name
  },
  "flash": {
    "service": "flash",
    "command": "flash",
    "device_name": device_name,
    "flash": {
      "tag": "Flash",
      "data_base64": "===="
    }
  },
  "flash_res": {
    "service": "flash",
    "command": "flash",
    "device_name": device_name,
    "flash": {
      "tag": "Flash",
      "data_base64": "===="
    }
  }
}

test("Node creation test", () => {
  GlobalState.getInstance().reset();
  const router = getRouter();
  router.route(commands.create);

  const device = GlobalState.getInstance().device_manager.getDevice(device_name);
  expect(device).toBeDefined();
});

test("Node flashing test", () => {
  GlobalState.getInstance().reset();
  const router = getRouter();
  router.route(commands.create);
  router.route(commands.flash);
});

test("Node subscription test (single router)", () => {
  GlobalState.getInstance().reset();
  const router = getRouter();
  router.route(commands.create);
  router.route(commands.subscribe);
  router.route(commands.flash);

  expect(router.data).toEqual(commands.flash_res)
});

test("Node subscription test (different router)", () => {
  GlobalState.getInstance().reset();
  const router1 = getRouter();
  const router2 = getRouter();
  router1.route(commands.create);
  router2.route(commands.subscribe);
  router1.route(commands.flash);

  expect(router2.data).toEqual(commands.flash_res)
});

test("Node subscription test (avoid excess message)", () => {
  GlobalState.getInstance().reset();
  const router1 = getRouter();
  const router2 = getRouter();
  const router3 = getRouter();
  router1.route(commands.create);
  router2.route(commands.subscribe);
  router1.route(commands.flash);

  expect(router3.data).toEqual({});
});

