import { InternalError } from "./errors";
import { JSONRouter } from "./router";

export class JSONRootRouterBase extends JSONRouter {
  constructor(key: string) {
    super("root", key, undefined);
  }

  back_routing(data: JSONObject): null {
    if (!data.hasOwnProperty("$__tag")) {
      throw new InternalError("Data does not have $__tag");
    }
    data[this.key] = data["$__tag"];
    delete data["$__tag"];

    return this.handle_back_routing(data);
  }

  handle_back_routing(data: JSONObject): null {
    console.log("Root router has no back routing");
    console.log("Data: ", data);

    return null;
  }
}