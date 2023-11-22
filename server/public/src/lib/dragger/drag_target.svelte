<script lang="ts">
  import { get } from "svelte/store";
  import { type DragTargetPosition, DragTargetContext } from "./context";

  export let tag: string = "target";
  export let pos: DragTargetPosition = {
    x: 0,
    y: 0,
  };

  let ctx = DragTargetContext.setContext(tag, pos);

  const style = ctx.getStyle();

  let drag = {
    capturing: false,
    base: {
      touch: {
        x: 0,
        y: 0,
      } as DragTargetPosition,
      position: {
        x: 0,
        y: 0,
      } as DragTargetPosition,
    },
  };

  function whileCapture(x: number, y: number) {
    if (!drag.capturing) return;
    const dx = x - drag.base.touch.x;
    const dy = y - drag.base.touch.y;

    const new_x = drag.base.position.x + dx;
    const new_y = drag.base.position.y + dy;

    const new_position: DragTargetPosition = {
      x: new_x,
      y: new_y,
    };

    ctx.updatePos(new_position);
  }

  function startCapturing(x: number, y: number) {
    if (drag.capturing) return;
    drag.capturing = true;

    drag.base.touch.x = x;
    drag.base.touch.y = y;
    drag.base.position = get(ctx.getPos());
  }

  function endCapturing() {
    if (!drag.capturing) return;
    drag.capturing = false;
  }
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

<div class="wrapper" style={$style}>
  <slot />
</div>

<style>
  .wrapper {
    position: absolute;
  }
</style>
