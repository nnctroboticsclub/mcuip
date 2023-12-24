<script lang="ts">
  import { get, readable, writable, type Writable } from "svelte/store";
  import { DragTargetContext, DragContainerContext } from "./context";
  import { Position } from "../ui/position";

  export let area_tag: string = "primary";
  export let tag: string = "target";
  export let pos: Writable<Position> = writable(new Position(0, 0));
  export let sticky: Position | null = null; // used for Knob
  export let dragging: boolean = false;

  const target_ctx = DragTargetContext.setContext(tag, pos);

  const area_ctx = DragContainerContext.getContext(area_tag);
  const area_unavailable = area_ctx.getIsUnavailable();

  const style = sticky ? readable(sticky.getStyle()) : target_ctx.getStyle();

  let element_width = -1;
  let element_height = -1;

  export let touch_identifier = 0;

  let drag = {
    touch_base: new Position(0, 0),
    position_base: new Position(0, 0),
  };

  export function setTouchIdentifier(id: number) {
    touch_identifier = id;
  }

  export function setCtxPos(new_pos: Position) {
    target_ctx.updatePos(new_pos);
  }

  function whileCapture(x: number, y: number) {
    if (!dragging) return;
    const dragger_area = get(area_ctx.getArea());

    const new_pos = new Position(x, y)
      .subtract(drag.touch_base)
      .add(drag.position_base);

    const area = new_pos.toArea(element_width, element_height);
    const new_area = dragger_area.smaller(10, 10).fitInArea(area);

    target_ctx.updatePos(new_area?.getPosition() ?? new_pos);
  }

  export function startCapturing(x: number, y: number) {
    if (dragging) return;
    dragging = true;

    drag.touch_base = new Position(x, y);
    drag.position_base = get(target_ctx.getPos());

    area_ctx.setDragging(true);
  }

  function endCapturing() {
    if (!dragging) return;
    dragging = false;
    area_ctx.setDragging(false);
  }
</script>

<svelte:window
  on:mousemove={(e) => whileCapture(e.clientX, e.pageY)}
  on:touchmove={(e) => {
    let touch = [...e.touches].filter((x) => x.identifier === touch_identifier);

    if (touch.length == 0) endCapturing();
    else whileCapture(touch[0].clientX, touch[0].clientY);
  }}
  on:mouseup={endCapturing}
  on:touchend={(e) => {
    const fire = ![...e.touches].some((x) => x.identifier === touch_identifier);

    if (fire) endCapturing();
  }}
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
    on:touchstart={(e) => {
      const touch = e.targetTouches[0];
      touch_identifier = touch.identifier;

      startCapturing(touch.clientX, touch.clientY);
    }}
    on:mousedown={(e) => startCapturing(e.clientX, e.clientY)}
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
