<script lang="ts">
  import { global_state } from "../global_state";
  import ress from "ress/ress.css";

  const background = global_state.theme.global_background_color;
  const title_bar_color = global_state.theme.title_bar_color;
  const app_name = global_state.app_name;
</script>

<svelte:head>
  <link rel="stylesheet" href={ress} />
</svelte:head>

<main style="background-color: {$background};">
  <div style="background-color: {$title_bar_color};" class="app-bar">
    {$app_name}
  </div>
  <div class="container"><slot /></div>
</main>

<style>
  main {
    position: absolute;
    top: 0;
    left: 0;

    display: block;
    height: 100%;
    width: 100%;
  }

  div.container {
    position: fixed;
    top: 2em;
    left: 0;
    right: 0;
    bottom: 0;

    margin: 10px;
  }

  div.app-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 2em;

    display: inline-block;
  }
</style>
