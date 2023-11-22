<script lang="ts">
  import { derived, get, writable } from "svelte/store";
  import { DragTargetContext, DragContainerContext } from "./context";
  import { Position } from "./position";
  import { Area } from "./area";
  import { terminal } from "virtual:terminal";

  export let tag: string = "target";
  export let pos: Position = new Position(0, 0);

  const ctx = DragTargetContext.setContext(tag, pos);

  const area_ctx = DragContainerContext.getContext();
  const area_unavailable = area_ctx.getIsUnavailable();

  const style = ctx.getStyle();

  let element_width = -1;
  let element_height = -1;

  let drag = {
    capturing: false,
    touch_base: new Position(0, 0),
    position_base: new Position(0, 0),
  };

  function whileCapture(x: number, y: number) {
    if (!drag.capturing) return;
    const dragger_area = get(area_ctx.getArea());

    const new_pos = new Position(x, y)
      .subtract(drag.touch_base)
      .add(drag.position_base);

    const area = new_pos.toArea(element_width, element_height);
    const new_area = dragger_area.fitInArea(area);

    ctx.updatePos(new_area?.getPosition() ?? new_pos);
  }

  function startCapturing(x: number, y: number) {
    if (drag.capturing) return;
    drag.capturing = true;

    drag.touch_base = new Position(x, y);
    drag.position_base = get(ctx.getPos());
  }

  function endCapturing() {
    if (!drag.capturing) return;
    drag.capturing = false;
  }

  area_ctx.subscribeArea((new_area) => {
    const position_in_area = new_area.fitToArea(pos);
    ctx.updatePos(position_in_area);
  });
</script>

<svelte:window
  on:touchstart={(e) =>
    startCapturing(e.touches[0].clientX, e.touches[0].clientY)}
  on:mousedown={(e) => startCapturing(e.clientX, e.clientY)}
  on:mousemove={(e) => whileCapture(e.clientX, e.pageY)}
  on:touchmove={(e) => whileCapture(e.touches[0].clientX, e.touches[0].clientY)}
  on:mouseup={endCapturing}
  on:touchend={endCapturing}
/>

{#if $area_unavailable}
  <div
    bind:clientWidth={element_width}
    bind:clientHeight={element_height}
    class="wrapper"
    style={$style}
  >
    <slot />
  </div>
{:else}
  Area context not available
{/if}

<style>
  .wrapper {
    position: absolute;
  }
</style>
