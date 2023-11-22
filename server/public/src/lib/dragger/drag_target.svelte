<script lang="ts">
  import { get } from "svelte/store";
  import { DragTargetContext } from "./context";
  import { Position } from "./position";

  export let tag: string = "target";
  export let pos: Position = new Position(0, 0);

  const ctx = DragTargetContext.setContext(tag, pos);

  const style = ctx.getStyle();

  let drag = {
    capturing: false,
    base: {
      touch: new Position(0, 0),
      position: new Position(0, 0),
    },
  };

  function whileCapture(x: number, y: number) {
    if (!drag.capturing) return;

    const new_position = new Position(x, y)
      .subtract(drag.base.touch) // relative to touch
      .add(drag.base.position);

    ctx.updatePos(new_position);
  }

  function startCapturing(x: number, y: number) {
    if (drag.capturing) return;
    drag.capturing = true;

    drag.base.touch = new Position(x, y);
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
