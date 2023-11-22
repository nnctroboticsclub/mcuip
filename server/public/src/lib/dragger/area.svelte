<script lang="ts">
  import { setContext } from "svelte";
  import { DragContainerContext } from "./context";

  export let top: number;
  export let left: number;
  export let width: number;
  export let height: number;

  DragContainerContext.setContext(top, left, width, height);
</script>

<div
  class="drag-container"
  style="top: {top}px; left: {left}px; width: {width}px; height: {height}px;"
>
  <slot />
</div>
