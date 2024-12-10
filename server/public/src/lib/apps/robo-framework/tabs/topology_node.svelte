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

  const size = 20;
</script>

<DragTarget area_tag={tag} pos={node.pos}>
  <div
    class="node"
    style="--size: {size}px;"
    on:click={() => {
      // breadcrumb_ctx.add(name, TopoDevice, { node });
    }}
  >
    <!-- {name} <br /> -->
  </div>
</DragTarget>

<style lang="scss">
  .node {
    background-color: #fff;

    width: var(--size);
    height: var(--size);

    line-height: calc(50 / 1);
    text-align: center;

    flex: 1 1 auto;

    border: 1px solid #aaa;
    border-radius: 50%;

    position: absolute;
    top: var(--y, 200);
    left: var(--x, 200);
  }
</style>
