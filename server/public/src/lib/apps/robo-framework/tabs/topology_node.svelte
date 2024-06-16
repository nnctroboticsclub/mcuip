<script lang="ts">
  import DragTarget from "$lib/dragger/drag_target.svelte";
  import type { Topo } from "./topology";

  export let node: Topo;
  export let tag: string;

  let data = node.data;
  let v_a = node.velocity;

  let debug = node.debug;
  let name = data.name;
</script>

<DragTarget area_tag={tag} pos={node.pos}>
  <div class="node">
    {name}
    {$debug} <br />
  </div>
</DragTarget>

<style lang="scss">
  .node {
    width: 100px;
    height: 50px;

    line-height: calc(50px / 1);
    text-align: center;

    flex: 1 1 auto;

    border: 1px solid #ccc;

    margin: 10px;

    position: absolute;
    top: var(--y, 200);
    left: var(--x, 200);
  }
</style>
