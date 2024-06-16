<script lang="ts">
  import DragTarget from "$lib/dragger/drag_target.svelte";
  import type { Topo } from "./topology";
  import type { TopologyNode } from "./topology";

  export let node: Topo;
  export let tag: string;

  let data = node.data;
  let force = node.force;
  let debug = node.debug;
  let pos = node.pos;

  let name = data.name;
  let wake_time = data.wake_time;
  let fep_addr = data.fep_addr;
</script>

<DragTarget area_tag={tag} pos={node.pos}>
  <div class="node">
    {name}
  </div>
</DragTarget>

<style lang="scss">
  .node {
    width: 100px;
    height: 50px;

    line-height: 50px;
    text-align: center;

    flex: 1 1 auto;

    border: 1px solid #ccc;

    margin: 10px;

    position: absolute;
    top: var(--y, 200);
    left: var(--x, 200);
  }
</style>
