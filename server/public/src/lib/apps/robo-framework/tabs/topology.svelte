<script lang="ts">
  import { onMount } from "svelte";
  import Topology from "./topology";
  import TopologyNode from "./topology_node.svelte";
  import { get, writable } from "svelte/store";
  import DraggableArea from "$lib/dragger/draggable_area.svelte";
  import TopologyLink from "./topology_link.svelte";

  let topology = new Topology();

  for (let i = 0; i < 60; i++) {
    topology.add_node({
      name: `a${i}`,
      wake_time: writable(0),
      fep_addr: writable("01h"),
    });
  }

  for (let i = 0; i < 60; i++) {
    const from_n = Math.floor(Math.random() * (60 - 0.1));
    const to_n = Math.floor(Math.random() * (60 - 0.1));

    const from = `a${from_n}`;
    const to = `a${to_n}`;

    topology.add_link(from, to);
  }

  let nodes = topology.get_nodes();
  let ticks = topology.get_ticks();
  let links = topology.get_links();

  let start = new Date().getTime();

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
  console.log("Topo");
  $: {
    width = container?.clientWidth ?? 0;
    height = container?.clientHeight ?? 0;

    console.log(`w${width}, h${height}`);
  }

  $: topology.set_width(width);
  $: topology.set_height(height);
</script>

<div class="size-full" bind:this={container}>
  <span class="absolute top-0 left-0">
    {(($ticks / (new Date().getTime() - start)) * 1000).toFixed(1)} tps <br />
  </span>
  <DraggableArea top={0} left={0} {height} {width} tag="aaaaaa">
    {#each $nodes as node}
      <TopologyNode tag="aaaaaa" {node} />
    {/each}

    {#each $links as link}
      <TopologyLink
        from_key={link.from}
        to_key={link.to}
        label={link.label}
        {topology}
      />
    {/each}
  </DraggableArea>
</div>
