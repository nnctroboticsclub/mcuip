<script lang="ts">
  import DragTarget from "$lib/dragger/drag_target.svelte";
  import { derived, get } from "svelte/store";
  import type Topology from "./topology";
  import type { Topo } from "./topology";
  import { Position } from "$lib/ui/position";

  export let from_key: string;
  export let to_key: string;
  export let label: string | undefined;
  export let topology: Topology;

  let nodes = topology.get_nodes();

  const from = get(nodes).find((node) => node.data.name === from_key) as Topo;
  const to = get(nodes).find((node) => node.data.name === to_key) as Topo;

  const delta = new Position(10, 10); // offset

  const svg = derived([from.pos, to.pos], ([$f, $t]) => {
    // Determine the start and end points of the line
    const f_l1_distance = $f.components().x + $f.components().y;
    const t_l1_distance = $t.components().x + $t.components().y;

    const start = f_l1_distance < t_l1_distance ? $f : $t;
    const end = f_l1_distance < t_l1_distance ? $t : $f;

    const start_point = start.add(delta).components();
    const end_point = end.add(delta).components();

    const commands_line = [
      `M ${start_point.x.toFixed(0)} ${start_point.y.toFixed(0)}`,
      `L ${end_point.x.toFixed(0)} ${end_point.y.toFixed(0)}`,
    ];

    if (!label) {
      return commands_line.join(" ");
    }

    return [...commands_line, `l -20 10`, `l 0 -20`, `l 20 10`].join(" ");
  });
</script>

<svg class="absolute size-full">
  <path d={$svg} stroke="#888" stroke-width="1px" fill="" />
</svg>
