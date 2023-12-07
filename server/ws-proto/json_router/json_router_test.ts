import { expect, test } from "bun:test";
import { JSONRootRouterBase } from ".";

test("Shallow Routing", () => {
  const root = new JSONRootRouterBase("key1");

  let called = false;
  root.endpoint("tag1", _ => called = true);

  root.route({
    key1: "tag1",
    data: "test"
  });

  expect(called).toBeTruthy();
});

test("Bad Shallow Routing", () => {
  const root = new JSONRootRouterBase("key-1");

  root.endpoint("tag-1-no", _ => _);

  try {
    root.route({
      key1: "tag1",
      data: "test"
    });

    expect(false).toBeTruthy();
  } catch (error) {
    expect(true).toBeTruthy();
  }
});

test("Deep Routing", () => {
  const root = new JSONRootRouterBase("key1");
  const router_test1 = root.router("tag1", "key2");

  let called = false;
  router_test1.endpoint("tag3", _ => called = true);

  root.route({
    key1: "tag1",
    key2: "tag3",
    data: "test"
  });

  expect(called).toBeTruthy();
});

test("Bad Deep Routing", () => {
  const root = new JSONRootRouterBase("key1");
  const router_test1 = root.router("tag1", "key2");

  let called = false;
  router_test1.endpoint("tag3", _ => called = true);

  try {
    root.route({
      key1: "tag1",
      key2: "tag3-2",
      data: "test"
    });

    expect(false).toBeTruthy();
  } catch (error) {
    expect(true).toBeTruthy();
  }
});