import { Position } from "$lib/ui/position";
import { get, writable, type Writable } from "svelte/store";

export type TopologyNode = {
  name: string;
  wake_time: Writable<number>;
  fep_addr: Writable<string>;
};

export type Link = {
  from: string,
  to: string,
  label: string | undefined, // undefined: non directional link
};

export type Topo = {
  data: TopologyNode,
  pos: Writable<Position>,
  debug: Writable<string>;
};
export default class Topology {
  nodes: Writable<Topo[]> = writable([]);
  links: Writable<Link[]> = writable([]);
  ticks: Writable<number> = writable(0);

  width: Writable<number> = writable(0);
  height: Writable<number> = writable(0);

  public get_ticks(): Writable<number> {
    return this.ticks;
  }

  public add_node(node: TopologyNode) {
    this.nodes.update(nodes => {
      return [...nodes, {
        data: node,
        pos: writable(new Position(
          Math.random() * 0.0001,
          Math.random() * 0.0001
        )),
        debug: writable(""),
        velocity: writable({ x: 0, y: 0 })
      }];
    });
  }

  public get_nodes(): Writable<Topo[]> {
    return this.nodes;
  }

  public add_link(from: string, to: string) {
    this.links.update(links => {
      return [...links, { from, to, label: undefined }];
    });
  }
  public add_link_uni_directional(from: string, to: string, label: string) {
    this.links.update(links => {
      return [...links, { from, to, label }];
    });
  }

  public get_links(): Writable<Link[]> {
    return this.links;
  }

  public set_width(width: number) {
    this.width.set(width);
  }

  public set_height(height: number) {
    this.height.set(height);
  }

  get_linked_nodes(node_name: string): Topo[] {
    return get(this.links).
      map(({ from, to }) =>
        from === node_name ? to
          : to === node_name ? from
            : undefined
      ).
      filter(Boolean).
      map(n_name => get(this.nodes).find(n => n.data.name === n_name)).
      filter(Boolean) as Topo[]
  }

  get_not_linked_nodes(node_name: string): Topo[] {
    const nodes = get(this.nodes);
    const linked_nodes = this.get_linked_nodes(node_name);

    return nodes
      .filter(n => !linked_nodes.includes(n) && n.data.name !== node_name);
  }


  calc_force_coil(p1: Position, p2: Position, x0: number, k: number): [number, number] {
    const delta = p2.subtract(p1);
    const dist = delta.magnitude;

    const x = dist - x0;

    const force_siz = k * x;
    const force = delta.multiply(force_siz / dist);

    const { x: f_x, y: f_y } = force.components();
    return [f_x, f_y];
  }

  calc_force_linked(node: Topo): [number, number] {
    const node_name = node.data.name;

    const linked_nodes = this.get_linked_nodes(node_name);

    const force_linked = linked_nodes.
      map(n2 => this.calc_force_coil(
        get(node.pos),
        get(n2.pos),
        100,
        0.3
      )).
      reduce((acc, [dx, dy]) =>
        [acc[0] + dx, acc[1] + dy],
        [0, 0]
      ).
      map(x => linked_nodes.length ? x / linked_nodes.length : 0);


    return force_linked as [number, number];
  }

  calc_force_not_linked(node: Topo): [number, number] {
    const node_name = node.data.name;

    const not_linked_nodes = this.get_not_linked_nodes(node_name);

    const force_not_linked = not_linked_nodes.
      map(n2 => this.calc_force_coil(
        get(node.pos), get(n2.pos),
        250, 0.2
      )).
      reduce((acc, [dx, dy]) =>
        [acc[0] + dx, acc[1] + dy],
        [0, 0]
      ).
      map(x => not_linked_nodes.length ? x / not_linked_nodes.length : 0);

    return force_not_linked as [number, number];
  }

  calc_force_avoid_wall(node: Topo): [number, number] {
    const border = 20;
    const node_width = 200;
    const node_height = 100;

    const { x, y } = get(node.pos).components();

    const w = get(this.width);
    const h = get(this.height);

    let force_x = 0;
    if (x < border) {
      force_x = border - x;
    } else if (x + node_width > w - border) {
      force_x = w - border - (x + node_width);
    }

    let force_y = 0;
    if (y < border) {
      force_y = border - y;
    } else if (y + node_height > h - border) {
      force_y = h - border - (y + node_height);
    }

    return [0.2 * force_x, 0.2 * force_y];
  }

  calc_force(node: Topo) {
    let force_linked = this.calc_force_linked(node);
    let force_avoid_wall = this.calc_force_avoid_wall(node);
    let force_not_linked = this.calc_force_not_linked(node);

    let force = [...new Array(2)].map((_, i) => {
      return force_linked[i] + force_avoid_wall[i] + force_not_linked[i];
    });

    let force_power = Math.sqrt(force[0] * force[0] + force[1] * force[1]);
    if (force_power > 10) {
      force = force.map(x => x / force_power * 10);
    }

    return force;
  }

  public tick() {
    this.ticks.update(count => count + 1);
    this.nodes.update(nodes => {
      const forced_nodes = nodes.map(n => {
        let force = this.calc_force(n);

        n.pos.update(p => {
          const v = new Position(force[0], force[1]);
          return p.add(v);
        });

        return n;
      });

      const [mean_x, mean_y] = forced_nodes.
        map(n => get(n.pos).components()).
        reduce((acc, { x, y }) => [acc[0] + x, acc[1] + y], [0, 0]).
        map(x => x / forced_nodes.length);
      /* const { x: mean_x, y: mean_y } = forced_nodes
        .map(n => get(n.pos))
        .reduce((a, p) => p.max(p2), new Position(Infinity, Infinity))
        .max(new Position(50, 50))
        .components(); */

      let w = get(this.width);
      let h = get(this.height);

      const p1 = new Position(mean_x, mean_y);
      const p2 = new Position(w / 2, h / 2);

      forced_nodes.forEach(n => {
        n.pos.update(p => {
          const raw_p = p
            .subtract(p1)
            .add(p2);

          let { x, y } = raw_p.components();
          if (x < 0) {
            x = 0;
          } else if (x > w - 20) {
            x = w - 20;
          }

          if (y < 0) {
            y = 0;
          } else if (y > h - 20) {
            y = h - 20;
          }

          return new Position(x, y);
        });
      });

      return forced_nodes;
    });
  }
}