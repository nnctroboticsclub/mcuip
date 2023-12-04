export function makeCached<T, S extends {
  subscribe: (run: (value: T) => void, invalidate?: (value?: T) => void) => () => void;
}>(store: S): S {
  return store;

  let cached_value: T;
  let cached = false;
  const new_store: S = {
    ...store,
    subscribe: (run, invalidate) => {
      return store.subscribe((value) => {
        if (cached && value === cached_value) return;
        cached_value = value;
        cached = true;
        run(value);
      }, invalidate);
    }
  };

  return new_store;
}