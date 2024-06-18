import { SvelteComponent, getContext, setContext, type ComponentType } from "svelte";
import { derived, writable, type Writable } from "svelte/store";

export default class BreadCrumbContext {
  public items: Writable<{
    title: string,
    component: ComponentType,
    props: object
  }[]> = writable([]);

  public indicator: Writable<number> = writable(0); // from last

  public add(title: string, component: ComponentType, props: object = {}) {
    this.items.update((items) => {
      items.push({ title, component, props });
      return items;
    });
  }

  public remove() {
    this.items.update((items) => {
      items.pop();
      return items;
    });
  }

  public indicate_to(index: number) {
    if (index > 0) {
      index = 0;
    }
    this.indicator.set(index);
  }

  public getPath() {
    return derived([this.items, this.indicator], ([$items, $indicator]) => {
      return $items
        .map((item) => item.title)
        .map((x, i) => {
          return {
            title: x,
            indicated: i === $items.length - 1 + $indicator
          };
        });
    });
  }


  public getItem() {
    return derived([this.items, this.indicator], ([$items, $indicator]) => {
      return $items[$items.length - 1 + $indicator];
    });

  }

  static newContext() {
    const ctx = new BreadCrumbContext();
    setContext<BreadCrumbContext>("breadcrumb", ctx);

    return ctx;
  }

  static getContext() {
    return getContext<BreadCrumbContext>("breadcrumb");
  }
}