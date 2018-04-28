import { orderBy } from "lodash";

export function TwigSortAlpha(data: any[], args: string[]): any {
  const props = args[0];
  const orders = args[1];

  return orderBy(data, props, orders);
}
