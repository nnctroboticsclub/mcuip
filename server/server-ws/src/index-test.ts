import { JSONRootRouterBase } from "../../ws-proto/json_router";

const root = new JSONRootRouterBase("key1");
const router_test1 = root.router("tag1", "key2");
const router_test2 = root.router("tag2", "key2");

const ep_test1 = router_test1.endpoint("tag3", (data) => {
  console.log("ep_test1: ", data["data"]);
});

const ep_test2 = router_test2.endpoint("tag4", (data) => {
  console.log("ep_test2: ", data["data"]);
});

root.route({
  key1: "tag1",
  key2: "tag3",
  data: "test"
});
try {
  root.route({
    key1: "tag2",
    key2: "tag4",
    data: "test"
  });
} catch (error) {

}

ep_test1.back_routing({
  data: "test"
});
ep_test2.back_routing({
  data: "test2"
});