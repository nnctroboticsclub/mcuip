import { JSONEndpoint } from "./endpoint";
import { InternalError, KeyNotFoundError, KeyTypeError, RouteNotFoundError } from "./errors";
import { JSONObject, JSONRouterBase } from "./types";

export class JSONRouter implements JSONRouterBase {
  routes: JSONRouterBase[];

  constructor(public tag: string, public key: string, private backref: JSONRouter | undefined = undefined) {
    this.routes = [];

    backref?.add_route(this);
  }

  add_route(route: JSONRouterBase) {
    this.routes.push(route)
  }

  router(tag: string, key: string): JSONRouter {
    const router = new JSONRouter(tag, key, this);
    this.add_route(router);
    return router;
  }

  endpoint(tag: string, callback: (data: { [key: string]: any }) => void): JSONEndpoint {
    const endpoint = new JSONEndpoint(tag, callback, this);
    this.add_route(endpoint);
    return endpoint;
  }

  route(data: { [key: string]: any }): JSONRouterBase | undefined {
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

  back_routing(data: JSONObject): null {
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

    return null;
  }
}