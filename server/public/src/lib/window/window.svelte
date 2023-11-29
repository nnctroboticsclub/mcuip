<script lang="ts">
  import { derived } from "svelte/store";
  import { getWindow } from "$lib/window/window";
  import DragTarget from "$lib/dragger/drag_target.svelte";
  import { Position } from "$lib/ui/position";
  import { global_state } from "../../global_state";
  import { XmarkSolid } from "svelte-awesome-icons";

  const hover_enabled = global_state.config.window.hover_enabled;
  const title_bar_centered = global_state.config.window.centered_title_bar;

  const window = getWindow();
  const title_bar_tag = `window[${window.tag}]-title-bar`;
  const resizer_tag = `window[${window.tag}]-resizer`;

  const status = window.status;
  window.status.set("Loaded");

  const container_style = derived(
    [window.area, global_state.theme.window.background_color],
    ([area, bk]) =>
      `${area.getStyle()} background-color: ${bk}; z-index: ${window.z_index}`
  );

  const title_bar_style = derived(
    [window.area],
    ([area]) => `width: ${area.getWidth()}px`
  );

  let dragging: boolean = false;
</script>

<div
  class="container"
  class:dragging
  style={$container_style}
  on:click={() => {
    window.z_index = 10000000;
  }}
  role="dialog"
>
  <DragTarget
    tag={title_bar_tag}
    pos={window.area.getPositionStore()}
    sticky={new Position(0, 0)}
    bind:dragging
  >
    <div
      class="title-bar"
      style={$title_bar_style}
      class:centered={$title_bar_centered}
    >
      <slot name="title" />
      <div class="right">
        <XmarkSolid
          on:click={() => {
            window.status.set("Closing");
          }}
        />
      </div>
    </div>
  </DragTarget>
  <div class="content">
    <slot name="app" />
  </div>
  {#if $hover_enabled}
    <div class="hover">
      status: {$status} <br />
      tag: {window.tag}<br />
      z-index: {window.z_index}
    </div>
  {/if}
  <DragTarget
    tag={resizer_tag}
    pos={window.area.getSizeStore()}
    sticky={new Position(-1, -1)}
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

  div.title-bar.centered {
    text-align: center;
  }

  div.title-bar::after {
    display: block;
    width: 100%;
    height: 1px;

    content: "";
    background-color: black;
    opacity: 0.25;
  }

  div.title-bar > div.right {
    position: absolute;
    top: 0px;
    right: 5px;
    bottom: 0px;

    display: flex;
    align-items: center;
    justify-content: center;

    width: 20px;
    height: 100%;

    cursor: pointer;
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
