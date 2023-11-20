<script lang="ts">
  import { windows } from "$lib/window/windows";
  import { onDestroy } from "svelte";
  import { derived, get } from "svelte/store";
  import { theme } from "../../theme";
  import { getWindow } from "$lib/window/window";

  const app_background_color = theme.app_background_color;

  let window = getWindow();
  let container: HTMLDivElement;

  let defer_functions: (() => void)[] = [];

  const snapness = 50;

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

  function snap_position(value: number, snapness: number) {
    return Math.round(value / snapness) * snapness;
  }

  function whileCapture(x: number, y: number) {
    const old_window_config = window;
    if (drag.capturing) {
      const current_top = snap_position(
        y - drag.base.touch.y + drag.base.position.y,
        snapness
      );
      const current_left = snap_position(
        x - drag.base.touch.x + drag.base.position.x,
        snapness
      );

      if (current_top != get(old_window_config.top)) {
        window.top.set(current_top);
      }

      if (current_left != get(old_window_config.left)) {
        window.left.set(current_left);
      }
    }

    const current_width = snap_position(
      parseInt(container.style.width.replace("px", "")),
      snapness
    );
    const current_height = snap_position(
      parseInt(container.style.height.replace("px", "")),
      snapness
    );

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
  class:dragging={drag.capturing}
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
  @keyframes drag {
    0% {
      box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
    }
    100% {
      box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.75);
    }
  }

  div.container {
    position: absolute;
    display: block;
    border-radius: 10px;
    box-sizing: border-box;

    padding: 5px;
    overflow: hidden;

    transition: box-shadow 0.2s;
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
  }

  div.container.dragging {
    cursor: grabbing;
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.75);
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
    width: calc(100% - 20px);
    height: calc(100% - 21px);
    padding: 10px;
  }
</style>
