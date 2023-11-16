<script lang="ts">
  import { getWindowIndex } from "$lib/window/window";
  import { windows } from "$lib/window/windows";
  import { onDestroy } from "svelte";
  import { derived, get } from "svelte/store";
  import { theme } from "../../theme";

  const app_background_color = theme.app_background_color;

  let container: HTMLDivElement;
  const index: number = getWindowIndex();

  let window = windows[index];

  let defer_functions: (() => void)[] = [];

  let style = derived(
    [window.top, window.left, window.width, window.height],
    ([top, left, width, height]) =>
      `top: ${top}px; left: ${left}px; width: ${width}px; height: ${height}px;`
  );

  let drag = {
    capturing: false,
    base: {
      touch: {
        x: 0,
        y: 0,
      },
      position: {
        x: 0,
        y: 0,
      },
    },
  };

  function whileCapture(x: number, y: number) {
    const old_window_config = window;
    if (drag.capturing) {
      let current_top = y - drag.base.touch.y + drag.base.position.y;
      let current_left = x - drag.base.touch.x + drag.base.position.x;

      if (current_top != get(old_window_config.top)) {
        window.top.set(current_top);
      }

      if (current_left != get(old_window_config.left)) {
        window.left.set(current_left);
      }
    }

    let current_width = parseInt(container.style.width.replace("px", ""));
    let current_height = parseInt(container.style.height.replace("px", ""));

    if (current_width != get(old_window_config.width)) {
      window.width.set(current_width);
    }

    if (current_height != get(old_window_config.height)) {
      window.height.set(current_height);
    }
  }

  function startCapturing(x: number, y: number) {
    if (drag.capturing) return;

    drag.capturing = true;
    drag.base.touch.x = x;
    drag.base.touch.y = y;
    drag.base.position.x = get(window.left);
    drag.base.position.y = get(window.top);
  }

  function endCapturing() {
    if (!drag.capturing) return;

    drag.capturing = false;
  }

  onDestroy(() => {
    defer_functions.forEach((func) => func());
  });
</script>

<svelte:window
  on:mousemove={(e) => whileCapture(e.clientX, e.pageY)}
  on:touchmove={(e) => whileCapture(e.touches[0].clientX, e.touches[0].clientY)}
  on:mouseup={endCapturing}
  on:touchend={endCapturing}
/>

<div
  class="container"
  bind:this={container}
  style="{$style}; background-color: {$app_background_color};"
>
  <div
    class="title-bar"
    on:touchstart={(e) =>
      startCapturing(e.touches[0].clientX, e.touches[0].clientY)}
    on:mousedown={(e) => startCapturing(e.clientX, e.clientY)}
  >
    <slot name="title" />
  </div>
  <div class="content">
    <slot name="app" />
  </div>
</div>

<style>
  div.container {
    position: absolute;
    display: block;
    border-radius: 10px;
    box-sizing: border-box;

    padding: 5px;
    overflow: hidden;
    resize: both;
  }

  div.title-bar {
    display: block;
    width: 100%;
    height: 20px;
  }
  div.title-bar::after {
    display: block;
    width: 100%;
    height: 1px;

    content: "";
    background-color: black;
    opacity: 0.25;
  }
  div.content {
    display: block;
    width: 100%;
    height: calc(100% - 21px);
    margin: 10px;
  }
</style>
