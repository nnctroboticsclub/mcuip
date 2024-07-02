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

  const delta = new Position(10 + 50, 10 + 25);

  const min = derived([from.pos, to.pos], ([$a, $b]) => $a.min($b).add(delta));

  const style = derived(min, ($max) => $max.getStyle());

  const transform = derived([from.pos, to.pos, min], ([$f, $t, $min]) => {
    const $a = $f.subtract($f.min($t)).components();
    const $b = $t.subtract($f.min($t)).components();

    const angle = Math.atan2($b.y - $a.y, $b.x - $a.x) * (180 / Math.PI);

    return [`translate(${$a.x}, ${$a.y})`, `rotate(${angle})`].join(" ");
  });

  const svg = derived([from.pos, to.pos, min], ([$f, $t]) => {
    const $a = $f.subtract($f.min($t));
    const $b = $t.subtract($f.min($t));

    const dist = $b.subtract($a).magnitude;
    if (!label) {
      // uni direction
      return [`M 0 0`, `L ${dist} 0`].join(" ");
    }

    return [`M 0 0`, `L ${dist} 0`, `l -20 10`, `l 0 -20`, `l 20 10`].join(" ");
  });
</script>

<div class="link" style={$style}>
  <svg>
    <path
      d={$svg}
      stroke="#888"
      stroke-width="1px"
      fill=""
      transform={$transform}
    />
  </svg>
</div>

<style lang="scss">
  .link {
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
