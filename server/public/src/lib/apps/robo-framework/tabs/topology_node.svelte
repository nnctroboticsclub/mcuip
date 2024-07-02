<script lang="ts">
  import DragTarget from "$lib/dragger/drag_target.svelte";
  import BreadCrumbContext from "$lib/ui/breadcrumb/breadcrumb";
  import TopoDevice from "./topo_device.svelte";
  import type { Topo } from "./topology";

  export let node: Topo;
  export let tag: string;

  const breadcrumb_ctx = BreadCrumbContext.getContext();

  let data = node.data;

  let debug = node.debug;
  let name = data.name;
</script>

<DragTarget area_tag={tag} pos={node.pos}>
  <div
    class="node"
    on:click={() => {
      breadcrumb_ctx.add(name, TopoDevice, { node });
    }}
  >
    {name} <br />
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
    border-radius: 5px;

    margin: 10px;

    position: absolute;
    top: var(--y, 200);
    left: var(--x, 200);
  }
</style>
