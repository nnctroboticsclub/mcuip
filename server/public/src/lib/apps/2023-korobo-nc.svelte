<script lang="ts">
  import Window from "../window/window.svelte";
  import { shared_data } from "$lib/shared_data/global";
  import GlobalDataListPart from "./global_data_list_part.svelte";
  import Joystick from "$lib/ui/joystick.svelte";

  const store = shared_data.dataListStore();

  let x0: number, y0: number;
  let x1: number, y1: number;
  let x2: number, y2: number;
  let x3: number, y3: number;
  let x4: number, y4: number;
  let x5: number, y5: number;
</script>

<Window>
  <svelte:fragment slot="title"
    >うおおおおおおおおおお 2023 交ロボ</svelte:fragment
  >
  <svelte:fragment slot="app">
    <div class="container">
      <Joystick radius={100} bind:x_val={x0} bind:y_val={y0} tag="j0" />
      <Joystick radius={100} bind:x_val={x1} bind:y_val={y1} tag="j1" />
      <Joystick radius={100} bind:x_val={x2} bind:y_val={y2} tag="j2" />

      <Joystick radius={100} bind:x_val={x3} bind:y_val={y3} tag="j3" />
      <Joystick radius={100} bind:x_val={x4} bind:y_val={y4} tag="j4" />
      <Joystick radius={100} bind:x_val={x5} bind:y_val={y5} tag="j5" />
    </div>
  </svelte:fragment>
</Window>

<style>
  .container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
</style>
