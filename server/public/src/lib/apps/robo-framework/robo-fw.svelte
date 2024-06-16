<script lang="ts">
  import { onMount } from "svelte";
  import { App } from "./korobo2023nc";

  import { ready } from "./state/status";
  import TabContainer from "$lib/ui/tab/tab-container.svelte";
  import TabContent from "$lib/ui/tab/tab-content.svelte";
  import Topology from "./tabs/topology.svelte";

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
  <div class="debugger">
    <TabContainer tag="debugger" height="100%" names={["Topology", "Logging"]}>
      <TabContent name="Topology">
        <Topology />
      </TabContent>
      <TabContent name="Logging">Logging</TabContent>
    </TabContainer>
  </div>
  <div class="vbar" />
  <div class="logging"></div>
</div>

<style lang="scss">
  .vbar {
    width: 1px;
    height: calc(100% - 10px);
    background-color: #ccc;

    margin: 0 10px;
    padding: 5px 0;

    transform: translateY(5px);
  }

  .hbar {
    width: 100%;
    height: 1px;
    background-color: #ccc;

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
