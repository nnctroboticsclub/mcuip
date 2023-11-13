import type { WindowConfig } from "./window";

const app_cache: { [key: string]: any } = {};

const app_import_map = {
  test: () => import("$lib/apps/test.svelte"),
  window_inspector: () => import("$lib/apps/window_inspector.svelte"),
  console_log: () => import("$lib/apps/console_log.svelte")
} as { [key: string]: () => Promise<any> };

export async function getAppComponent(window: WindowConfig, app_name: string) {
  if (!window) return null;

  if (app_cache[app_name]) {
    return app_cache[app_name];
  }

  if (!app_import_map[app_name]) {
    throw new Error(`Unknown app: ${app_name}`);
  }

  let module = await app_import_map[app_name]();
  app_cache[app_name] = module.default;

  return module.default;
}