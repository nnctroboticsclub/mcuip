import { JSONEndpoint } from "./endpoint";
import { InternalError, KeyNotFoundError, KeyTypeError, RouteNotFoundError } from "./errors";
import { JSONObject, JSONRouterBase } from "./types";

export class JSONRouter<T extends JSONObject> implements JSONRouterBase<T> {
  routes: JSONRouterBase<object>[];

  constructor(
    public tag: string,
    public key: string,
    private backref: JSONRouter<any> | undefined = undefined
  ) {
    this.routes = [];

    backref?.add_route(this);
  }

  add_route(route: JSONRouterBase<any>) {
    this.routes.push(route)
  }

  router<U extends JSONObject>(tag: string, key: string): JSONRouter<U> {
    const router = new JSONRouter<U>(tag, key, this);
    this.add_route(router);
    return router;
  }

  endpoint<U extends JSONObject>(tag: string, callback: (data: U) => void): JSONEndpoint<U> {
    const endpoint = new JSONEndpoint<U>(tag, callback, this);
    this.add_route(endpoint);
    return endpoint;
  }

  route(data: T): undefined {
    if (!data.hasOwnProperty(this.key)) {
      throw new KeyNotFoundError(this.key);
    }

    const val = data[this.key];
    if (typeof val !== 'string') {
      throw new KeyTypeError(this.key);
    }

    for (let route of this.routes) {
      if (route.tag === val) {
        return route.route(data);
      }
    }

    throw new RouteNotFoundError(`Route ${val} not found in ${this.tag}`);
  }

  back_routing(data: JSONObject): undefined {
    if (!this.backref) {
      throw new Error('No backref');
    }

    if (!data.hasOwnProperty("$__tag")) {
      throw new InternalError("Data does not have $__tag");
    }

    const child_tag = data["$__tag"];

    data[this.key] = child_tag;
    data["$__tag"] = this.tag;

    this.backref.back_routing(data);
  }
}