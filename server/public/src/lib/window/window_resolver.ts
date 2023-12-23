const app_cache: { [key: string]: any } = {};

export const app_import_map = {
  test: () => import("$lib/apps/test.svelte"),
  window_inspector: () => import("$lib/apps/window_inspector.svelte"),
  console_log: () => import("$lib/apps/console_log.svelte"),
  debugger: () => import("$lib/apps/debugger.svelte"),
  launcher: () => import("$lib/apps/launcher.svelte"),
  global_data_list: () => import("$lib/apps/global_data_list.svelte"),
  "mcuip-ctrl": () => import("$lib/apps/mcuip-controller.svelte"),
  "2023-korobo-nc": () => import("$lib/apps/2023-korobo-nc.svelte"),
} as { [key: string]: () => Promise<any> };

export async function getAppComponent(app_name: string) {
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