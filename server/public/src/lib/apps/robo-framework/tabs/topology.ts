import { Position } from "$lib/ui/position";
import { get, writable, type Writable } from "svelte/store";

export type TopologyNode = {
  name: string;
  wake_time: Writable<number>;
  fep_addr: Writable<string>;
};


export type Topo = {
  data: TopologyNode,
  pos: Writable<Position>,
  debug: Writable<string>;
  force: Writable<{
    x: number,
    y: number
  }>
};
export default class Topology {
  nodes: Writable<Topo[]> = writable([]);
  links: Writable<{ from: string, to: string }[]> = writable([]);
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
          Math.random() * 200,
          Math.random() * 200
        )),
        debug: writable(""),
        force: writable({ x: 0, y: 0 })
      }];
    });
  }

  public get_nodes(): Writable<Topo[]> {
    return this.nodes;
  }

  public add_link(from: string, to: string) {
    this.links.update(links => {
      return [...links, { from, to }];
    });
  }

  public get_links(): Writable<{ from: string, to: string }[]> {
    return this.links;
  }

  public set_width(width: number) {
    this.width.set(width);
  }

  public set_height(height: number) {
    this.height.set(height);
  }


  calc_force_linked(n1: Topo, n2: Topo): [number, number] {
    const n1_pos = get(n1.pos);
    const n2_pos = get(n2.pos);

    const delta = n2_pos.subtract(n1_pos);

    const dist = delta.magnitude;
    const x = dist - 120;

    const force_siz = 0.5 * x;
    const force = delta.multiply(force_siz / dist);

    const { x: f_x, y: f_y } = force.components();
    return [f_x, f_y];
  }
  calc_force_not_linked(n1: Topo, n2: Topo): [number, number] {
    const n1_pos = get(n1.pos);
    const n2_pos = get(n2.pos);

    let delta = n2_pos.subtract(n1_pos);

    const dist = delta.magnitude;
    const x = dist - 200;

    const force_siz = 0.5 * x;
    const force = delta.multiply(force_siz / dist);

    const { x: f_x, y: f_y } = force.components();
    return [f_x, f_y];
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

    return [force_x, force_y];
  }

  calc_force(nodes: Topo[], node: Topo) {
    let node_name = node.data.name;

    let linked_nodes = get(this.links).
      map(({ from, to }) =>
        from === node_name ? to
          : to === node_name ? from
            : undefined
      ).
      filter(Boolean).
      map(n_name => nodes.find(n => n.data.name === n_name)).
      filter(Boolean) as Topo[];

    let force_linked = linked_nodes.
      map(n2 => this.calc_force_linked(node, n2)).
      reduce((acc, [dx, dy]) =>
        [acc[0] + dx, acc[1] + dy],
        [0, 0]
      ).
      map(x => linked_nodes.length ? x / linked_nodes.length : 0);


    let force_avoid_wall = this.calc_force_avoid_wall(node);

    let not_linked_nodes = nodes.filter(n => !linked_nodes.includes(n) && n !== node);

    let force_not_linked = not_linked_nodes.
      map(n2 => this.calc_force_not_linked(node, n2)).
      reduce((acc, [dx, dy]) =>
        [acc[0] + dx, acc[1] + dy],
        [0, 0]
      ).
      map(x => not_linked_nodes.length ? x / not_linked_nodes.length : 0);


    let force = [...new Array(2)].map((_, i) => {
      return 1.2 * (force_linked[i] + force_avoid_wall[i] + force_not_linked[i]);
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
        let force = this.calc_force(nodes, n);

        n.force.update(_ => {
          return {
            x: force[0],
            y: force[1]
          };
        });

        // n.debug.update(_ => `${get(n.data.name)} ${JSON.stringify(get(n.pos).components())}`)

        return n;
      });

      const [mean_x, mean_y] = forced_nodes.
        map(n => get(n.pos).components()).
        reduce((acc, { x, y }) => [acc[0] + x, acc[1] + y], [0, 0]).
        map(x => x / forced_nodes.length);
      let w = get(this.width);
      let h = get(this.height);

      const p1 = new Position(mean_x, mean_y);
      const p2 = new Position(w / 2, h / 2);

      forced_nodes.forEach(n => {
        const p_f = new Position(get(n.force).x, get(n.force).y);
        n.pos.update(p => {
          const raw_p = p
            .subtract(p1)
            .add(p_f).add(p2);

          let s: string[] = [`${raw_p}`];

          let { x, y } = raw_p.components();
          if (x < 0) {
            x = 0;
            s.push("x < 0");
          } else if (x > w - 20) {
            x = w - 20;
            s.push("x > w - 20");
          }

          if (y < 0) {
            y = 0;
            s.push("y < 0");
          } else if (y > h - 20) {
            y = h - 20;
            s.push("y > h - 20");
          }

          // n.debug.update(_ => s.join(", "));

          return new Position(x, y);
        });
      });

      return forced_nodes;
    });
  }
}