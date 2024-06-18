<script lang="ts">
  import { onMount } from "svelte";
  import Topology from "./topology";
  import TopologyNode from "./topology_node.svelte";
  import { get, writable } from "svelte/store";
  import DraggableArea from "$lib/dragger/draggable_area.svelte";
  import TopologyLink from "./topology_link.svelte";

  let topology = new Topology();

  topology.add_node({
    name: "Robot1",
    wake_time: writable(10),
    fep_addr: writable("01h"),
  });

  topology.add_node({
    name: "Robot2",
    wake_time: writable(20),
    fep_addr: writable("02h"),
  });

  topology.add_node({
    name: "Robot3-1",
    wake_time: writable(30),
    fep_addr: writable("03h"),
  });

  topology.add_node({
    name: "Robot3-2",
    wake_time: writable(40),
    fep_addr: writable("04h"),
  });

  topology.add_node({
    name: "Robot3-3",
    wake_time: writable(50),
    fep_addr: writable("05h"),
  });

  topology.add_node({
    name: "Ctrl1",
    wake_time: writable(70),
    fep_addr: writable("07h"),
  });

  topology.add_node({
    name: "Ctrl2",
    wake_time: writable(80),
    fep_addr: writable("08h"),
  });

  topology.add_node({
    name: "Ctrl3",
    wake_time: writable(90),
    fep_addr: writable("09h"),
  });
  topology.add_node({
    name: "Debugger",
    wake_time: writable(100),
    fep_addr: writable("80h"),
  });

  const names = [
    "Robot1",
    "Robot2",
    "Robot3-1",
    "Robot3-2",
    "Robot3-3",
    "Ctrl1",
    "Ctrl2",
    "Ctrl3",
    "Debugger",
  ];

  for (let i = 0; i < names.length; i++) {
    for (let j = i + 1; j < names.length; j++) {
      topology.add_link(names[i], names[j]);
    }
  }

  /* topology.add_link("Robot1", "Ctrl1");
  topology.add_link("Robot3-1", "Ctrl1");

  topology.add_link("Robot2", "Ctrl2");
  topology.add_link("Robot3-2", "Ctrl2");

  topology.add_link("Robot3-3", "Ctrl3");

  topology.add_link("Robot1", "Robot3-2");
  topology.add_link("Ctrl3", "Robot3-1");
  topology.add_link("Robot2", "Robot3-3");

  topology.add_link("Ctrl1", "Debugger");
  topology.add_link("Ctrl2", "Debugger");
  topology.add_link("Ctrl3", "Debugger");
  topology.add_link("Robot1", "Debugger");
  topology.add_link("Robot2", "Debugger");
  topology.add_link("Robot3-1", "Debugger");
  topology.add_link("Robot3-2", "Debugger");
  topology.add_link("Robot3-3", "Debugger"); */

  let nodes = topology.get_nodes();
  let links = topology.get_links();

  onMount(() => {
    console.log("Topology mounted");
    const interval1 = setInterval(() => {
      topology.tick();
    }, 1000 / 30);

    return () => {
      clearInterval(interval1);
    };
  });

  let container: HTMLDivElement | undefined = undefined;
  let width: number;
  let height: number;
  $: {
    width = container?.clientWidth ?? 0;
    height = container?.clientHeight ?? 0;
  }

  $: topology.set_width(width);
  $: topology.set_height(height);
</script>

<div class="container" bind:this={container}>
  <DraggableArea top={0} left={0} {height} {width} tag="aaaaaa">
    {#each $nodes as node}
      <TopologyNode tag="aaaaaa" {node} />
    {/each}

    {#each $links as link}
      <TopologyLink from_key={link.from} to_key={link.to} {topology} />
    {/each}
  </DraggableArea>
</div>

<style lang="scss">
  .container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;

    flex-wrap: wrap;

    position: relative;
  }
</style>
