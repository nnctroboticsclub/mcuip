import { JSONRouter } from "../../json_router";
import { McuIpService } from "../service_base";

class SerialService extends McuIpService {
  constructor(backref: JSONRouter) {
    super("serial", backref);

    this.endpoint("tx", this.get.bind(this));
  }

  get(data: any) {
    console.log(data);
  }
}