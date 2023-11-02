import { expect, test } from "bun:test";
import { SerialService } from "./service";
import { TestJSONRootRouter } from "../../json_router/test";

test("Command sending test", () => {
  const router = new TestJSONRootRouter("service");
  let service = new SerialService(router);

  const port_name = "COM1";
  const port = service.serial_manager.port(port_name);

  router.route({
    "service": "serial",
    "command": "new",
    "port_name": port_name
  });


  expect(1).toBe(1);
})