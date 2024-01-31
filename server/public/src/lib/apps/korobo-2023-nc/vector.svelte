<script>
  import { writable } from "svelte/store";

  export let radius = writable(200);
  export let theta = writable(0); // degrees
</script>

<div class="container">
  <div
    class="arrow"
    style="transform: rotate({$theta + 90}deg); height: {$radius}px;"
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
  .arrow::after {
    content: "";
    display: block;
    background-color: #f008;
    width: 20px;
    height: 20px;
    clip-path: polygon(0 100%, 100% 100%, 50% 0);
    transform: translate(-25%, -100%);
  }
</style>
