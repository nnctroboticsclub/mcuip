export type JSONObject = { [key: string]: any };

export interface JSONRouterBase<T extends JSONObject> {
  tag: string;
  route(data: T): undefined;
  back_routing(data: JSONObject): undefined;
}