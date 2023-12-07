import { JSONRouter } from "../json_router";

export class McuIpService extends JSONRouter {
  constructor(service_name: string, backref: JSONRouter) {
    super(service_name, "command", backref);
  }
}