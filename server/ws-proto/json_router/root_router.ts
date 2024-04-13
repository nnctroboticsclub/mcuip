import { InternalError } from "./errors";
import { JSONRouter } from "./router";
import { type JSONObject } from "./types";

export class JSONRootRouterBase extends JSONRouter<object> {
  constructor(key: string) {
    super("root", key);
  }

  back_routing(data: JSONObject): undefined {
    if (!data.hasOwnProperty("$__tag")) {
      throw new InternalError("Data does not have $__tag");
    }
    data[this.key] = data["$__tag"];
    delete data["$__tag"];

    this.handle_back_routing(data);
  }

  handle_back_routing(data: JSONObject) {
    console.log("Root router has no back routing");
    console.log("Data: ", data);

    return null;
  }
}