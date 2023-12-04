import { makeCached } from "$lib/stores/cached_store";
import { writable, type Invalidator, type Subscriber, type Unsubscriber, type Updater, type Writable, derived } from "svelte/store";


export class ZIndexStore implements Writable<number> {
  constructor(public parent: ZIndexStoreParent, private tag: string) {

  }

  set(value: number): void {
    this.parent.set(this.tag, value);
  }

  subscribe(run: Subscriber<number>, invalidate?: Invalidator<number> | undefined): Unsubscriber {
    return this.parent.subscribe(this.tag, run, invalidate);
  }

  update(updater: Updater<number>): void {
    this.parent.update(this.tag, updater);
  }
}

type ZIndexList = { tag: string, z_index: number, store: ZIndexStore }[];

export class ZIndexStoreParent {
  list: Writable<ZIndexList> = writable([]);

  new_store() {
    const tag = Math.random().toString(36).substring(2, 7);
    const store = new ZIndexStore(this, tag);
    this.list.update(list => [...list, { tag, z_index: Infinity, store }]);

    return makeCached(store) as Writable<number>;
  }

  set(tag: string, value: number): void {
    this.list.update(
      list => list.map(
        item => item.tag === tag ? { ...item, z_index: value } : item
      )
    );
  }

  subscribe(tag: string, run: Subscriber<number>, invalidate?: Invalidator<number> | undefined): Unsubscriber {
    return derived(this.list, ($list) =>
      $list.find(item => item.tag === tag)?.z_index ?? Infinity
    ).subscribe(run, invalidate);
  }

  update(tag: string, updater: Updater<number>): void {
    this.list.update(
      list => list.map(
        item => item.tag === tag ? { ...item, z_index: updater(item.z_index) } : item
      )
    );
  }
}