<script lang="ts">
  import { setContext } from "svelte";
  import { DragContainerContext } from "./context";
  import { global_state } from "../../global_state";
  import { Area } from "../ui/area";

  export let top: number;
  export let left: number;
  export let width: number;
  export let height: number;

  DragContainerContext.initContext();

  const ctx = DragContainerContext.getContext();
  const is_dragging = ctx.getDragging();

  $: {
    if (!top || !left || !width || !height) {
      DragContainerContext.clearContext();
    } else {
      ctx.setArea(new Area(top, left, width, height));
    }
  }
</script>

<div
  class="drag-container"
  class:debug={global_state.config.debug.dragger}
  class:dragging={$is_dragging}
  style="top: {top}px; left: {left}px; width: {width}px; height: {height}px;"
>
  <slot />
</div>

<style>
  .drag-container {
    position: relative;
  }

  .drag-container.debug {
    border: 1px solid purple;
    box-sizing: border-box;
  }

  .drag-container.dragging {
    user-select: none;
  }
</style>
