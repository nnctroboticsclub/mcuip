import { JSONRouter } from "../json_router";
import { JSONObject } from "../json_router/types";

export class McuIpService<T extends JSONObject> extends JSONRouter<T> {
  constructor(service_name: string, backref: JSONRouter<any>) {
    super(service_name, "command", backref);
  }
}