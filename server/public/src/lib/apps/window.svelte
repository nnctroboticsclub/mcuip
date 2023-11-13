<script lang="ts">
  import { getWindowIndex, type WindowConfig } from "$lib/window/window";
  import { windows } from "$lib/window/windows";
  import { onDestroy } from "svelte";
  import { derived, get } from "svelte/store";

  let container: HTMLDivElement;
  const index: number = getWindowIndex();

  let window = windows[index];

  let defer_functions: (() => void)[] = [];

  let style = derived(
    [window.top, window.left, window.width, window.height],
    ([top, left, width, height]) =>
      `top: ${top}px; left: ${left}px; width: ${width}px; height: ${height}px;`
  );

  function applyChanges() {
    const old_window_config = window;
    let current_top = parseInt(container.style.top.replace("px", ""));
    let current_left = parseInt(container.style.left.replace("px", ""));
    let current_width = parseInt(container.style.width.replace("px", ""));
    let current_height = parseInt(container.style.height.replace("px", ""));

    if (current_top != get(old_window_config.top)) {
      window.top.set(current_top);
    }

    if (current_left != get(old_window_config.left)) {
      window.left.set(current_left);
    }

    if (current_width != get(old_window_config.width)) {
      window.width.set(current_width);
    }

    if (current_height != get(old_window_config.height)) {
      window.height.set(current_height);
    }
  }

  onDestroy(() => {
    defer_functions.forEach((func) => func());
  });
</script>

<svelte:window on:mouseup={applyChanges} on:touchend={applyChanges} />

<div class="container" bind:this={container} style={$style}>
  <div class="title-bar">
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
    border: 1px solid black;
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
