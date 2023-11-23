<script lang="ts">
  import { derived, writable } from "svelte/store";
  import { theme } from "../../theme";
  import { getWindow } from "$lib/window/window";
  import DragTarget from "$lib/dragger/drag_target.svelte";
  import { Position } from "$lib/ui/position";
  import { DragTargetContext } from "$lib/dragger/context";
  import { onMount } from "svelte";

  const app_background_color = theme.app_background_color;

  const tag = Math.random().toString(36).slice(2, 10);
  const title_bar_tag = `window[${tag}]-title-bar`;
  const resizer_tag = `window[${tag}]-resizer`;

  const window = getWindow();
  const status = window.status;

  const resizer_ctx = DragTargetContext.getContext(resizer_tag);
  const title_bar_ctx = DragTargetContext.getContext(title_bar_tag);

  window.area;

  window.status.set("Component Loaded");

  const container_style = derived([window.area], ([area]) => area.getStyle());

  const title_bar_style = derived(
    [window.area],
    ([area]) => `width: ${area.getWidth()}px;`
  );
</script>

<div
  class="container"
  style="{$container_style}; background-color: {$app_background_color};"
>
  <DragTarget
    tag={title_bar_tag}
    pos={writable(new Position(0, 0))}
    sticky={true}
  >
    <div class="title-bar" style={$title_bar_style}>
      <slot name="title" />
    </div>
  </DragTarget>
  <div class="content">
    <slot name="app" />
  </div>
  <div class="hover">
    status: {$status} <br />
    tag: {tag}
  </div>
  <DragTarget
    tag={resizer_tag}
    pos={writable(new Position(-1, -1))}
    sticky={true}
  >
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

  div.hover {
    position: absolute;
    top: 70%;
    left: 10%;
    bottom: 10%;
    right: 10%;

    display: block;
    background-color: #fff;

    padding: 10px;

    font-size: 14px;
    text-align: end;

    border: 1px solid #eee;
    border-radius: 10px;

    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);

    opacity: 0;
    z-index: 1000;

    transition: opacity 0.2s;

    user-select: none;
  }

  div.hover:hover {
    opacity: 1;
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
