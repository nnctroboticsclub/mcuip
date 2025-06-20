<script lang="ts">
  import DragTarget from "$lib/dragger/drag_target.svelte";
  import DraggableArea from "$lib/dragger/draggable_area.svelte";
  import { DerivedWritable } from "$lib/stores/derived_writable";
  import { writable } from "svelte/store";
  import { Position } from "./position";

  export let style: string = "";
  export let show_value: boolean = false;
  export let width: number = 20;
  export let height: number = 20;

  export let value: number = 0; // -1 to 1

  export let tag: string = "j0";
  export let slider_name: string = "";

  let inner_width: number = 0;
  let value_raw: number = 0;

  $: value = (value_raw / inner_width) * 2;

  const pos_store = new DerivedWritable<number, Position>(
    writable(0),
    (b) => new Position(value_raw, 0),
    (b, pos: Position) => {
      const { x, y: _ } = pos.components();
      value_raw = x;

      if (value_raw < -inner_width / 2) {
        value_raw = -inner_width / 2;
      } else if (value_raw > inner_width / 2) {
        value_raw = inner_width / 2;
      }

      return 0;
    }
  );

  let dragging: boolean = false;

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

    const offset = new Position(-inner_width / 2, 0);
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

  ((value) =>
    setTimeout(() => {
      value_raw = (value / 2) * inner_width;
    }, 50))(value);
</script>

<div
  class="container"
  style="height: {height + (slider_name || show_value ? 20 : 0)}px; {style};"
  bind:clientWidth={inner_width}
>
  {#if slider_name || show_value}
    <span class="title"
      >{slider_name}
      {#if show_value}
        &nbsp;{value}
      {/if}
    </span>
  {/if}
  <DraggableArea
    top={0}
    left={0}
    {height}
    width={inner_width}
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
            `top: 0px; ` +
            `left: ${inner_width / 2 + value_raw}px; ` +
            `width: ${width}px; ` +
            `height: ${height}px; ` +
            "background-color: #88f;"}
        ></div>
      </DragTarget>
    </div>
  </DraggableArea>
</div>

<style lang="scss">
  div.container {
    .title {
      display: block;
      width: 100%;
      height: 20px;
      text-align: center;
    }

    .drag-area {
      position: relative;
      width: 100%;
      height: 100%;

      background-color: #eee8;
    }
  }
</style>
