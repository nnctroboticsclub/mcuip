<script lang="ts">
  import { derived } from "svelte/store";
  import { theme } from "../../theme";
  import { getWindow } from "$lib/window/window";
  import DragTarget from "$lib/dragger/drag_target.svelte";
  import { Position } from "$lib/dragger/position";

  const app_background_color = theme.app_background_color;

  const tag = Math.random().toString(36).slice(2, 10);

  let window = getWindow();
  let style = derived(
    [window.top, window.left, window.width, window.height],
    ([top, left, width, height]) =>
      `top: ${top}px; left: ${left}px; width: ${width}px; height: ${height}px;`
  );
</script>

<div
  class="container"
  style="{$style}; background-color: {$app_background_color};"
>
  <DragTarget tag="window[{tag}]-title-bar" pos={new Position(0, 0)}>
    <div class="title-bar">
      <slot name="title" />
      (Tag: {tag})
    </div>
  </DragTarget>
  <div class="content">
    <slot name="app" />
  </div>
  <DragTarget tag="window[{tag}]-resizer" pos={new Position(-1, -1)}>
    <div class="resizer"></div>
  </DragTarget>
</div>

<style>
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
    position: absolute;
    top: 20px;
    display: block;
    width: calc(100% - 20px);
    height: calc(100% - 21px);
    padding: 10px;
  }

  div.resizer {
    width: 20px;
    height: 20px;
    cursor: nwse-resize;
  }

  div.resizer::after {
    display: block;
    width: 100%;
    height: 1px;

    content: "";
    background-color: black;
    opacity: 0.25;

    transform: rotate(45deg);
  }

  div.resizer::before {
    display: block;
    width: 1px;
    height: 100%;

    content: "";
    background-color: black;
    opacity: 0.25;

    transform: rotate(45deg);
  }
</style>
