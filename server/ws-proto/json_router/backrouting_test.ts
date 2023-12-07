import { expect, test } from "bun:test";
import { TestJSONRootRouter } from "./test";

test("Shallow back Routing", () => {
  const root = new TestJSONRootRouter("key1");
  const endpoint = root.endpoint("tag1", _ => _);

  endpoint.back_routing({
    "data": 1
  });

  expect(root.data).toEqual({
    "key1": "tag1",
    "data": 1
  });
});

test("Deep Routing", () => {
  const root = new TestJSONRootRouter("key1");
  const sub_router = root.router("tag1", "key2");
  const endpoint = sub_router.endpoint("tag3", _ => _);

  endpoint.back_routing({
    "data": 1
  });

  expect(root.data).toEqual({
    "key1": "tag1",
    "key2": "tag3",
    "data": 1
  });
});