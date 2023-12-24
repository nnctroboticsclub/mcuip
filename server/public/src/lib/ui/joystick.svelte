<script lang="ts">
  import DragTarget from "$lib/dragger/drag_target.svelte";
  import DraggableArea from "$lib/dragger/draggable_area.svelte";
  import { DerivedWritable } from "$lib/stores/derived_writable";
  import { writable } from "svelte/store";
  import { Position } from "./position";

  export let radius: number = 100;

  export let x_val: number = 0;
  export let y_val: number = 0;

  export let tag: string = "j0";
  export let stick_name: string = "";

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

  // DOM
  let container: HTMLDivElement | null = null;
  let target: DragTarget | null = null;
  $: (async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    if (!container) return;

    const rect = container?.getBoundingClientRect();
    if (!rect) {
      console.error("No rect found");
      return;
    }

    const offset = new Position(-radius / 2, -radius / 2);
    const top = new Position(Math.floor(rect.left), Math.floor(rect.top));

    container.addEventListener("touchstart", (e) => {
      const touch = e.targetTouches[0];

      const raw_point = new Position(
        Math.floor(touch.clientX),
        Math.floor(touch.clientY)
      );

      const point = raw_point.subtract(top).add(offset);

      pos_store.set(point);
      if (target) {
        target.setTouchIdentifier(touch.identifier);
        target.setCtxPos(point);

        const { x, y } = raw_point.components();
        target.startCapturing(x, y);
      }
    });
  })();
</script>

<div class="container" style="height: {radius + 20}px; width: {radius}px">
  <DraggableArea
    top={0}
    left={0}
    height={radius}
    width={radius}
    tag={"ja-" + tag}
  >
    <div class="drag-area" bind:this={container}>
      <DragTarget
        pos={pos_store}
        bind:dragging
        tag={"jt-" + tag}
        area_tag={"ja-" + tag}
        bind:this={target}
      >
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
  <span class="title">{stick_name}</span>
</div>

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

  .title {
    display: block;
    width: 100%;
    height: 20px;
    text-align: center;
  }
</style>
