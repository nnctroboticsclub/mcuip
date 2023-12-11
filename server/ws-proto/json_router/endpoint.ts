import { JSONRouter } from "./router";
import { JSONObject, JSONRouterBase } from "./types";

export class JSONEndpoint<T extends JSONObject> implements JSONRouterBase<T> {
  constructor(
    public tag: string,
    public callback: (data: T) => void,
    private backref: JSONRouter<any> | undefined = undefined
  ) { }

  route(data: T): undefined {
    this.callback(data);
  }

  back_routing(data: object): undefined {
    if (!this.backref) {
      throw new Error('No backref');
    }

    // @ts-ignore
    data["$__tag"] = this.tag;
    this.backref.back_routing(data);
  }

  send_data(data: T) {
    this.back_routing(data as object);
  }
}