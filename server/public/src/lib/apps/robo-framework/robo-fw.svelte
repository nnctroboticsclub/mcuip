<script lang="ts">
  import { onMount } from "svelte";
  import { App } from "./korobo2023nc";

  import { ready } from "./state/status";

  const app = App.new_instance();
  onMount(() => {
    const interval = setInterval(() => {
      app.tick();
    }, 50);

    $ready = true;

    return () => {
      clearInterval(interval);
    };
  });
</script>

<div class="container">
  <div class="debugger"></div>
  <div class="vbar" />
  <div class="logging">
    a
    <div class="hbar"></div>
    a
  </div>
</div>

<style lang="scss">
  .vbar {
    width: 1px;
    height: 100%;
    background-color: #888;

    margin: 0 10px;
  }

  .hbar {
    width: 100%;
    height: 1px;
    background-color: #888;

    margin: 10px 0;
  }

  .container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;

    .debugger {
      flex: 1;
    }

    .logging {
      flex: 0 0 200px;
    }
  }
</style>
