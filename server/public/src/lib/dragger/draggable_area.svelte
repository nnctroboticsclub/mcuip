<script lang="ts">
  import { DragContainerContext } from "./context";
  import { global_state } from "../../global_state";
  import { Area } from "../ui/area";

  export let top: number;
  export let left: number;
  export let width: number;
  export let height: number;

  export let tag: string = "primary";

  DragContainerContext.initContext(tag);

  const ctx = DragContainerContext.getContext(tag);
  const is_dragging = ctx.getDragging();

  const debug_visual = global_state.config.debug.dragger.visual;
  const debug_store = ctx.getDebug();

  $: {
    if (!top || !left || !width || !height) {
      DragContainerContext.clearContext(tag);
    } else {
      ctx.setArea(new Area(top, left, width, height));
    }
  }
</script>

<div
  class="drag-container"
  class:debug={$debug_visual}
  class:dragging={$is_dragging}
  style="top: {top}px; left: {left}px; width: {width}px; height: {height}px;"
>
  <div class="debug" style="font-size: 14px;">
    {@html $debug_store.replaceAll("\n", "<br>")}
  </div>
  <slot />
</div>

<style lang="scss">
  .drag-container {
    position: relative;

    .debug {
      position: absolute;
      top: 0;
      left: 0;
    }
  }

  .drag-container.debug {
    border: 1px solid purple;
    box-sizing: border-box;
  }

  .drag-container.dragging {
    user-select: none;

    background-color: rgba(0, 0, 0, 0.1);
  }
</style>
