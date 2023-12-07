export type JSONObject = { [key: string]: any };

export interface JSONRouterBase {
  tag: string;
  route(data: JSONObject): JSONRouterBase | undefined;
  back_routing(data: JSONObject): null;
}