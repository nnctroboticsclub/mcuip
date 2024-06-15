<script lang="ts">
  import { WindowManagerContext } from "$lib/window/windows";
  import Windows from "$lib/window/windows.svelte";
  import { Area } from "$lib/ui/area";
  import { patch_console_log } from "$lib/console_patch";
  import { global_state } from "../global_state";
  import { WindowConfig, setWindow } from "$lib/window/window";
  import { writable } from "svelte/store";
  import RoboFramework from "$lib/apps/robo-framework/robo-fw.svelte";

  let width: number, height: number;
  let window_bk_color = global_state.theme.window.background_color;

  patch_console_log();

  /* const window_manager = WindowManagerContext.getContext();
  window_manager.addWindow(new Area(620, 0, 920, 300), "console_log", {});
  window_manager.addWindow(new Area(0, 0, 600, 110), "launcher", {});
  window_manager.addWindow(new Area(0, 0, 1000, 330), "robo-framework", {}); */

  /* setWindow(
    new WindowConfig(
      writable(new Area(0, 0, 0, 0)),
      "robo-framework",
      {},
      writable(0)
    )
  ); */
</script>

<div class="container" bind:clientWidth={width} bind:clientHeight={height}>
  <!-- <Windows {width} {height} /> -->
  <div style="background-color: {$window_bk_color}; height: 100%; width: 100%">
    <RoboFramework></RoboFramework>
  </div>
</div>

<style>
  .container {
    width: 100%;
    height: 100%;
  }
</style>
