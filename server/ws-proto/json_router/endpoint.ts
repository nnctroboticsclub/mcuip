import { JSONRouter } from "./router";
import { JSONObject, JSONRouterBase } from "./types";

export class JSONEndpoint implements JSONRouterBase {
  constructor(public tag: string, public callback: (data: { [key: string]: any }) => void, private backref: JSONRouter | undefined = undefined) { }

  route(data: { [key: string]: any }): JSONRouterBase | undefined {
    this.callback(data);
    return undefined;
  }

  back_routing(data: JSONObject): null {
    if (!this.backref) {
      throw new Error('No backref');
    }

    data["$__tag"] = this.tag;
    this.backref.back_routing(data);

    return null;
  }
}