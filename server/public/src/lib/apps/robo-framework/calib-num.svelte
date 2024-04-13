<script>
  import Button from "$lib/ui/button.svelte";
  import VertialSlider from "$lib/ui/vertial_slider.svelte";

  export let value = 0;

  let slider = value - 1;

  $: value = (slider + 1) / 2;
</script>

<div class="container">
  {value.toFixed(5)}
  <VertialSlider height={40} width={10} bind:value={slider} style="width: 80%;"
  ></VertialSlider>
</div>

<style lang="scss">
  div.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    height: 100%;
  }
</style>
