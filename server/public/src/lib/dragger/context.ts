import type { Invalidator, Subscriber, Unsubscriber, Updater, Writable } from "svelte/store";

export type WidgetLocationDescriptor = {
  top: number;
  left: number;
  width: number;
  height: number;
};

class AreaLimitedStore implements Writable<WidgetLocationDescriptor>{
  constructor(private store: Writable<WidgetLocationDescriptor>, private limits: AreaLimits) {
  }

  set(value: WidgetLocationDescriptor): void {
    this.store.set(this.limits.fit_in(value));
  }

  subscribe(run: Subscriber<WidgetLocationDescriptor>, invalidate?: Invalidator<WidgetLocationDescriptor> | undefined): Unsubscriber {
    return this.store.subscribe(run, invalidate);
  }

  update(updater: Updater<WidgetLocationDescriptor>): void {
    this.store.update(updater);
  }
}

export class AreaLimits {
  constructor(public top: number, public left: number, public right: number, public bottom: number) {
  }

  fit_in(descriptor: WidgetLocationDescriptor) {
    // Snap position
    if (descriptor.top < this.top) {
      descriptor.top = this.top;
    }
    if (descriptor.left < this.left) {
      descriptor.left = this.left;
    }

    // Resize to fit the limits
    if (descriptor.top + descriptor.height > this.bottom) {
      descriptor.height = this.bottom - descriptor.top;
    }
    if (descriptor.left + descriptor.width > this.right) {
      descriptor.width = this.right - descriptor.left;
    }

    return descriptor;
  }

  as_store(descriptor: Writable<WidgetLocationDescriptor>) {
    return new AreaLimitedStore(descriptor, this);
  }
};