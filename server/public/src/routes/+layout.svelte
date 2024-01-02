<script lang="ts">
  import { global_state } from "../global_state";
  import "ress/ress.css";

  const background = global_state.theme.app.background_color;
  const title_bar_color = global_state.theme.app.appbar_color;
  const app_name = global_state.app_name;
  const app_bar_show = global_state.app_bar_show;
</script>

<main style="background-color: {$background};">
  <div
    style="background-color: {$title_bar_color};"
    class="app-bar"
    class:app-bar-showed={$app_bar_show}
  >
    {$app_name}
  </div>
  <div class="container"><slot /></div>
</main>

<style>
  main {
    position: fixed;
    right: env(safe-area-inset-right);
    left: env(safe-area-inset-left);
    top: env(safe-area-inset-top);
    bottom: env(safe-area-inset-bottom);

    display: flex;
  }

  div.container {
    flex: 1 0 auto;
  }

  div.app-bar {
    flex: 0 0 2em;
    display: none;
  }

  div.app-bar-showed {
    display: inline-block;
  }
</style>
