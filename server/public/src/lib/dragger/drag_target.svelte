<script lang="ts">
  import { derived, get, writable, type Writable } from "svelte/store";
  import { DragTargetContext, DragContainerContext } from "./context";
  import { Position } from "../ui/position";

  export let tag: string = "target";
  export let pos: Writable<Position> = writable(new Position(0, 0));
  export let sticky: boolean = false; // used for Knob

  const target_ctx = DragTargetContext.setContext(tag, pos);

  const area_ctx = DragContainerContext.getContext();
  const area_unavailable = area_ctx.getIsUnavailable();

  const style = sticky
    ? writable(get(target_ctx.getStyle()))
    : target_ctx.getStyle();

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
    const new_area = dragger_area.smaller(10, 10).fitInArea(area);

    console.log(`${tag} - ${new_pos.toString()}`);

    target_ctx.updatePos(new_area?.getPosition() ?? new_pos);
  }

  function startCapturing(x: number, y: number) {
    if (drag.capturing) return;
    drag.capturing = true;

    drag.touch_base = new Position(x, y);
    drag.position_base = get(target_ctx.getPos());

    area_ctx.setDragging(true);
  }

  function endCapturing() {
    if (!drag.capturing) return;
    drag.capturing = false;
    area_ctx.setDragging(false);
  }
</script>

<svelte:window
  on:mousemove={(e) => whileCapture(e.clientX, e.pageY)}
  on:touchmove={(e) => whileCapture(e.touches[0].clientX, e.touches[0].clientY)}
/>

{#if $area_unavailable}
  <div
    bind:clientWidth={element_width}
    bind:clientHeight={element_height}
    class="wrapper"
    style={$style}
    role="scrollbar"
    aria-controls="draggable"
    aria-valuenow={-1}
    tabindex={0}
    on:touchstart={(e) =>
      startCapturing(e.touches[0].clientX, e.touches[0].clientY)}
    on:mousedown={(e) => startCapturing(e.clientX, e.clientY)}
    on:mouseup={endCapturing}
    on:touchend={endCapturing}
  >
    <slot />
  </div>
{:else}
  Area context not available
{/if}

<style>
  .wrapper {
    position: absolute;
    z-index: 1000;
  }
</style>
