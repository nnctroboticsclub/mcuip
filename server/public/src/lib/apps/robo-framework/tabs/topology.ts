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

  config = {
    near_qq: 0,
    near_k: 0.7,
    near_len: 80,

    far_qq: -5e4,
    far_k: 0,
    far_len: 300,

    node_w: 80,
    node_h: 80,

    wall_border: 20,
    wall_avoid: 0.1,

    force_factor: 1.2,

  }

  public get_ticks(): Writable<number> {
    return this.ticks;
  }

  public add_node(node: TopologyNode) {
    this.nodes.update(nodes => {
      return [...nodes, {
        data: node,
        pos: writable(new Position(
          Math.random() * 100,
          Math.random() * 100
        )),
        debug: writable(""),
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

  calc_force_coulomb(p1: Position, p2: Position, qq: number): [number, number] {
    const delta = p2.subtract(p1);
    const dist = delta.magnitude;

    if (dist == 0) return [0, 0];

    const force_siz = qq / dist / dist;
    const force = delta.multiply(force_siz / dist);

    const { x: f_x, y: f_y } = force.components();
    return [f_x, f_y];
  }

  calc_force_coil(p1: Position, p2: Position, x0: number, k: number): [number, number] {
    const delta = p2.subtract(p1);
    const dist = delta.magnitude;

    if (dist == 0) return [0, 0];

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
      map(n2 => {
        const f_q = this.calc_force_coulomb(
          get(node.pos), get(n2.pos),
          this.config.near_qq
        );

        const f_c = this.calc_force_coil(
          get(node.pos),
          get(n2.pos),
          this.config.near_len,
          this.config.near_k
        );

        return [f_q[0] + f_c[0], f_q[1] + f_c[1]];
      }).
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
      map(n2 => {
        const f_q = this.calc_force_coulomb(
          get(node.pos), get(n2.pos),
          this.config.far_qq
        );

        const f_c = this.calc_force_coil(
          get(node.pos), get(n2.pos),
          this.config.far_len,
          this.config.far_k
        );

        return [f_q[0] + f_c[0], f_q[1] + f_c[1]];
      }).
      reduce((acc, [dx, dy]) =>
        [acc[0] + dx, acc[1] + dy],
        [0, 0]
      ).
      map(x => not_linked_nodes.length ? x / not_linked_nodes.length : 0);

    return force_not_linked as [number, number];
  }

  calc_force_avoid_wall(node: Topo): [number, number] {
    const border = this.config.wall_border;

    const { x, y } = get(node.pos).components();

    const w = get(this.width);
    const h = get(this.height);

    let force_x = 0;
    if (x < border) {
      force_x = border - x;
    } else if (x + this.config.node_w > w - border) {
      force_x = w - border - (x + this.config.node_w);
    }

    let force_y = 0;
    if (y < border) {
      force_y = border - y;
    } else if (y + this.config.node_h > h - border) {
      force_y = h - border - (y + this.config.node_h);
    }

    return [this.config.wall_avoid * force_x, this.config.wall_avoid * force_y];
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

    return [force[0] * this.config.force_factor, force[1] * this.config.force_factor];
  }

  check_integrity() {
    return [...get(this.nodes)]
      .every(n => {
        const { x, y } = get(n.pos).components();
        return !isNaN(x) && !isNaN(y);
      });
  }

  replace_random() {
    this.nodes.update(nodes => {
      return nodes.map(n => {
        return {
          ...n,
          pos: writable(new Position(
            Math.random() * 500,
            Math.random() * 500
          ))
        };
      });
    });
  }

  public tick() {
    if (!this.check_integrity()) {
      this.replace_random();
      return;
    }

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