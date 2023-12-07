import { JSONRouter } from "./router";
import { JSONObject, JSONRouterBase } from "./types";

export class JSONEndpoint<T> implements JSONRouterBase {
  constructor(public tag: string, public callback: (data: T) => void, private backref: JSONRouter | undefined = undefined) { }

  route(data: { [key: string]: any }): JSONRouterBase | undefined {
    this.callback(data as T);
    return undefined;
  }

  back_routing(data: object): null {
    if (!this.backref) {
      throw new Error('No backref');
    }

    // @ts-ignore
    data["$__tag"] = this.tag;
    this.backref.back_routing(data);

    return null;
  }

  send_data(data: T) {
    this.back_routing(data as object);
  }
}