<script lang="ts">
  import VertialSlider from "$lib/ui/vertial_slider.svelte";

  export let global_factor: number;
  export let l_factor: number;
  export let r_factor: number;

  let g_slider = global_factor - 1;
  $: global_factor = (g_slider + 1) / 2;

  let l_slider = l_factor / 2 - 1;
  $: l_factor = l_slider + 1;

  let r_slider = r_factor / 2 - 1;
  $: r_factor = r_slider + 1;
</script>

<div class="container">
  (L, R) = {global_factor.toFixed(5)} * ({l_factor.toFixed(5)}, {r_factor.toFixed(
    5
  )})<br /> Global <br />
  <VertialSlider
    height={40}
    width={10}
    bind:value={g_slider}
    style="width: 80%;"
  ></VertialSlider>

  L Factor<br />
  <VertialSlider
    height={40}
    width={10}
    bind:value={l_slider}
    style="width: 80%;"
  ></VertialSlider>

  R Factor<br />
  <VertialSlider
    height={40}
    width={10}
    bind:value={r_slider}
    style="width: 80%;"
  ></VertialSlider>
</div>

<style lang="scss">
  div.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    height: 100%;
    width: 100%;
  }
</style>
