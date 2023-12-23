<script lang="ts">
  import DragTarget from "$lib/dragger/drag_target.svelte";
  import DraggableArea from "$lib/dragger/draggable_area.svelte";
  import { DerivedWritable } from "$lib/stores/derived_writable";
  import { writable } from "svelte/store";
  import { Position } from "./position";
  import { Area } from "./area";

  export let radius: number = 100;

  export let x_val: number = 0;
  export let y_val: number = 0;

  export let tag: string = "j0";

  let area = new Area(0, 0, radius, radius);

  const pos_store = new DerivedWritable<number, Position>(
    writable(0),
    (b) => new Position(x_val, y_val),
    (b, pos: Position) => {
      if (pos.magnitude > radius / 2) {
        pos = pos.normalize().multiply(radius / 2);
      }
      const { x, y } = pos.components();
      x_val = x;
      y_val = y;

      return 0;
    }
  );

  let dragging: boolean = false;

  $: {
    if (!dragging) {
      pos_store.set(new Position(0, 0));
    }
  }
</script>

<DraggableArea top={0} left={0} height={radius} width={radius}>
  <div class="drag-area">
    <DragTarget pos={pos_store} bind:dragging {tag}>
      <div
        style={"position: absolute; " +
          `top: ${radius / 2 + y_val}px; ` +
          `left: ${radius / 2 + x_val}px; ` +
          "width: 50px; " +
          "height: 50px; " +
          "border-radius: 100%; " +
          "transform: translate(-50%, -50%); " +
          "background-color: #88f;"}
      ></div>
    </DragTarget>
  </div>
</DraggableArea>

<style>
  .drag-area {
    position: relative;
    width: 100%;
    height: 100%;
    border-color: #0004;
    border-style: solid;
    border-width: 1px;
    border-radius: 100%;
  }
</style>
