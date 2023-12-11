import { expect, test } from "bun:test";
import { SerialPort } from "./node";

type Data = {
  c: string,
  d: {
    a: number
  }
}

test("Port rx callback", async () => {
  const port = new SerialPort("port");

  let data: Data = { c: "-1", d: { a: -1 } };
  port.on("rx", x => data = x as Data);

  port.rx({
    c: "0",
    d: {
      a: 2
    }
  });
  expect(data.d.a).toBe(2);
});

test("Port tx callback", async () => {
  const port = new SerialPort("port");

  let data = { c: "-1", d: { a: -1 } };
  port.on("tx", x => data = x as Data);

  port.tx({ c: "0", d: { a: 3 } });
  expect(data.d.a).toBe(3);
});