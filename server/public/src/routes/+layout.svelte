<script lang="ts">
  import { global_state } from "../global_state";
  import "ress/ress.css";
  import "../app.css";

  const background = global_state.theme.framework.background_color;
  const title_bar_color = global_state.theme.framework.appbar_color;
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
  <div class="flex-1"><slot /></div>
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

  div.app-bar {
    flex: 0 0 2em;
    display: none;
  }

  * {
    -webkit-tap-highlight-color: transparent;
  }

  div.app-bar-showed {
    display: inline-block;
  }
</style>
