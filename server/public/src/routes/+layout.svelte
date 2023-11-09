<script lang="ts">
  import { theme } from "../theme";

  const background = theme.app_background;
</script>

<main style="background-color: {$background};">
  <slot />
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
</style>
