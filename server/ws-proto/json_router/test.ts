import { JSONRootRouterBase } from ".";
import { JSONObject } from "./types";

export class TestJSONRootRouter extends JSONRootRouterBase {
  data: { [key: string]: any } = {};

  handle_back_routing(data: JSONObject): null {
    this.data = data;
    return null;
  }
}