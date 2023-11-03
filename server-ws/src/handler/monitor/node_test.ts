import { expect, test } from "bun:test";
import { SerialPort } from "./node";

type Data = { data: number };

test("Port rx callback", async () => {
  const port = new SerialPort("port");

  let data = { data: -1 } as Data;
  port.on("rx", x => data = x as Data);

  port.rx({ "data": 2 });
  expect(data.data).toBe(2);
});

test("Port tx callback", async () => {
  const port = new SerialPort("port");

  let data = { data: -1 } as Data;
  port.on("tx", x => data = x as Data);

  port.tx({ "data": 3 });
  expect(data.data).toBe(3);
});