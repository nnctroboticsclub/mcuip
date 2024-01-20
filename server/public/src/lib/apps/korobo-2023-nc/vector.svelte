<script>
  import { writable } from "svelte/store";

  export let radius = writable(200);
  export let theta = writable(0); // radians
</script>

<div class="container">
  <div
    class="arrow"
    style="transform: rotate({$theta}rad); height: {$radius}px;"
  ></div>
</div>

<style>
  .container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .arrow {
    position: absolute;
    width: 10px;
    height: 100%;
    background-color: #f008;
    background-size: contain;
  }
</style>
