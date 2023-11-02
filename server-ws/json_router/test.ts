import { JSONRootRouterBase } from ".";

export class TestJSONRootRouter extends JSONRootRouterBase {
  data: { [key: string]: any } = {};

  constructor(key: string) {
    super(key);
  }

  handle_back_routing(data: JSONObject): null {
    this.data = data;
    return null;
  }
}